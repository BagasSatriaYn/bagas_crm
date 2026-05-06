<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Buat Akun Manager
        User::create([
            'name' => 'Pak Farid (Manager)',
            'email' => 'manager@smart.com',
            'password' => Hash::make('password123'),
            'role' => 'manager',
        ]);

        // 2. Buat Akun Sales 1
        User::create([
            'name' => 'Bagas (Sales)',
            'email' => 'bagas@smart.com',
            'password' => Hash::make('password123'),
            'role' => 'sales',
        ]);

        // 3. Buat Akun Sales 2
        User::create([
            'name' => 'Gilang (Sales)',
            'email' => 'gilang@smart.com',
            'password' => Hash::make('password123'),
            'role' => 'sales',
        ]);

        // 4. Buat Master Data Produk
        Product::create([
            'name' => 'Paket Internet Bisnis 50Mbps',
            'base_price' => 200000,
            'margin_percentage' => 20,
            'selling_price' => 240000, // 200rb + (20% x 200rb)
        ]);

        Product::create([
            'name' => 'Paket Corporate Dedicated 100Mbps',
            'base_price' => 500000,
            'margin_percentage' => 30,
            'selling_price' => 650000, // 500rb + (30% x 500rb)
        ]);
    }
}