<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\Tenant;
use App\Services\TenantManager;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TenantIdentification
{
    /**
     * The tenant manager service.
     */
    protected TenantManager $tenantManager;

    /**
     * Create a new middleware instance.
     */
    public function __construct(TenantManager $tenantManager)
    {
        $this->tenantManager = $tenantManager;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Bypass untuk health check system atau environment testing
        if ($request->is('up') || app()->environment('testing')) {
            return $next($request);
        }

        $host = $request->getHost();

        // 1. Cari berdasarkan domain persis
        $tenant = Tenant::where('domain', $host)->first();

        // 2. Jika tidak ditemukan, coba cari berdasarkan subdomain (misal tenant1.localhost atau tenant1.akarpos.com)
        if (!$tenant) {
            $parts = explode('.', $host);
            if (count($parts) > 1) {
                $subdomain = $parts[0];
                if ($subdomain !== 'www' && $subdomain !== 'localhost') {
                    $tenant = Tenant::where('id', $subdomain)->first();
                }
            }
        }

        // Jika tenant tidak ditemukan
        if (!$tenant) {
            abort(404, "Situs SaaS POS tidak terdaftar atau domain Anda belum diarahkan dengan benar.");
        }

        // Jika tenant tidak aktif / ditangguhkan
        if ($tenant->status !== 'active') {
            abort(403, "Akses ditangguhkan. Silakan hubungi administrator pusat.");
        }

        // Jalankan bootstrap koneksi database & storage untuk tenant aktif ini
        $this->tenantManager->bootstrap($tenant);

        return $next($request);
    }
}
