# Store4U admin foundation

- `frontend/`: existing Vue storefront and current PHP/MySQL checkout endpoint. Keep it operational during migration.
- `admin/`: separate Vue admin SPA, served by Vite on port 5174.
- `backend/`: reserved for the Laravel API. Install Laravel locally using `backend/README.md` before treating it as a runnable Laravel app.

## Current scope

This foundation adds admin navigation, starter dashboard/products/orders/login screens, shared styling and an Axios client configured for Sanctum cookie-based sessions. It does not yet authenticate users or load real data. Screens show explicit unconnected states rather than fabricated metrics.

## Recommended sequence

1. Install Laravel and Sanctum; configure cookie-based SPA authentication and explicit admin authorization.
2. Back up and review the current MySQL schema before adding migrations.
3. Import the existing product catalog into database-backed products while preserving SKUs and image URLs.
4. Add product read/write endpoints with server-side validation.
5. Add order list/detail/status endpoints while preserving existing orders.
6. Replace the PHP checkout endpoint only after staging parity, backup and rollback tests.
