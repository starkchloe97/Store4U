<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'sku', 'asin', 'brand', 'name', 'short_description',
        'category', 'subcategory', 'price', 'stock', 'image_ids',
        'bullets', 'specs', 'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock' => 'integer',
            'image_ids' => 'array',
            'bullets' => 'array',
            'specs' => 'array',
            'is_active' => 'boolean',
        ];
    }
}
