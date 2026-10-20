<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('store_orders')) {
            Schema::create('store_orders', function (Blueprint $table) {
                $table->id();
                $table->string('order_number', 32)->unique();
                $table->string('email', 254)->index();
                $table->string('phone', 40);
                $table->string('first_name', 100);
                $table->string('last_name', 100);
                $table->string('street_address');
                $table->string('address_line2')->nullable();
                $table->string('city', 100);
                $table->char('state', 2);
                $table->string('postal_code', 20);
                $table->string('shipping_method', 20);
                $table->decimal('shipping_cost', 12, 2)->default(0);
                $table->decimal('subtotal', 12, 2)->default(0);
                $table->decimal('total', 12, 2)->default(0);
                $table->text('notes')->nullable();
                $table->string('payment_method', 20)->default('invoice');
                $table->string('status', 32)->default('pending_review')->index();
                $table->string('payment_status', 24)->default('not_paid');
                $table->boolean('accepted_terms')->default(false);
                $table->string('source', 2048)->default('direct');
                $table->string('utm_source', 255)->nullable();
                $table->string('referrer', 2048)->nullable();
                $table->string('gclid', 255)->nullable();
                $table->string('msclkid', 255)->nullable();
                $table->string('url_source', 2048)->nullable();
                $table->string('device', 20)->default('Unknown');
                $table->string('browser', 40)->default('Unknown');
                $table->string('operating_system', 60)->default('Unknown');
                $table->string('ip_address', 45)->nullable();
                $table->string('user_agent', 512)->nullable();
                $table->timestamps();
            });
        }

        if (! Schema::hasTable('store_order_items')) {
            Schema::create('store_order_items', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('order_id')->index();
                $table->string('sku', 80);
                $table->string('product_name');
                $table->unsignedSmallInteger('quantity');
                $table->decimal('unit_price', 12, 2);
                $table->decimal('line_total', 12, 2);
                $table->timestamp('created_at')->useCurrent();
                $table->foreign('order_id')->references('id')->on('store_orders')->cascadeOnDelete();
            });
        }
    }

    public function down(): void
    {
        // These are legacy storefront tables and may contain real customer orders.
        // This migration deliberately never drops them automatically.
    }
};
