# Bagas CRM - PT. Smart

Aplikasi Customer Relationship Management (CRM) modern yang dibangun untuk PT. Smart (Internet Service Provider) untuk mengelola leads, produk, pipeline proyek, dan data pelanggan.

## 🚀 Live Demo
Aplikasi telah dideploy dan dapat diakses melalui link berikut:
[https://bagascrm-production.up.railway.app/](https://bagascrm-production.up.railway.app/)

## 🛠 Tech Stack
- **Framework**: [Laravel 13](https://laravel.com/) (PHP 8.3)
- **Frontend**: [React](https://reactjs.org/) dengan [Inertia.js](https://inertiajs.com/)
- **Styling**: Vanilla CSS dengan desain modern dan premium
- **Database**: MySQL
- **Containerization**: Docker & Docker Compose
- **Web Server**: Nginx dengan Supervisor
- **Charts**: Recharts untuk visualisasi data

## ✨ Fitur Utama
- **Dashboard**: Ringkasan persentase konversi leads dan grafik performa penjualan.
- **Lead Management**: Pelacakan calon pelanggan dari status "New" hingga "Converted".
- **Product Master**: Manajemen katalog produk dan harga dasar.
- **Project Pipeline**: Pengelolaan negosiasi deal, perhitungan margin otomatis, dan persetujuan manager.
- **Customer Management**: Tampilan detail pelanggan aktif dan layanan yang mereka gunakan.
- **Role-Based Access Control**: 
  - **Sales**: Mengelola leads dan proyek milik sendiri.
  - **Manager**: Memantau semua sales, menyetujui/menolak proyek, dan melihat laporan global.

## 🔑 Akun Login (Data Seeder)
Gunakan akun berikut untuk mencoba aplikasi:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Manager** | `manager@smart.com` | `password123` |
| **Sales (Bagas)** | `bagas@smart.com` | `password123` |
| **Sales (Imel)** | `imel@smart.com` | `password123` |

## 📦 Instalasi & Konfigurasi

### 1. Menggunakan Docker (Direkomendasikan)
Pastikan Anda sudah menginstal Docker dan Docker Compose.

```bash
# Clone repository
git clone https://github.com/BagasSatriaYn/bagas_crm.git
cd bagas_crm

# Copy file environment
cp .env.docker .env

# Build dan jalankan container
docker-compose up -d --build
```

Aplikasi akan berjalan di `http://localhost:8080`.

### 2. Instalasi Manual
Jika ingin menjalankan tanpa Docker:

```bash
# Instal dependensi PHP
composer install

# Instal dependensi JS
npm install

# Build asset frontend
npm run build

# Setup database
php artisan migrate --seed

# Jalankan server local
php artisan serve
```

## ☁️ Deployment
Proyek ini dikonfigurasi untuk dideploy ke **Railway** menggunakan `Dockerfile` yang telah disediakan.

**Variabel Environment Penting di Production:**
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_KEY=base64:...`
- `DB_CONNECTION=mysql`
- `DB_HOST=...` (Host DB Railway)
- `DB_PORT=3306`
- `DB_DATABASE=...`
- `DB_USERNAME=...`
- `DB_PASSWORD=...`

## 🐳 Detail Containerisasi
- **Dockerfile**: Menggunakan multi-stage build (Node.js untuk build asset, PHP-FPM untuk aplikasi).
- **Nginx Config**: Konfigurasi khusus untuk routing Laravel dan optimasi keamanan.
- **Supervisor**: Mengelola proses PHP-FPM dan Nginx di dalam satu container agar kompatibel dengan Railway.
- **Entrypoint**: Otomatisasi migrasi database, caching config, dan streaming log Laravel ke terminal.

---
*Dikembangkan oleh Bagas Satria YN*
