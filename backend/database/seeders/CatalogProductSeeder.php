<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use RuntimeException;

class CatalogProductSeeder extends Seeder
{
    public function run(): void
    {
        $catalogPath = base_path('../frontend/src/data/catalog.js');

        if (! is_file($catalogPath)) {
            throw new RuntimeException("Storefront catalog not found at {$catalogPath}");
        }

        $source = file_get_contents($catalogPath);
        if (! preg_match('/export\s+const\s+CATALOG\s*=\s*(\[.*\])\s*;?/s', $source, $matches)) {
            throw new RuntimeException('Could not parse CATALOG array in frontend/src/data/catalog.js.');
        }

        $catalog = json_decode($matches[1], true, 512, JSON_THROW_ON_ERROR);

        foreach ($catalog as $row) {
            if (empty($row['item']) || empty($row['name'])) {
                continue;
            }

            Product::firstOrCreate(
                ['sku' => (string) $row['item']],
                [
                    'asin' => $row['asin'] ?? null,
                    'brand' => $row['brand'] ?? null,
                    'name' => $row['name'],
                    'short_description' => $row['short'] ?? null,
                    'category' => $row['cat'] ?? null,
                    'subcategory' => $row['sub'] ?? null,
                    'price' => $row['price'] ?? 0,
                    'stock' => $row['stock'] ?? 0,
                    'image_ids' => $row['amz'] ?? [],
                    'bullets' => $row['bullets'] ?? [],
                    'specs' => $row['specs'] ?? [],
                    'is_active' => true,
                ],
            );
        }
    }
}
