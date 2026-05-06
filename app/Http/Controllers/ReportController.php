<?php

namespace App\Http\Controllers;

use App\Exports\ReportExport;
use App\Models\Customer;
use App\Models\Lead;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isManager = $user->role === 'manager';

        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate   = $request->input('end_date', now()->toDateString());

        // Leads Report
        $leadsQuery = Lead::with('user')
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
        if (!$isManager) {
            $leadsQuery->where('user_id', $user->id);
        }
        $leads = $leadsQuery->get();

        // Projects Report
        $projectsQuery = Project::with(['lead', 'user', 'items.product'])
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
        if (!$isManager) {
            $projectsQuery->where('user_id', $user->id);
        }
        $projects = $projectsQuery->get();

        // Customers Report
        $customersQuery = Customer::with(['services.product', 'user'])
            ->whereBetween('created_at', [$startDate . ' 00:00:00', $endDate . ' 23:59:59']);
        if (!$isManager) {
            $customersQuery->where('user_id', $user->id);
        }
        $customers = $customersQuery->get();

        return Inertia::render('Reports/Index', [
            'leads'     => $leads,
            'projects'  => $projects,
            'customers' => $customers,
            'filters'   => [
                'start_date' => $startDate,
                'end_date'   => $endDate,
            ],
        ]);
    }

    public function export(Request $request)
    {
        $user = $request->user();
        $isManager = $user->role === 'manager';

        $startDate = $request->input('start_date', now()->startOfMonth()->toDateString());
        $endDate   = $request->input('end_date', now()->toDateString());

        $filename = 'laporan-crm-' . $startDate . '-sd-' . $endDate . '.xlsx';

        return Excel::download(
            new ReportExport($user, $isManager, $startDate, $endDate),
            $filename
        );
    }
}
