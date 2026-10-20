# Store4U — Vue 3 storefront

The storefront is a frontend-only Vue 3 application built with Single-File Components, Vite and Vue Router. Product/catalog content is currently provided by local JavaScript/JSON files. The Laravel API and admin dashboard are separate projects at the repository root.

## Requirements

- Node.js 22.12 or newer (or Node 20.19 or newer)
- npm 10 or newer

## Local development

```powershell
npm install
npm run dev
```

Vite prints the local development URL. You can also visit routes such as `/shop/`, `/cart/`, `/checkout/`, `/about/`, `/policies/shipping/`, and `/products/<slug>/`.

## Quality checks and production build

```powershell
npm run check
npm run build
npm run preview
```

The static project check verifies route/product records, Vue SFC structure, setup-script syntax, local imports, the mount point and unsafe HTML-injection patterns. The production build generates `dist/`.

## Source layout

```text
src/
  components/
    catalog/       Product cards, grids, rails and merchandising sections
    layout/        Header, footer and mobile navigation
    overlays/      Cart drawer, search, quick view, lightbox, consent and toast
    shared/        Breadcrumbs, page heroes and policy renderers
  composables/     Reactive cart, wishlist, cookie and order-page state
  config/          Store/site configuration
  data/            Product catalog and page/legal content
  directives/      Lifecycle-managed reveal directive
  pages/           Route-level Vue components
  router/          Vue Router route table and metadata
  styles/          Shared tokens, reset and base styles
  utils/           Catalog helpers, formatting and form UI service
scripts/            Static project validator
public/             Favicon, robots, sitemap and SPA rewrite configuration
```

Page-specific styles live in their Vue components. `src/styles/global.css` contains shared design tokens, reset, typography and global utilities. Product images use the current catalog image URLs.

## Forms and backend boundary

The Contact and Checkout pages currently retain their user interface, validation and cart flow, but form submission is **not connected to a backend** in this clean frontend stage. The old PHP/MySQL implementation was moved to `../backend/legacy-php-reference/` for reference only.

The Laravel API will be implemented separately under `../backend/`. When it is ready, connect the frontend to versioned API endpoints through a dedicated API client. Do not reintroduce PHP endpoints or database schemas into this folder.

## Deployment

Run `npm run build` and deploy the contents of `dist/` to a static host. The `public/.htaccess` and `public/_redirects` files provide history-mode fallbacks for Apache/cPanel and Netlify. For other static hosts, configure unknown application routes to serve `index.html` while leaving actual asset files, `robots.txt` and `sitemap.xml` untouched.
