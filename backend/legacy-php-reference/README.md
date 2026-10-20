# Archived PHP/MySQL storefront backend

These files were moved out of `frontend/` to separate the Vue storefront from its legacy backend. They are kept for reference only; they are **not** part of the new Laravel application and should not be deployed as the new API.

- `schema.sql`: legacy MySQL schema for contact submissions and checkout orders.
- `submit.php`: legacy form receiver.
- `api.htaccess`: old API-directory access rules.

The Vue forms are now intentionally disconnected from this PHP endpoint. Build the new Laravel API under `backend/`, review the archived schema before designing migrations, and do not delete or overwrite any existing production database. Keep these files until the Laravel replacement has been tested and any required historical data has been safely migrated.
