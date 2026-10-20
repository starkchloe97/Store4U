import { createRouter, createWebHistory } from 'vue-router';
import pages from '@/data/pages.json';
import HomePage from '@/pages/HomePage.vue';
import CatalogPage from '@/pages/CatalogPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import CartPage from '@/pages/CartPage.vue';
import CheckoutPage from '@/pages/CheckoutPage.vue';
import ThankYouPage from '@/pages/ThankYouPage.vue';
import AboutPage from '@/pages/AboutPage.vue';
import ContactPage from '@/pages/ContactPage.vue';
import ShippingPolicyPage from '@/pages/ShippingPolicyPage.vue';
import ReturnsPolicyPage from '@/pages/ReturnsPolicyPage.vue';
import WarrantyPolicyPage from '@/pages/WarrantyPolicyPage.vue';
import FaqPage from '@/pages/FaqPage.vue';
import TermsPage from '@/pages/TermsPage.vue';
import PrivacyPage from '@/pages/PrivacyPage.vue';
import AccessibilityPage from '@/pages/AccessibilityPage.vue';
import { SITE_NAME, SITE_URL, SITE_EMAIL, SITE_PHONE, SITE_PHONE_RAW, SITE_ADDRESS_ONE_LINE, SITE_ADDRESS_LINE1, SITE_ADDRESS_LINE2, SITE_ADDRESS_LOCALITY, SITE_ADDRESS_REGION, SITE_ADDRESS_POSTAL_CODE, SITE_ADDRESS_COUNTRY } from '@/config/siteInfo.js';
import NotFoundPage from '@/pages/NotFoundPage.vue';

function resolveSiteInfo(value) {
  if (typeof value === 'string') {
    return value
      .replace(/\(236\)\s*506-1948/g, SITE_PHONE)
      .replace(/\+1?-?236-506-1948/g, SITE_PHONE_RAW)
      .replace(/10228 E Northwest Hwy,?\s*Dallas, TX 75238(?:, United States)?/gi, SITE_ADDRESS_ONE_LINE)
      .replace(/10228 E Northwest Hwy/gi, SITE_ADDRESS_LINE1)
      .replace(/Dallas, TX 75238(?:, United States)?/gi, `${SITE_ADDRESS_LOCALITY}, ${SITE_ADDRESS_REGION} ${SITE_ADDRESS_POSTAL_CODE}`)
      .replace(/Dallas, Texas/gi, `${SITE_ADDRESS_LOCALITY}, ${SITE_ADDRESS_REGION}`)
      .replace(/Dallas facility/gi, 'our facility');
  }
  if (Array.isArray(value)) return value.map(resolveSiteInfo);
  if (value && typeof value === 'object') {
    const resolved = Object.fromEntries(Object.entries(value).map(([key, child]) => [key, resolveSiteInfo(child)]));
    if (resolved.address && typeof resolved.address === 'object') {
      resolved.address.streetAddress = SITE_ADDRESS_ONE_LINE;
      resolved.address.addressLocality = SITE_ADDRESS_LOCALITY;
      resolved.address.addressRegion = SITE_ADDRESS_REGION;
      resolved.address.postalCode = SITE_ADDRESS_POSTAL_CODE;
      resolved.address.addressCountry = SITE_ADDRESS_COUNTRY;
    }
    if ('telephone' in resolved) resolved.telephone = SITE_PHONE_RAW;
    if (resolved.email) resolved.email = SITE_EMAIL;
    return resolved;
  }
  return value;
}

const pageComponents = {
  home: HomePage,
  shop: CatalogPage,
  product: ProductPage,
  cart: CartPage,
  checkout: CheckoutPage,
  'thank-you': ThankYouPage,
  about: AboutPage,
  contact: ContactPage,
  shipping: ShippingPolicyPage,
  returns: ReturnsPolicyPage,
  warranty: WarrantyPolicyPage,
  faq: FaqPage,
  terms: TermsPage,
  privacy: PrivacyPage,
  accessibility: AccessibilityPage,
  '404': NotFoundPage
};

const routes = Object.entries(pages).map(([path, page], index) => ({
  path,
  name: `${page.page}-${index}`,
  component: pageComponents[page.page] || NotFoundPage,
  props: () => ({
    pageInfo: resolveSiteInfo(page),
    category: page.page === 'shop' ? (page.cat || 'All') : undefined,
    slug: page.page === 'product' ? page.product : undefined
  })
}));
routes.push({ path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage });

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0, behavior: 'auto' };
  }
});

function upsertMeta(selector, tagName, attrs) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement(tagName);
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
}

router.afterEach(to => {
  const page = resolveSiteInfo(pages[to.path]);
  const title = page?.title || `Page Not Found | ${SITE_NAME}`;
  const description = page?.description || "The page you're looking for doesn't exist.";
  document.title = title;
  upsertMeta('meta[name="description"]', 'meta', { name: 'description', content: description });
  upsertMeta('meta[property="og:title"]', 'meta', { property: 'og:title', content: title });
  upsertMeta('meta[property="og:description"]', 'meta', { property: 'og:description', content: description });
  const canonical = page?.canonical ? `${SITE_URL}${new URL(page.canonical).pathname}` : new URL(to.fullPath, SITE_URL).href;
  upsertMeta('meta[property="og:url"]', 'meta', { property: 'og:url', content: canonical });
  upsertMeta('link[rel="canonical"]', 'link', { rel: 'canonical', href: canonical });

  const previousStructuredData = document.head.querySelector('#site-structured-data');
  if (page?.structuredData) {
    upsertMeta('#site-structured-data', 'script', {
      id: 'site-structured-data', type: 'application/ld+json'
    }).textContent = JSON.stringify(page.structuredData);
  } else {
    previousStructuredData?.remove();
  }
  if (!page) {
    upsertMeta('meta[name="robots"]', 'meta', { name: 'robots', content: 'noindex,follow' });
  } else {
    document.head.querySelector('meta[name="robots"]')?.remove();
  }
});

export default router;
