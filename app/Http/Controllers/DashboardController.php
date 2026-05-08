<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\Lead;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isManager = $user->role === 'manager';

        $leadsQuery = Lead::query();
        $projectsQuery = Project::query();
        $customersQuery = Customer::query();

        if (!$isManager) {
            $leadsQuery->where('user_id', $user->id);
            $projectsQuery->where('user_id', $user->id);
            $customersQuery->where('user_id', $user->id);
        }

        $totalLeads = $leadsQuery->count();
        $totalProjects = $projectsQuery->count();
        $totalCustomers = $customersQuery->count();
        $waitingApproval = (clone $projectsQuery)->where('status', 'waiting approval')->count();

        $recentLeads = (clone $leadsQuery)
            ->with('user')
            ->latest()
            ->take(5)
            ->get();

        $recentProjects = (clone $projectsQuery)
            ->with(['lead', 'user'])
            ->latest()
            ->take(5)
            ->get();

        // Lead status breakdown
        $leadStatusBreakdown = (clone $leadsQuery)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        // Project status breakdown
        $projectStatusBreakdown = (clone $projectsQuery)
            ->selectRaw('status, count(*) as count')
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        // Conversion rate
        $convertedLeads = (clone $leadsQuery)->where('status', 'converted')->count();
        $conversionRate = $totalLeads > 0 ? round(($convertedLeads / $totalLeads) * 100, 1) : 0;

        return Inertia::render('Dashboard', [
            'stats' => [
                'total_leads'       => $totalLeads,
                'total_projects'    => $totalProjects,
                'total_customers'   => $totalCustomers,
                'waiting_approval'  => $waitingApproval,
            ],
            'recentLeads'               => $recentLeads,
            'recentProjects'            => $recentProjects,
            'leadStatusBreakdown'       => $leadStatusBreakdown,
            'projectStatusBreakdown'    => $projectStatusBreakdown,
            'conversionRate'            => $conversionRate,
        ]);
    }
}
