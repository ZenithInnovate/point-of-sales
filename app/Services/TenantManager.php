<?php

namespace App\Services;

use App\Models\Tenant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Storage;
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
        Config::set('filesystems.disks.local.root', storage_path('app/public/tenants/' . $tenant->id));
        Config::set('filesystems.disks.public.root', storage_path('app/public/tenants/' . $tenant->id));
        Config::set('filesystems.disks.public.url', env('APP_URL') . '/storage/tenants/' . $tenant->id);

        // Clear Spatie Permission cached keys for this tenant
        try {
            if (app()->bound(PermissionRegistrar::class)) {
                app(PermissionRegistrar::class)->forgetCachedPermissions();
            }
        } catch (\Exception $e) {
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
