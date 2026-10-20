# Store4U Laravel API

This is the active Laravel backend for Store4U. The admin SPA lives in admin/; the public storefront remains in frontend/.

## Requirements

- PHP 8.3+
- Composer
- MySQL 8+ (or compatible MySQL/MariaDB)
- Node.js 20+ for the admin SPA

## 1. Configure the database

From the repository root, create a MySQL database (for example store4u) if you do not already have one. If your existing order tables are in another database, use that database name instead so those orders remain available.

    cd backend
    if (!(Test-Path .env)) { Copy-Item .env.example .env }
    composer install
    php artisan key:generate

Edit backend/.env and set DB_DATABASE, DB_USERNAME, and DB_PASSWORD for your local MySQL connection. Do not commit .env.

## 2. Run migrations and import the current catalog

    php artisan migrate
    php artisan db:seed

The migrations add product fields and the is_admin flag. The orders migration creates store_orders and store_order_items only when they do not already exist. Its rollback intentionally does not drop these legacy order tables because they may contain real customer orders.

The catalog seeder imports products from ../frontend/src/data/catalog.js using each product's item as its SKU. It only inserts missing SKUs; re-running it will not overwrite product edits already made in the admin.

## 3. Create an administrator account

Run:

    php artisan tinker

Then enter this in Tinker, replacing the example email and password with your own:

    App\Models\User::updateOrCreate(
        ['email' => 'admin@example.com'],
        [
            'name' => 'Store Admin',
            'password' => 'Replace-With-A-Strong-Password-123!',
            'is_admin' => true,
        ]
    );

The model hashes the password automatically. Only users with is_admin = true can access the admin API.

## 4. Start Laravel

    php artisan serve --host=127.0.0.1 --port=8000

## 5. Start the admin SPA

Open a second PowerShell terminal from the repository root:

    cd admin
    if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
    npm install
    npm run dev

Open the URL printed by Vite (normally http://127.0.0.1:5173) and sign in with the administrator account. Keep the host consistent: use 127.0.0.1 for both admin and API, or localhost for both. The default CORS and Sanctum settings support both local origins.

## Admin API

All routes are under /api/v1/admin.

- POST /login, GET /me, POST /logout
- GET /dashboard
- GET|POST /products, GET|PUT|PATCH|DELETE /products/{product}
- GET /orders, GET /orders/{order}, PATCH /orders/{order}/status

The API uses Sanctum's stateful session authentication and CSRF protection. Admin routes also check the is_admin flag.

## Current boundaries

- Product edits are stored in the Laravel products table. The storefront currently renders its local catalog from frontend/src/data/catalog.js; connecting the storefront to the public products API is a separate integration step.
- Order status updates modify the existing store_orders.status field. They do not capture payment, reserve stock, send shipping labels, or trigger fulfillment.
- Keep database backups before production migrations. Never use migrate:fresh against a database that contains real orders.
