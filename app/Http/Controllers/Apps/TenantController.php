<?php

namespace App\Http\Controllers\Apps;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class TenantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tenants = Tenant::where('id', '!=', 'admin')
            ->when(request()->search, function ($query): void {
                $query->where(function ($q): void {
                    $q->where('name', 'like', '%'.request()->search.'%')
                        ->orWhere('id', 'like', '%'.request()->search.'%')
                        ->orWhere('domain', 'like', '%'.request()->search.'%');
                });
            })->latest()->paginate(5);

        return Inertia::render('Dashboard/Tenants/Index', [
            'tenants' => $tenants,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Dashboard/Tenants/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if ($request->has('domain')) {
            $request->merge(['domain' => explode(':', $request->domain)[0]]);
        }

        $request->validate([
            'id' => 'required|alpha_dash|unique:landlord.tenants,id',
            'name' => 'required|string|max:255',
            'domain' => 'required|string|unique:landlord.tenants,domain',
            'db_host' => 'nullable|string',
            'db_port' => 'nullable|string',
            'db_database' => 'nullable|string|alpha_dash',
            'db_username' => 'nullable|string',
            'db_password' => 'nullable|string',
        ]);

        $id = Str::slug($request->id);

        // Parameter DB default diambil dari DB utama/landlord jika tidak diisi
        $dbHost = $request->db_host ?: config('database.connections.landlord.host');
        $dbPort = $request->db_port ?: config('database.connections.landlord.port');
        $dbDatabase = $request->db_database ?: 'pos_tenant_'.str_replace('-', '_', $id);
        $dbUsername = $request->db_username ?: config('database.connections.landlord.username');
        $dbPassword = $request->db_password ?? config('database.connections.landlord.password');

        try {
            // Panggil command Artisan tenant:create untuk setup komplit
            $exitCode = Artisan::call('tenant:create', [
                'id' => $id,
                'domain' => $request->domain,
                'name' => $request->name,
                '--db-host' => $dbHost,
                '--db-port' => $dbPort,
                '--db-database' => $dbDatabase,
                '--db-username' => $dbUsername,
                '--db-password' => $dbPassword,
            ]);

            if ($exitCode !== 0) {
                return back()->withErrors(['id' => 'Gagal membuat database tenant atau menjalankan migrasi.']);
            }
        } catch (\Exception $e) {
            return back()->withErrors(['id' => 'Terjadi kesalahan sistem saat membuat tenant: '.$e->getMessage()]);
        }

        return to_route('tenants.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tenant $tenant)
    {
        if ($tenant->id === 'admin') {
            abort(403, 'Tenant Pusat tidak dapat dimodifikasi.');
        }

        return Inertia::render('Dashboard/Tenants/Edit', [
            'tenant' => $tenant,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tenant $tenant)
    {
        if ($tenant->id === 'admin') {
            abort(403, 'Tenant Pusat tidak dapat dimodifikasi.');
        }

        if ($request->has('domain')) {
            $request->merge(['domain' => explode(':', $request->domain)[0]]);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|unique:landlord.tenants,domain,'.$tenant->id,
            'status' => 'required|in:active,suspended',
        ]);

        $tenant->update([
            'name' => $request->name,
            'domain' => $request->domain,
            'status' => $request->status,
        ]);

        return to_route('tenants.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tenant $tenant)
    {
        if ($tenant->id === 'admin') {
            abort(403, 'Tenant Pusat tidak dapat dihapus.');
        }

        // 1. Drop database fisik kustom agar bersih
        try {
            DB::connection('landlord')->statement(
                "DROP DATABASE IF EXISTS `{$tenant->db_database}`;"
            );
        } catch (\Exception) {
            // Abaikan jika database tidak bisa di-drop atau menggunakan SQLite
        }

        // 2. Hapus direktori penyimpanan media khusus tenant
        if ($tenant->storage_key) {
            Storage::disk('public')->deleteDirectory('tenants/'.$tenant->storage_key);
        }

        // 3. Hapus data registrasi landlord
        $tenant->delete();

        return to_route('tenants.index');
    }
}
