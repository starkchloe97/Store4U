<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('products')) {
            return;
        }

        Schema::table('products', function (Blueprint $table) {
            if (! Schema::hasColumn('products', 'sku')) $table->string('sku', 80)->nullable()->unique();
            if (! Schema::hasColumn('products', 'asin')) $table->string('asin', 32)->nullable();
            if (! Schema::hasColumn('products', 'brand')) $table->string('brand', 120)->nullable();
            if (! Schema::hasColumn('products', 'name')) $table->string('name')->nullable();
            if (! Schema::hasColumn('products', 'short_description')) $table->text('short_description')->nullable();
            if (! Schema::hasColumn('products', 'category')) $table->string('category', 120)->nullable()->index();
            if (! Schema::hasColumn('products', 'subcategory')) $table->string('subcategory', 120)->nullable();
            if (! Schema::hasColumn('products', 'price')) $table->decimal('price', 12, 2)->default(0);
            if (! Schema::hasColumn('products', 'stock')) $table->unsignedInteger('stock')->default(0);
            if (! Schema::hasColumn('products', 'image_ids')) $table->json('image_ids')->nullable();
            if (! Schema::hasColumn('products', 'bullets')) $table->json('bullets')->nullable();
            if (! Schema::hasColumn('products', 'specs')) $table->json('specs')->nullable();
            if (! Schema::hasColumn('products', 'is_active')) $table->boolean('is_active')->default(true)->index();
        });
    }

    public function down(): void
    {
        // Intentionally preserve catalog data on rollback. Remove fields manually only
        // after exporting products and confirming the target database is disposable.
    }
};
