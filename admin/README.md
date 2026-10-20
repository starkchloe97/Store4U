# Store4U Admin

Standalone Vue 3 admin SPA for the existing Store4U storefront. The storefront remains in `frontend/`, the admin UI is in `admin/`, and the Laravel API will live in `backend/`.

## Run locally

```powershell
cd admin
npm install
npm run dev
```

Vite runs on `http://localhost:5174`. API base defaults to `http://localhost:8000/api/v1`; override with `VITE_API_BASE_URL` in `.env.local`.

This foundation includes Vue Router, Axios configured for Sanctum cookie sessions, and starter Dashboard/Products/Orders/Login pages. The pages deliberately show unconnected states instead of fake data.