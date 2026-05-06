<?php

namespace App\Exports;

use App\Models\Customer;
use App\Models\Lead;
use App\Models\Project;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class ReportExport implements WithMultipleSheets
{
    public function __construct(
        private $user,
        private bool $isManager,
        private string $startDate,
        private string $endDate
    ) {}

    public function sheets(): array
    {
        return [
            'Leads'     => new LeadsSheet($this->user, $this->isManager, $this->startDate, $this->endDate),
            'Projects'  => new ProjectsSheet($this->user, $this->isManager, $this->startDate, $this->endDate),
            'Customers' => new CustomersSheet($this->user, $this->isManager, $this->startDate, $this->endDate),
        ];
    }
}

class LeadsSheet implements FromCollection, WithHeadings
{
    public function __construct(
        private $user,
        private bool $isManager,
        private string $startDate,
        private string $endDate
    ) {}

    public function headings(): array
    {
        return ['#', 'Nama Lead', 'Kontak', 'Alamat', 'Kebutuhan', 'Status', 'Sales', 'Tanggal'];
    }

    public function collection()
    {
        $query = Lead::with('user')
            ->whereBetween('created_at', [$this->startDate . ' 00:00:00', $this->endDate . ' 23:59:59']);

        if (!$this->isManager) {
            $query->where('user_id', $this->user->id);
        }

        return $query->get()->map(fn($lead, $i) => [
            $i + 1,
            $lead->name,
            $lead->contact,
            $lead->address,
            $lead->needs,
            $lead->status,
            $lead->user->name ?? '-',
            $lead->created_at->format('d/m/Y'),
        ]);
    }
}

class ProjectsSheet implements FromCollection, WithHeadings
{
    public function __construct(
        private $user,
        private bool $isManager,
        private string $startDate,
        private string $endDate
    ) {}

    public function headings(): array
    {
        return ['#', 'Lead', 'Status', 'Total Nilai (Rp)', 'Sales', 'Alasan Reject', 'Tanggal'];
    }

    public function collection()
    {
        $query = Project::with(['lead', 'user', 'items'])
            ->whereBetween('created_at', [$this->startDate . ' 00:00:00', $this->endDate . ' 23:59:59']);

        if (!$this->isManager) {
            $query->where('user_id', $this->user->id);
        }

        return $query->get()->map(fn($project, $i) => [
            $i + 1,
            $project->lead->name ?? '-',
            $project->status,
            $project->items->sum('negotiated_price'),
            $project->user->name ?? '-',
            $project->reject_reason ?? '-',
            $project->created_at->format('d/m/Y'),
        ]);
    }
}

class CustomersSheet implements FromCollection, WithHeadings
{
    public function __construct(
        private $user,
        private bool $isManager,
        private string $startDate,
        private string $endDate
    ) {}

    public function headings(): array
    {
        return ['#', 'Nama Customer', 'Kontak', 'Alamat', 'Jumlah Layanan', 'Total Revenue (Rp)', 'Sales', 'Tanggal'];
    }

    public function collection()
    {
        $query = Customer::with(['services', 'user'])
            ->whereBetween('created_at', [$this->startDate . ' 00:00:00', $this->endDate . ' 23:59:59']);

        if (!$this->isManager) {
            $query->where('user_id', $this->user->id);
        }

        return $query->get()->map(fn($customer, $i) => [
            $i + 1,
            $customer->name,
            $customer->contact,
            $customer->address,
            $customer->services->count(),
            $customer->services->sum('deal_price'),
            $customer->user->name ?? '-',
            $customer->created_at->format('d/m/Y'),
        ]);
    }
}
