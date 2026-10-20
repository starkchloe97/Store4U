<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_dashboard_and_products(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        Product::create([
            'sku' => 'TEST-001',
            'name' => 'Test product',
            'category' => 'Kitchen',
            'price' => 12.50,
            'stock' => 7,
            'is_active' => true,
        ]);

        $this->actingAs($admin)
            ->getJson('/api/v1/admin/dashboard')
            ->assertOk()
            ->assertJsonPath('metrics.products', 1)
            ->assertJsonPath('metrics.orders', 0);

        $this->actingAs($admin)
            ->getJson('/api/v1/admin/products')
            ->assertOk()
            ->assertJsonPath('data.data.0.sku', 'TEST-001');
    }

    public function test_non_admin_user_cannot_access_admin_api(): void
    {
        $user = User::factory()->create(['is_admin' => false]);

        $this->actingAs($user)
            ->getJson('/api/v1/admin/dashboard')
            ->assertForbidden();
    }

    public function test_admin_can_create_product(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $this->actingAs($admin)
            ->postJson('/api/v1/admin/products', [
                'sku' => 'TEST-002',
                'name' => 'Another product',
                'price' => 8.99,
                'stock' => 12,
                'is_active' => true,
            ])
            ->assertCreated()
            ->assertJsonPath('data.sku', 'TEST-002');

        $this->assertDatabaseHas('products', ['sku' => 'TEST-002']);
    }
}
