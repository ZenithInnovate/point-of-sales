<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use App\Services\TenantManager;
use Illuminate\Console\Command;

class TenantsMigrateCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'tenants:migrate {--tenant= : ID tenant tertentu yang ingin dimigrasikan}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Menjalankan migrasi untuk database masing-masing tenant.';

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
        $tenantId = $this->option('tenant');

        if ($tenantId) {
            $tenant = Tenant::find($tenantId);

            if (!$tenant) {
                $this->error("Tenant dengan ID '{$tenantId}' tidak ditemukan.");
                return Command::FAILURE;
            }

            $this->migrateTenant($tenant);
        } else {
            $tenants = Tenant::where('status', 'active')->get();

            if ($tenants->isEmpty()) {
                $this->info("Tidak ada tenant aktif untuk dimigrasikan.");
                return Command::SUCCESS;
            }

            foreach ($tenants as $tenant) {
                $this->migrateTenant($tenant);
            }
        }

        $this->info('Semua migrasi tenant selesai dijalankan!');
        return Command::SUCCESS;
    }

    /**
     * Migrate the database for a specific tenant.
     */
    protected function migrateTenant(Tenant $tenant): void
    {
        $this->line("--------------------------------------------------");
        $this->info("Memigrasikan Tenant: [{$tenant->id}] - {$tenant->name}");
        $this->line("Database: {$tenant->db_database} pada Host: {$tenant->db_host}");
        $this->line("--------------------------------------------------");

        try {
            // Bootstrap koneksi tenant aktif
            $this->tenantManager->bootstrap($tenant);

            // Jalankan migrasi bawaan ke folder khusus tenant
            $this->call('migrate', [
                '--path' => 'database/migrations/tenant',
                '--database' => 'mysql',
                '--force' => true,
            ]);

            $this->info("Berhasil memigrasikan tenant [{$tenant->id}].");
        } catch (\Exception $e) {
            $this->error("Gagal memigrasikan tenant [{$tenant->id}]: " . $e->getMessage());
        }
    }
}
