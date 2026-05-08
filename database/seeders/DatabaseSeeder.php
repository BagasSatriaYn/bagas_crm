<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\CustomerService;
use App\Models\Lead;
use App\Models\Product;
use App\Models\Project;
use App\Models\ProjectItem;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // =========================
        // AKUN USER
        // =========================

        $manager = User::create([
            'name'     => 'Marcel',
            'email'    => 'manager@smart.com',
            'password' => Hash::make('password123'),
            'role'     => 'manager',
        ]);

        $bagas = User::create([
            'name'     => 'Bagas',
            'email'    => 'bagas@smart.com',
            'password' => Hash::make('password123'),
            'role'     => 'sales',
        ]);

        $imel = User::create([
            'name'     => 'Imel',
            'email'    => 'imel@smart.com',
            'password' => Hash::make('password123'),
            'role'     => 'sales',
        ]);

        // =========================
        // MASTER DATA PRODUK
        // =========================

        $p1 = Product::create(['name' => 'Paket Internet Bisnis 50Mbps',      'base_price' => 200000,  'margin_percentage' => 20, 'selling_price' => 240000]);
        $p2 = Product::create(['name' => 'Paket Corporate Dedicated 100Mbps', 'base_price' => 500000,  'margin_percentage' => 30, 'selling_price' => 650000]);
        $p3 = Product::create(['name' => 'Paket Internet Rumahan 20Mbps',     'base_price' => 120000,  'margin_percentage' => 15, 'selling_price' => 138000]);
        $p4 = Product::create(['name' => 'Paket Internet Gamer 75Mbps',       'base_price' => 300000,  'margin_percentage' => 25, 'selling_price' => 375000]);
        $p5 = Product::create(['name' => 'Paket CCTV + Internet',             'base_price' => 450000,  'margin_percentage' => 20, 'selling_price' => 540000]);
        $p6 = Product::create(['name' => 'Paket WiFi Sekolah 150Mbps',        'base_price' => 800000,  'margin_percentage' => 35, 'selling_price' => 1080000]);
        $p7 = Product::create(['name' => 'Paket Hotspot Cafe 50Mbps',         'base_price' => 250000,  'margin_percentage' => 20, 'selling_price' => 300000]);
        $p8 = Product::create(['name' => 'Paket Fiber Premium 200Mbps',       'base_price' => 1000000, 'margin_percentage' => 40, 'selling_price' => 1400000]);

        // =========================
        // LEADS
        // =========================

        // --- Status: converted (akan jadi customer) ---
        $lead1 = Lead::create(['user_id' => $bagas->id,   'name' => 'CV. Maju Bersama',        'contact' => '081234567890', 'address' => 'Jl. Sudirman No.12, Palembang',    'needs' => 'Internet bisnis untuk kantor',              'status' => 'converted']);
        $lead2 = Lead::create(['user_id' => $imel->id,    'name' => 'Kafe Kopi Nusantara',      'contact' => '082233445566', 'address' => 'Jl. Demang Lebar Daun No.5',       'needs' => 'Hotspot untuk pelanggan cafe',              'status' => 'converted']);
        $lead3 = Lead::create(['user_id' => $bagas->id,   'name' => 'SD Negeri 10 Palembang',   'contact' => '081122334455', 'address' => 'Jl. Suka Bangun No.3, Palembang',  'needs' => 'WiFi sekolah untuk lab komputer',          'status' => 'converted']);
        $lead4 = Lead::create(['user_id' => $imel->id,    'name' => 'PT. Sejahtera Abadi',      'contact' => '087788990011', 'address' => 'Kawasan IPLT, Palembang',           'needs' => 'Dedicated internet kantor pusat',           'status' => 'converted']);

        // --- Status: negotiation ---
        $lead5 = Lead::create(['user_id' => $bagas->id,   'name' => 'Toko Elektronik Murah',   'contact' => '085566778899', 'address' => 'Pasar 16 Ilir, Palembang',          'needs' => 'Internet + CCTV untuk toko',                'status' => 'negotiation']);
        $lead6 = Lead::create(['user_id' => $imel->id,    'name' => 'Klinik dr. Hendra',       'contact' => '082244556677', 'address' => 'Jl. Talang Kerangga No.7',          'needs' => 'Internet stabil untuk sistem antrian',      'status' => 'negotiation']);
        $lead7 = Lead::create(['user_id' => $manager->id, 'name' => 'Restoran Sriwijaya',      'contact' => '089911223344', 'address' => 'Jl. Jend. Sudirman KM 3',           'needs' => 'WiFi untuk pelanggan restoran',             'status' => 'negotiation']);

        // --- Status: contacted ---
        $lead8  = Lead::create(['user_id' => $bagas->id,  'name' => 'Apotek Sehat Selalu',     'contact' => '081309876543', 'address' => 'Jl. Kapten A. Rivai No.20',         'needs' => 'Internet cepat untuk sistem kasir',        'status' => 'contacted']);
        $lead9  = Lead::create(['user_id' => $imel->id,   'name' => 'Bengkel Maju Motor',      'contact' => '087612345678', 'address' => 'Jl. Kol. Atmo No.15, Palembang',   'needs' => 'Internet untuk CCTV & kasir',               'status' => 'contacted']);
        $lead10 = Lead::create(['user_id' => $bagas->id,  'name' => 'Salon & Spa Cantik',      'contact' => '082398765432', 'address' => 'Jl. Basuki Rahmat No.8',            'needs' => 'Paket internet + WiFi pelanggan',           'status' => 'contacted']);

        // --- Status: new ---
        $lead11 = Lead::create(['user_id' => $imel->id,   'name' => 'Warung Makan Bu Sari',    'contact' => '085211223344', 'address' => 'Jl. Lettu Murod No.2, Palembang',  'needs' => 'Internet murah untuk usaha',                'status' => 'new']);
        $lead12 = Lead::create(['user_id' => $bagas->id,  'name' => 'Konveksi Baju Bagus',     'contact' => '081355667788', 'address' => 'Jl. MP. Mangkunegara No.14',        'needs' => 'Internet untuk sistem pemesanan online',    'status' => 'new']);
        $lead13 = Lead::create(['user_id' => $imel->id,   'name' => 'Studio Foto Moment',      'contact' => '087899001122', 'address' => 'Jl. Angkatan 45 No.6',              'needs' => 'Internet cepat untuk upload foto',          'status' => 'new']);

        // --- Status: lost ---
        $lead14 = Lead::create(['user_id' => $bagas->id,  'name' => 'Toko Sembako Pak Budi',   'contact' => '081277889900', 'address' => 'Pasar Plaju, Palembang',            'needs' => 'Internet untuk toko',                      'status' => 'lost']);
        $lead15 = Lead::create(['user_id' => $imel->id,   'name' => 'Rental Mobil Cepat',      'contact' => '082344556677', 'address' => 'Jl. Demang Lebar Daun No.22',      'needs' => 'Internet kantor rental',                   'status' => 'lost']);

        // =========================
        // PROJECTS (dari lead converted & negotiation)
        // =========================

        // Project APPROVED (dari lead converted)
        $proj1 = Project::create(['user_id' => $bagas->id, 'lead_id' => $lead1->id, 'status' => 'approved']);
        ProjectItem::create(['project_id' => $proj1->id, 'product_id' => $p1->id, 'negotiated_price' => 230000, 'is_below_margin' => false]);
        ProjectItem::create(['project_id' => $proj1->id, 'product_id' => $p5->id, 'negotiated_price' => 520000, 'is_below_margin' => false]);

        $proj2 = Project::create(['user_id' => $imel->id, 'lead_id' => $lead2->id, 'status' => 'approved']);
        ProjectItem::create(['project_id' => $proj2->id, 'product_id' => $p7->id, 'negotiated_price' => 290000, 'is_below_margin' => false]);

        $proj3 = Project::create(['user_id' => $bagas->id, 'lead_id' => $lead3->id, 'status' => 'approved']);
        ProjectItem::create(['project_id' => $proj3->id, 'product_id' => $p6->id, 'negotiated_price' => 1050000, 'is_below_margin' => false]);

        $proj4 = Project::create(['user_id' => $imel->id, 'lead_id' => $lead4->id, 'status' => 'approved']);
        ProjectItem::create(['project_id' => $proj4->id, 'product_id' => $p2->id, 'negotiated_price' => 630000, 'is_below_margin' => false]);
        ProjectItem::create(['project_id' => $proj4->id, 'product_id' => $p8->id, 'negotiated_price' => 1350000, 'is_below_margin' => false]);

        // Project WAITING APPROVAL (dari lead negotiation)
        $proj5 = Project::create(['user_id' => $bagas->id, 'lead_id' => $lead5->id, 'status' => 'waiting approval']);
        ProjectItem::create(['project_id' => $proj5->id, 'product_id' => $p5->id, 'negotiated_price' => 490000, 'is_below_margin' => false]);

        $proj6 = Project::create(['user_id' => $imel->id, 'lead_id' => $lead6->id, 'status' => 'waiting approval']);
        ProjectItem::create(['project_id' => $proj6->id, 'product_id' => $p1->id, 'negotiated_price' => 185000, 'is_below_margin' => true]); // negosiasi di bawah margin

        $proj7 = Project::create(['user_id' => $manager->id, 'lead_id' => $lead7->id, 'status' => 'waiting approval']);
        ProjectItem::create(['project_id' => $proj7->id, 'product_id' => $p4->id, 'negotiated_price' => 360000, 'is_below_margin' => false]);

        // Project REJECTED
        $proj8 = Project::create(['user_id' => $bagas->id, 'lead_id' => $lead14->id, 'status' => 'rejected', 'reject_reason' => 'Harga terlalu rendah, tidak sesuai margin minimum.']);
        ProjectItem::create(['project_id' => $proj8->id, 'product_id' => $p3->id, 'negotiated_price' => 100000, 'is_below_margin' => true]);

        // =========================
        // CUSTOMERS (dari lead converted)
        // =========================

        $cust1 = Customer::create(['user_id' => $bagas->id, 'lead_id' => $lead1->id, 'name' => 'CV. Maju Bersama',      'contact' => '081234567890', 'address' => 'Jl. Sudirman No.12, Palembang']);
        CustomerService::create(['customer_id' => $cust1->id, 'product_id' => $p1->id, 'deal_price' => 230000]);
        CustomerService::create(['customer_id' => $cust1->id, 'product_id' => $p5->id, 'deal_price' => 520000]);

        $cust2 = Customer::create(['user_id' => $imel->id, 'lead_id' => $lead2->id, 'name' => 'Kafe Kopi Nusantara',    'contact' => '082233445566', 'address' => 'Jl. Demang Lebar Daun No.5']);
        CustomerService::create(['customer_id' => $cust2->id, 'product_id' => $p7->id, 'deal_price' => 290000]);

        $cust3 = Customer::create(['user_id' => $bagas->id, 'lead_id' => $lead3->id, 'name' => 'SD Negeri 10 Palembang','contact' => '081122334455', 'address' => 'Jl. Suka Bangun No.3, Palembang']);
        CustomerService::create(['customer_id' => $cust3->id, 'product_id' => $p6->id, 'deal_price' => 1050000]);

        $cust4 = Customer::create(['user_id' => $imel->id, 'lead_id' => $lead4->id, 'name' => 'PT. Sejahtera Abadi',    'contact' => '087788990011', 'address' => 'Kawasan IPLT, Palembang']);
        CustomerService::create(['customer_id' => $cust4->id, 'product_id' => $p2->id, 'deal_price' => 630000]);
        CustomerService::create(['customer_id' => $cust4->id, 'product_id' => $p8->id, 'deal_price' => 1350000]);
    }
}