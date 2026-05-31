<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use App\Models\Tenant;
use Illuminate\Support\Str;

echo "=== MEMULAI SETUP MASTER TENANT (http://admin.localhost:8000) ===\n";

try {
    // 1. Jalankan migrasi tenant ke database landlord (toko)
    echo "1. Menjalankan migrasi tabel operasional ke database landlord (toko)...\n";
    Artisan::call('migrate', [
        '--path' => 'database/migrations/tenant',
        '--database' => 'landlord',
        '--force' => true,
    ]);
    echo Artisan::output();

    // 2. Bersihkan tabel permissions lama agar tidak bentrok
    echo "2. Membersihkan tabel permission lama di database landlord...\n";
    DB::connection('landlord')->statement('SET FOREIGN_KEY_CHECKS=0;');
    DB::connection('landlord')->table('role_has_permissions')->truncate();
    DB::connection('landlord')->table('model_has_permissions')->truncate();
    DB::connection('landlord')->table('model_has_roles')->truncate();
    DB::connection('landlord')->table('permissions')->truncate();
    DB::connection('landlord')->table('roles')->truncate();
    DB::connection('landlord')->statement('SET FOREIGN_KEY_CHECKS=1;');

    // 3. Jalankan seeder roles, permissions, dan users ke database landlord
    echo "3. Menjalankan seeder awal (Admin, Kasir, Roles, Settings) ke database landlord...\n";
    Artisan::call('db:seed', [
        '--database' => 'landlord',
        '--class' => 'Database\\Seeders\\DatabaseSeeder',
        '--force' => true,
    ]);
    echo Artisan::output();

    // 4. Daftarkan/Pastikan tenant 'admin' terdaftar di tabel tenants landlord
    echo "4. Mendaftarkan tenant 'admin' di database landlord...\n";
    $tenant = Tenant::updateOrCreate(
        ['id' => 'admin'],
        [
            'name' => 'Pusat Kontrol Admin (Landlord)',
            'domain' => 'admin.localhost',
            'storage_key' => 'master-admin-storage-uuid-key',
            'db_host' => config('database.connections.landlord.host', '127.0.0.1'),
            'db_port' => config('database.connections.landlord.port', '3306'),
            'db_database' => config('database.connections.landlord.database', 'toko'),
            'db_username' => config('database.connections.landlord.username', 'root'),
            'db_password' => config('database.connections.landlord.password', ''),
            'status' => 'active',
        ]
    );

    echo " Tenant 'admin' berhasil dikonfigurasi!\n";
    echo "ID: {$tenant->id}\n";
    echo "Domain: {$tenant->domain}\n";
    echo "Database: {$tenant->db_database}\n";
    echo "=== SETUP SELESAI ===\n";
    echo "Anda dapat mengakses panel pengontrol tenant di: http://admin.localhost:8000/\n";
} catch (\Exception $e) {
    echo "❌ Terjadi kegagalan saat setup: " . $e->getMessage() . "\n";
}
