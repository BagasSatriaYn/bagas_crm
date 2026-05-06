<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Lead::with('user');

        if ($user->role !== 'manager') {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('contact', 'like', '%' . $request->search . '%');
            });
        }

        $leads = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Leads/Index', [
            'leads'   => $leads,
            'filters' => $request->only(['status', 'search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Leads/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'contact' => 'required|string|max:255',
            'address' => 'required|string',
            'needs'   => 'required|string',
            'status'  => 'required|in:new,contacted,negotiation,converted,lost',
        ]);

        $validated['user_id'] = $request->user()->id;

        Lead::create($validated);

        return redirect()->route('leads.index')
            ->with('success', 'Lead berhasil ditambahkan.');
    }

    public function edit(Lead $lead)
    {
        $this->authorizeAccess($lead);

        return Inertia::render('Leads/Edit', [
            'lead' => $lead,
        ]);
    }

    public function update(Request $request, Lead $lead)
    {
        $this->authorizeAccess($lead);

        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'contact' => 'required|string|max:255',
            'address' => 'required|string',
            'needs'   => 'required|string',
            'status'  => 'required|in:new,contacted,negotiation,converted,lost',
        ]);

        $lead->update($validated);

        return redirect()->route('leads.index')
            ->with('success', 'Lead berhasil diperbarui.');
    }

    public function destroy(Lead $lead)
    {
        $this->authorizeAccess($lead);
        $lead->delete();

        return redirect()->route('leads.index')
            ->with('success', 'Lead berhasil dihapus.');
    }

    private function authorizeAccess(Lead $lead)
    {
        $user = auth()->user();
        if ($user->role !== 'manager' && $lead->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke lead ini.');
        }
    }
}
