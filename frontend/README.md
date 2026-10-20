# RV DREAMS LLC — Vue 3 + Vite storefront

This project implements the RV DREAMS LLC website with Vue 3 Single-File Components, Vite, and Vue Router. It keeps the supplied page copy, product records, route URLs, page metadata, design tokens, responsive layouts, and the original external product-image URLs. Pages and interactions are rendered with Vue templates and Composition API state; there is no legacy page renderer, HTML-string injection, or `v-html` usage.

## Requirements

- Node.js 22.12 or newer (or Node 20.19 or newer)
- npm 10 or newer

## Local development

From this directory run:

```bash
npm install
npm run dev
```

Vite prints the local development URL. Use the direct routes too, for example `/shop/`, `/cart/`, `/checkout/`, `/about/`, `/policies/shipping/`, and any `/products/<slug>/` path.

## Quality checks and production build

```bash
npm run check
npm run build
npm run preview
```

`npm run check` is dependency-light and verifies the route/product records, policy blocks, Vue SFC block order and tag nesting, setup-script JavaScript syntax, local relative imports, the mount point, and absence of HTML-injection patterns. `npm run build` runs the Vite/Vue compiler and produces `dist/` for deployment.

## Source layout

```text
src/
  components/
    catalog/       Product cards, grids, rails, hero and merchandising sections
    layout/        Announcement bar, header, footer and mobile navigation
    overlays/      Cart drawer, search, quick view, lightbox, cookie consent and toast
    shared/        Breadcrumbs, page heroes, inline legal runs and policy renderer
  composables/     Shared reactive cart, wishlist, cookie, toast and order state
  data/            Route/SEO manifest, product catalog and legal page content
  directives/      Lifecycle-managed scroll-reveal directive
  pages/           Route-level Vue Single-File Components
  router/          Vue Router route table and page metadata
  styles/          Shared design tokens, reset and base styles only
  utils/           Catalog lookup, product-image URLs and money formatting
scripts/           Structural/static project validator
public/             Robots, sitemap and SPA rewrite configuration
```

Page-specific and component-specific styles live in each SFC's `<style scoped>` block. `src/styles/global.css` contains the shared tokens, reset, type defaults, utility classes, and shared reveal state only. Product images continue to use the source website's `m.media-amazon.com` URLs; the provided ZIP did not include local image files to bundle.

## Contact forms and MySQL order submissions

The Contact Us form and Checkout form both POST JSON to `/api/submit.php`. The PHP endpoint validates requests and stores them in MySQL with prepared statements. Checkout orders and their line items are written in one transaction. A success response is returned only after the database transaction commits.

### Database setup

1. Create a MySQL database named `rvdreams_storefront` (or choose a different name for your hosting account).
2. Import `backend/database/schema.sql` using phpMyAdmin or the MySQL CLI.
3. Copy `public/api/config.example.php` to `public/api/config.php`, then set your MySQL host, database, username, password, and exact allowed origins. The real config file is ignored by Git and direct HTTP access is denied by `public/api/.htaccess`.
4. Deploy the Vite build to a PHP-enabled Apache/cPanel host. The build includes `/api/submit.php` because it lives in `public/api/`.

For local development with Laragon/XAMPP serving files at `http://localhost/`, no environment override is required: Vite automatically posts to `http://localhost/api/submit.php`. If Apache runs on another port or path, set `VITE_FORM_ENDPOINT` in `.env.local` to that full PHP endpoint URL. Restart Vite after changing environment variables.

The PHP config must allow the frontend development origin (normally `http://localhost:5173`). In production, the default is the same-origin `/api/submit.php` path. If the endpoint is missing or returns HTML instead of JSON, the form now reports the endpoint/status problem instead of a generic save error.

### Tables and stored data

- `contact_submissions`: names, email, optional order number, topic, message, timestamps, and attribution/device metadata.
- `store_orders`: contact/shipping details, selected shipping method, totals, notes, terms acceptance, status, timestamps and attribution metadata.
- `store_order_items`: SKU, product name, quantity, submitted catalog price, and line total, linked to the order.

Orders enter the database with `pending_review` status and `not_paid` payment status. This implementation only records submissions; it does not charge cards, send emails, issue invoices, reserve stock, or confirm fulfillment. Item prices originate from the storefront catalog and are stored as a submitted snapshot, so staff must verify catalog pricing before issuing an invoice. Do not treat an unreviewed submission as a paid or accepted order.

The API also stores available UTM source, referrer, GCLID/MSCLKID and page URL values, user-agent-derived device/browser/OS, request IP address, and user agent. Disclose this collection in your privacy policy and follow applicable privacy requirements.

## Deployment

Build with `npm run build` and publish the contents of `dist/`. The `public/.htaccess` file is copied to the build root for Apache/cPanel history-mode fallback, and `public/_redirects` provides the equivalent catch-all for Netlify. For another static host, configure unknown application routes to serve `index.html` while leaving real asset files and `robots.txt` / `sitemap.xml` untouched.

Before going live, configure the order endpoint, verify it from the production domain, ensure direct product/collection URLs resolve through the host's SPA rewrite, and run both `npm run check` and `npm run build` in an environment that can install npm dependencies.
