<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use App\Services\TenantManager;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class TenantCreateCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tenant:create 
                            {id : Slug ID unik untuk tenant (misal: toko-a)} 
                            {domain : Domain utama tenant (misal: tokoa.com atau tokoa.localhost)} 
                            {name : Nama Toko/Tenant} 
                            {--db-host= : Host database tenant} 
                            {--db-port= : Port database tenant} 
                            {--db-database= : Nama database tenant} 
                            {--db-username= : Username database tenant} 
                            {--db-password= : Password database tenant}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Membuat tenant baru (mendaftarkan domain, membuat database, migrasi, dan seed data).';

    /**
     * Create a new command instance.
     */
    public function __construct(/**
     * The tenant manager instance.
     */
        protected TenantManager $tenantManager)
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $id = Str::slug($this->argument('id'));
        $domain = $this->argument('domain');
        $name = $this->argument('name');

        // Parameter DB default diambil dari DB utama/landlord
        $dbHost = $this->option('db-host') ?: config('database.connections.landlord.host');
        $dbPort = $this->option('db-port') ?: config('database.connections.landlord.port');
        $dbDatabase = $this->option('db-database') ?: 'pos_tenant_'.str_replace('-', '_', $id);
        $dbUsername = $this->option('db-username') ?: config('database.connections.landlord.username');
        $dbPassword = $this->option('db-password') ?? config('database.connections.landlord.password');

        $this->info('Menyiapkan pendaftaran tenant...');
        $this->line("ID: {$id}");
        $this->line("Nama: {$name}");
        $this->line("Domain: {$domain}");
        $this->line("Database: {$dbDatabase}");

        // 1. Cek apakah Tenant ID atau Domain sudah terdaftar
        if (Tenant::where('id', $id)->exists()) {
            $this->error("Tenant dengan ID '{$id}' sudah terdaftar.");

            return Command::FAILURE;
        }

        if (Tenant::where('domain', $domain)->exists()) {
            $this->error("Domain '{$domain}' sudah digunakan oleh tenant lain.");

            return Command::FAILURE;
        }

        // 2. Buat database fisik di MySQL server
        try {
            $this->info("Membuat database fisik '{$dbDatabase}'...");
            DB::connection('landlord')->statement(
                "CREATE DATABASE IF NOT EXISTS `{$dbDatabase}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
            );
            $this->info('Database fisik berhasil dibuat/diverifikasi.');
        } catch (\Exception $e) {
            $this->error('Gagal membuat database fisik: '.$e->getMessage());

            return Command::FAILURE;
        }

        // 3. Simpan data registrasi ke tabel tenants pusat (landlord)
        try {
            $tenant = Tenant::create([
                'id' => $id,
                'name' => $name,
                'domain' => $domain,
                'storage_key' => (string) Str::uuid(),
                'db_host' => $dbHost,
                'db_port' => $dbPort,
                'db_database' => $dbDatabase,
                'db_username' => $dbUsername,
                'db_password' => $dbPassword,
                'status' => 'active',
            ]);
            $this->info('Registrasi Tenant di database pusat berhasil disimpan.');
        } catch (\Exception $e) {
            $this->error('Gagal menyimpan pendaftaran tenant: '.$e->getMessage());

            return Command::FAILURE;
        }

        // 4. Jalankan Migrasi khusus tenant baru ini
        $this->info('Menjalankan migrasi database tenant...');
        $migrateResult = $this->call('tenants:migrate', [
            '--tenant' => $tenant->id,
        ]);

        if ($migrateResult !== 0) {
            $this->error('Migrasi gagal. Registrasi tenant tetap disimpan tetapi database tidak lengkap.');

            return Command::FAILURE;
        }

        // 5. Jalankan Seeder data awal untuk tenant baru ini
        try {
            $this->info('Menjalankan database seeder awal (Admin, Kasir, Roles, Settings)...');

            // Bootstrap koneksi tenant aktif
            $this->tenantManager->bootstrap($tenant);

            // Panggil DB seed khusus untuk koneksi tenant mysql
            $this->call('db:seed', [
                '--database' => 'mysql',
                '--class' => \Database\Seeders\DatabaseSeeder::class,
                '--force' => true,
            ]);

            $this->info('Database seeder selesai dijalankan!');
        } catch (\Exception $e) {
            $this->error('Gagal menjalankan database seeder: '.$e->getMessage());

            return Command::FAILURE;
        }

        $this->line('--------------------------------------------------');
        $this->info("Tenant '{$name}' [{$id}] BERHASIL DIBUAT!");
        $this->info("Akses sekarang di http://{$domain}");
        $this->line('--------------------------------------------------');

        return Command::SUCCESS;
    }
}
