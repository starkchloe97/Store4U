# Store4U Admin

Standalone Vue 3 admin SPA for Store4U. The storefront is in frontend/, this admin app is in admin/, and the Laravel API is in backend/.

## Run locally

    cd admin
    if (!(Test-Path .env.local)) { Copy-Item .env.example .env.local }
    npm install
    npm run dev

Open http://127.0.0.1:5174. The API base defaults to http://127.0.0.1:8000/api/v1; override it in .env.local using VITE_API_BASE_URL.

## Working features

- Session-based admin login/logout using Laravel Sanctum and CSRF cookies.
- Dashboard metrics and recent orders.
- Product search, category filtering, create, edit and delete.
- Order search, status filtering, order details and status updates.
- Admin endpoints reject accounts unless users.is_admin = true.

Follow ../backend/README.md for backend setup, database migrations, catalog import, and administrator creation.

## Notes

Product edits are stored in the backend database. The public storefront still reads its static frontend/src/data/catalog.js file until the storefront is separately connected to a public catalog endpoint. Order status updates do not process payments or trigger fulfillment.
