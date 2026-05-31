<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Tenant;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

class TenantManager
{
    /**
     * The current active tenant.
     */
    protected ?Tenant $currentTenant = null;

    /**
     * Bootstrap the tenant application state.
     */
    public function bootstrap(Tenant $tenant): void
    {
        $this->currentTenant = $tenant;

        // Bind tenant to application container
        app()->instance('tenant', $tenant);

        // Dynamically override default database connection config (mysql)
        Config::set('database.connections.mysql.host', $tenant->db_host);
        Config::set('database.connections.mysql.port', $tenant->db_port);
        Config::set('database.connections.mysql.database', $tenant->db_database);
        Config::set('database.connections.mysql.username', $tenant->db_username);
        Config::set('database.connections.mysql.password', $tenant->db_password);

        // Disconnect and purge existing database connections to force reconnection
        DB::purge('mysql');
        DB::purge('landlord');
        DB::reconnect('mysql');

        // Set default database connection to the dynamic mysql connection
        DB::setDefaultConnection('mysql');

        // Dynamically override public and local filesystem disks
        Config::set('filesystems.disks.local.root', storage_path('app/public/tenants/'.$tenant->storage_key));
        Config::set('filesystems.disks.public.root', storage_path('app/public/tenants/'.$tenant->storage_key));
        Config::set('filesystems.disks.public.url', env('APP_URL').'/storage/tenants/'.$tenant->storage_key);

        // Dynamically override SMTP mail settings for this tenant (Option B)
        try {
            $mailHost = \App\Models\Setting::get('mail_host');
            if ($mailHost) {
                Config::set('mail.mailers.smtp.host', $mailHost);
                Config::set('mail.mailers.smtp.port', \App\Models\Setting::get('mail_port', 587));
                Config::set('mail.mailers.smtp.username', \App\Models\Setting::get('mail_username'));
                Config::set('mail.mailers.smtp.password', \App\Models\Setting::get('mail_password'));
                Config::set('mail.mailers.smtp.encryption', \App\Models\Setting::get('mail_encryption', 'tls'));

                $fromAddress = \App\Models\Setting::get('mail_from_address', \App\Models\Setting::get('mail_username'));
                $fromName = \App\Models\Setting::get('mail_from_name', $tenant->name);

                Config::set('mail.from.address', $fromAddress);
                Config::set('mail.from.name', $fromName);
            } else {
                // Fallback: SMTP global dengan nama pengirim disesuaikan ke tenant
                $fromAddress = \App\Models\Setting::get('store_email', env('MAIL_FROM_ADDRESS'));
                $fromName = \App\Models\Setting::get('store_name', $tenant->name);
                if ($fromAddress) {
                    Config::set('mail.from.address', $fromAddress);
                }
                if ($fromName) {
                    Config::set('mail.from.name', $fromName);
                }
            }
        } catch (\Exception) {
            // Heningkan saat seeding atau jika tabel database belum migrasi lengkap
        }

        // Clear Spatie Permission cached keys for this tenant
        try {
            if (app()->bound(PermissionRegistrar::class)) {
                app(PermissionRegistrar::class)->forgetCachedPermissions();
            }
        } catch (\Exception) {
            // Silence if cache registrar is not ready or failed
        }
    }

    /**
     * Get the current active tenant.
     */
    public function getCurrentTenant(): ?Tenant
    {
        return $this->currentTenant;
    }
}
