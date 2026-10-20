# Store4U Laravel API

This folder marks the backend location; the Laravel framework itself must be installed locally before this is a runnable Laravel app.

## Install Laravel

Because this folder already contains this README, create Laravel in a temporary sibling folder, then copy its generated files into `backend/`:

```powershell
composer create-project laravel/laravel backend-install
robocopy backend-install backend /E /XD .git
cd backend
php artisan --version
php artisan install:api
```

Review the copy output and preserve this README. If API scaffolding/Sanctum is already present, inspect the generated files rather than repeating installation.

## Safe database setup

For initial development, configure a separate MySQL database such as `store4u_admin_dev`. Do not point migrations at the existing storefront database until it is backed up and reviewed. Never run `migrate:fresh` or `db:wipe` against a database containing orders.

Configure Sanctum's stateful domains and credentialed CORS for the exact storefront/admin origins. Use consistent hostnames (`localhost` vs `127.0.0.1`) and HTTPS/secure cookies in production.

## Planned API (`/api/v1`)

- `GET /admin/dashboard`
- `GET|POST /admin/products`
- `GET|PUT|DELETE /admin/products/{product}`
- `GET /admin/orders` and `GET /admin/orders/{order}`
- `PATCH /admin/orders/{order}/status`
- `GET /admin/customers`

Protect admin endpoints with authentication and an explicit admin authorization check. Use Form Requests for validation and API Resources for response formatting.

## Preserve existing data

The current catalog is in `frontend/src/data/catalog.js`; existing orders are stored in `store_orders` and `store_order_items`. Back up and inspect the current schema before writing migrations. Import the catalog to database-backed products, preserve SKUs/images, and have Laravel calculate prices, shipping and totals server-side. Never trust prices submitted by the browser. Keep `frontend/public/api/submit.php` operational until the replacement checkout has passed staging parity and rollback tests. The current checkout records orders; it does not charge cards, reserve stock, or confirm fulfillment.
