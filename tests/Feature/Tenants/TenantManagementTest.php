<?php

namespace Tests\Feature\Tenants;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;
use Spatie\Permission\Models\Permission;
use Tests\TestCase;

class TenantManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Run landlord migrations for the landlord sqlite database
        $this->artisan('migrate', [
            '--path' => 'database/migrations/landlord',
            '--database' => 'landlord',
        ]);

        // Seed basic permissions
        foreach ([
            'tenants-access',
            'tenants-create',
            'tenants-update',
            'tenants-delete',
        ] as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        // Bind master admin tenant to the container for tests
        $tenantMock = new Tenant([
            'id' => 'admin',
            'name' => 'Landlord Admin',
            'domain' => 'admin.localhost',
            'db_database' => 'toko',
        ]);
        app()->instance('tenant', $tenantMock);
    }

    public function test_non_master_tenant_cannot_access_tenant_index(): void
    {
        // Bind regular tenant to container
        $regularTenant = new Tenant([
            'id' => 'toko-a',
            'name' => 'Toko A',
            'domain' => 'tokoa.localhost',
        ]);
        app()->instance('tenant', $regularTenant);

        $user = $this->createUserWithPermissions(['tenants-access']);

        $this->actingAs($user)
            ->get(route('tenants.index'))
            ->assertStatus(403);
    }

    public function test_non_admin_cannot_access_tenant_index(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('tenants.index'))
            ->assertStatus(403);
    }

    public function test_admin_can_access_tenant_index(): void
    {
        $user = $this->createUserWithPermissions(['tenants-access']);

        $this->actingAs($user)
            ->get(route('tenants.index'))
            ->assertOk();
    }

    public function test_admin_can_store_tenant(): void
    {
        // Mock Artisan command call to avoid physical database creations/seedings in tests
        Artisan::shouldReceive('call')
            ->once()
            ->with('tenant:create', \Mockery::type('array'))
            ->andReturn(0);

        $user = $this->createUserWithPermissions(['tenants-create']);

        $response = $this->actingAs($user)->post(route('tenants.store'), [
            'id' => 'toko-baru',
            'name' => 'Toko Baru',
            'domain' => 'tokobaru.localhost',
            'db_host' => '127.0.0.1',
            'db_port' => '3306',
            'db_database' => 'pos_tenant_toko_baru',
            'db_username' => 'root',
            'db_password' => 'secret',
        ]);

        $response->assertRedirect(route('tenants.index'));
    }

    public function test_admin_can_update_tenant(): void
    {
        $user = $this->createUserWithPermissions(['tenants-update']);

        // Create initial tenant record in landlord database
        $tenant = Tenant::create([
            'id' => 'toko-a',
            'name' => 'Toko A Lama',
            'domain' => 'tokoa.localhost',
            'storage_key' => 'uuid-storage-key-1',
            'db_host' => '127.0.0.1',
            'db_port' => '3306',
            'db_database' => 'toko_a_db',
            'db_username' => 'root',
            'db_password' => '',
            'status' => 'active',
        ]);

        $response = $this->actingAs($user)->put(route('tenants.update', $tenant->id), [
            'name' => 'Toko A Baru',
            'domain' => 'tokoabaru.localhost',
            'status' => 'suspended',
        ]);

        $response->assertRedirect(route('tenants.index'));
        $tenant->refresh();
        $this->assertSame('Toko A Baru', $tenant->name);
        $this->assertSame('tokoabaru.localhost', $tenant->domain);
        $this->assertSame('suspended', $tenant->status);
    }

    public function test_admin_can_delete_tenant(): void
    {
        $user = $this->createUserWithPermissions(['tenants-delete']);

        $tenant = Tenant::create([
            'id' => 'toko-b',
            'name' => 'Toko B',
            'domain' => 'tokob.localhost',
            'storage_key' => 'uuid-storage-key-2',
            'db_host' => '127.0.0.1',
            'db_port' => '3306',
            'db_database' => 'toko_b_db',
            'db_username' => 'root',
            'db_password' => '',
            'status' => 'active',
        ]);

        $response = $this->actingAs($user)->delete(route('tenants.destroy', $tenant->id));

        $response->assertRedirect(route('tenants.index'));
        $this->assertDatabaseMissing('tenants', [
            'id' => 'toko-b',
        ], 'landlord');
    }

    public function test_admin_cannot_update_master_tenant(): void
    {
        $user = $this->createUserWithPermissions(['tenants-update']);

        $masterTenant = Tenant::firstOrCreate([
            'id' => 'admin',
        ], [
            'name' => 'Landlord Admin',
            'domain' => 'admin.localhost',
            'storage_key' => 'uuid-storage-key-master',
            'db_host' => '127.0.0.1',
            'db_port' => '3306',
            'db_database' => 'toko',
            'db_username' => 'root',
            'db_password' => '',
            'status' => 'active',
        ]);

        $response = $this->actingAs($user)->put(route('tenants.update', $masterTenant->id), [
            'name' => 'Landlord Admin Baru',
            'domain' => 'admin-baru.localhost',
            'status' => 'suspended',
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_cannot_delete_master_tenant(): void
    {
        $user = $this->createUserWithPermissions(['tenants-delete']);

        $masterTenant = Tenant::firstOrCreate([
            'id' => 'admin',
        ], [
            'name' => 'Landlord Admin',
            'domain' => 'admin.localhost',
            'storage_key' => 'uuid-storage-key-master',
            'db_host' => '127.0.0.1',
            'db_port' => '3306',
            'db_database' => 'toko',
            'db_username' => 'root',
            'db_password' => '',
            'status' => 'active',
        ]);

        $response = $this->actingAs($user)->delete(route('tenants.destroy', $masterTenant->id));

        $response->assertStatus(403);
        $this->assertDatabaseHas('tenants', [
            'id' => 'admin',
        ], 'landlord');
    }

    public function test_master_tenant_is_excluded_from_index(): void
    {
        $user = $this->createUserWithPermissions(['tenants-access']);

        Tenant::firstOrCreate([
            'id' => 'admin',
        ], [
            'name' => 'Landlord Admin',
            'domain' => 'admin.localhost',
            'storage_key' => 'uuid-storage-key-master',
            'db_host' => '127.0.0.1',
            'db_port' => '3306',
            'db_database' => 'toko',
            'db_username' => 'root',
            'db_password' => '',
            'status' => 'active',
        ]);

        Tenant::create([
            'id' => 'toko-c',
            'name' => 'Toko C',
            'domain' => 'tokoc.localhost',
            'storage_key' => 'uuid-storage-key-3',
            'db_host' => '127.0.0.1',
            'db_port' => '3306',
            'db_database' => 'toko_c_db',
            'db_username' => 'root',
            'db_password' => '',
            'status' => 'active',
        ]);

        $response = $this->actingAs($user)->get(route('tenants.index'));

        $response->assertOk();

        $tenantsData = $response->original->getData()['page']['props']['tenants']['data'];
        $tenantIds = collect($tenantsData)->pluck('id')->toArray();

        $this->assertContains('toko-c', $tenantIds);
        $this->assertNotContains('admin', $tenantIds);
    }

    private function createUserWithPermissions(array $permissions): User
    {
        $user = User::factory()->create();
        $user->givePermissionTo($permissions);

        return $user;
    }
}
