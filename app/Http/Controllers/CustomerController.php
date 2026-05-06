<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Customer::with(['user', 'services.product']);

        if ($user->role !== 'manager') {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('contact', 'like', '%' . $request->search . '%');
            });
        }

        $customers = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters'   => $request->only(['search']),
        ]);
    }

    public function show(Customer $customer)
    {
        $user = auth()->user();
        if ($user->role !== 'manager' && $customer->user_id !== $user->id) {
            abort(403);
        }

        $customer->load(['user', 'services.product', 'lead']);

        return Inertia::render('Customers/Show', [
            'customer' => $customer,
        ]);
    }
}
