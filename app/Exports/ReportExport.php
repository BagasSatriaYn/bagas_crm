<?php

namespace App\Exports;

use App\Models\Lead;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class ReportExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    protected $user;
    protected $isManager;
    protected $startDate;
    protected $endDate;
    protected $rowNumber = 0; // Untuk penomoran otomatis kolom #

    // Menerima data dari ReportController
    public function __construct($user, $isManager, $startDate, $endDate)
    {
        $this->user = $user;
        $this->isManager = $isManager;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    // Mengambil data dari Database
    public function collection()
    {
        $leadsQuery = Lead::with('user')
            ->whereBetween('created_at', [$this->startDate . ' 00:00:00', $this->endDate . ' 23:59:59']);

        if (!$this->isManager) {
            $leadsQuery->where('user_id', $this->user->id);
        }

        return $leadsQuery->get();
    }

    // Mengatur Baris Pertama (Header Excel)
    public function headings(): array
    {
        return [
            '#',
            'Nama Lead',
            'Kontak',
            'Alamat',
            'Kebutuhan',
            'Status',
            'Sales',
            'Tanggal',
        ];
    }

    // Memetakan isi data per baris
    public function map($lead): array
    {
        $this->rowNumber++;

        return [
            $this->rowNumber,
            $lead->name,
            $lead->contact,
            $lead->address ?? '-',     // Sesuaikan dengan nama kolom DB Anda jika berbeda
            $lead->requirement ?? '-', // Sesuaikan dengan nama kolom DB Anda jika berbeda
            $lead->status,
            $lead->user->name ?? '-',
            $lead->created_at->format('d/m/Y'),
        ];
    }

    // Mengatur Desain (Warna, Border, Lebar)
    public function styles(Worksheet $sheet)
    {
        $highestRow = $sheet->getHighestRow();
        $highestColumn = $sheet->getHighestColumn();

        // 1. Styling untuk Baris Header (Baris 1)
        $sheet->getStyle('A1:' . $highestColumn . '1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['argb' => 'FFFFFFFF'], // Teks Putih
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'color' => ['argb' => 'FF3B82F6'], // Background Biru (Blue-500)
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        // 2. Memberikan Garis Tabel (Border) ke semua sel yang terisi data
        $sheet->getStyle('A1:' . $highestColumn . $highestRow)->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'], // Garis Hitam Tipis
                ],
            ],
        ]);

        // 3. Melebarkan tinggi baris header agar teks tidak terlalu mepet
        $sheet->getRowDimension(1)->setRowHeight(25);

        // 4. (Opsional) Mengatur isi sel agar posisinya di atas (Top) jika ada teks panjang
        $sheet->getStyle('A2:' . $highestColumn . $highestRow)->applyFromArray([
            'alignment' => [
                'vertical' => Alignment::VERTICAL_TOP,
            ],
        ]);

        return [];
    }
}