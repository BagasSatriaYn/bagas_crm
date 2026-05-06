<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\CustomerService;
use App\Models\Lead;
use App\Models\Product;
use App\Models\Project;
use App\Models\ProjectItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Project::with(['lead', 'user', 'items.product']);

        if ($user->role !== 'manager') {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $projects = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Projects/Index', [
            'projects' => $projects,
            'filters'  => $request->only(['status']),
        ]);
    }

    public function create(Request $request)
    {
        $user = $request->user();
        $leadsQuery = Lead::where('status', '!=', 'converted')
                          ->where('status', '!=', 'lost');

        if ($user->role !== 'manager') {
            $leadsQuery->where('user_id', $user->id);
        }

        return Inertia::render('Projects/Create', [
            'leads'    => $leadsQuery->get(),
            'products' => Product::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'items'   => 'required|array|min:1',
            'items.*.product_id'       => 'required|exists:products,id',
            'items.*.negotiated_price' => 'required|integer|min:0',
        ]);

        $user = $request->user();

        // Cek apakah ada harga di bawah margin
        $hasBelowMargin = false;
        $itemsData = [];

        foreach ($validated['items'] as $item) {
            $product = Product::find($item['product_id']);
            $isBelowMargin = $item['negotiated_price'] < $product->selling_price;
            if ($isBelowMargin) {
                $hasBelowMargin = true;
            }
            $itemsData[] = array_merge($item, ['is_below_margin' => $isBelowMargin]);
        }

        $status = $hasBelowMargin ? 'waiting approval' : 'approved';

        $project = Project::create([
            'user_id' => $user->id,
            'lead_id' => $validated['lead_id'],
            'status'  => $status,
        ]);

        foreach ($itemsData as $item) {
            ProjectItem::create([
                'project_id'       => $project->id,
                'product_id'       => $item['product_id'],
                'negotiated_price' => $item['negotiated_price'],
                'is_below_margin'  => $item['is_below_margin'],
            ]);
        }

        // Update lead status to negotiation
        Lead::find($validated['lead_id'])->update(['status' => 'negotiation']);

        return redirect()->route('projects.index')
            ->with('success', $hasBelowMargin
                ? 'Project dibuat. Menunggu approval karena ada harga di bawah harga jual.'
                : 'Project berhasil dibuat dan otomatis approved.');
    }

    public function show(Project $project)
    {
        $this->authorizeAccess($project);

        $project->load(['lead', 'user', 'items.product']);

        return Inertia::render('Projects/Show', [
            'project' => $project,
        ]);
    }

    public function approve(Project $project)
    {
        $this->requireManager();

        $project->update(['status' => 'approved', 'reject_reason' => null]);

        return redirect()->back()->with('success', 'Project berhasil di-approve.');
    }

    public function reject(Request $request, Project $project)
    {
        $this->requireManager();

        $validated = $request->validate([
            'reject_reason' => 'required|string|max:500',
        ]);

        $project->update([
            'status'        => 'rejected',
            'reject_reason' => $validated['reject_reason'],
        ]);

        return redirect()->back()->with('success', 'Project ditolak.');
    }

    public function convert(Project $project)
    {
        $this->authorizeAccess($project);

        if ($project->status !== 'approved') {
            return redirect()->back()->with('error', 'Hanya project yang approved yang bisa dikonversi.');
        }

        $lead = $project->lead;

        // Buat customer dari lead
        $customer = Customer::create([
            'user_id' => $project->user_id,
            'lead_id' => $lead->id,
            'name'    => $lead->name,
            'contact' => $lead->contact,
            'address' => $lead->address,
        ]);

        // Buat customer services dari project items
        foreach ($project->items as $item) {
            CustomerService::create([
                'customer_id' => $customer->id,
                'product_id'  => $item->product_id,
                'deal_price'  => $item->negotiated_price,
            ]);
        }

        // Update lead status ke converted
        $lead->update(['status' => 'converted']);

        return redirect()->route('customers.index')
            ->with('success', 'Lead berhasil dikonversi menjadi customer aktif.');
    }

    private function authorizeAccess(Project $project)
    {
        $user = auth()->user();
        if ($user->role !== 'manager' && $project->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke project ini.');
        }
    }

    private function requireManager()
    {
        if (auth()->user()->role !== 'manager') {
            abort(403, 'Hanya Manager yang dapat melakukan aksi ini.');
        }
    }
}
