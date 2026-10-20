import { computed, reactive, watch } from 'vue';
import { PRODUCT_BY_ID, money } from '@/utils/catalog.js';

const CART_KEY = 'havenform_cart_v1';
const WISH_KEY = 'havenform_wish_v1';
const COOKIE_KEY = 'one10_cookie_preference';
const LAST_ORDER_KEY = 'havenform_last_order';

function readStorage(key, fallback) {
  try {
    if (typeof window === 'undefined') return fallback;
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

const state = reactive({
  cart: readStorage(CART_KEY, {}),
  wishlist: readStorage(WISH_KEY, {}),
  cartOpen: false,
  searchOpen: false,
  quickViewId: null,
  lightbox: null,
  toast: { message: '', type: '', visible: false },
  cookiePreference: readStorage(COOKIE_KEY, null),
  mobileMenuOpen: false
});
let toastTimer;

watch(() => state.cart, value => {
  try { window.localStorage.setItem(CART_KEY, JSON.stringify(value)); } catch { /* storage can be unavailable */ }
}, { deep: true });
watch(() => state.wishlist, value => {
  try { window.localStorage.setItem(WISH_KEY, JSON.stringify(value)); } catch { /* storage can be unavailable */ }
}, { deep: true });

const cartItems = computed(() => Object.entries(state.cart)
  .map(([id, quantity]) => ({ product: PRODUCT_BY_ID.get(id), quantity: Number(quantity) || 0 }))
  .filter(item => item.product && item.quantity > 0));
const cartCount = computed(() => cartItems.value.reduce((total, item) => total + item.quantity, 0));
const cartSubtotal = computed(() => cartItems.value.reduce((total, item) => total + item.product.price * item.quantity, 0));
const cartShipping = computed(() => cartSubtotal.value >= 50 || cartSubtotal.value === 0 ? 0 : 5.95);
const cartTotal = computed(() => cartSubtotal.value + cartShipping.value);
const quickViewProduct = computed(() => state.quickViewId ? PRODUCT_BY_ID.get(state.quickViewId) || null : null);

function notify(message, type = 'success') {
  state.toast.message = message;
  state.toast.type = type;
  state.toast.visible = true;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { state.toast.visible = false; }, type === 'success' ? 2400 : 2000);
}
function addToCart(id, quantity = 1, { openCart = false } = {}) {
  const product = PRODUCT_BY_ID.get(id);
  if (!product) return;
  const next = Math.max(1, Math.min(99, Number(quantity) || 1));
  state.cart[id] = Math.min(99, (Number(state.cart[id]) || 0) + next);
  notify(`${product.short} added to cart`);
  if (openCart) state.cartOpen = true;
}
function setQuantity(id, quantity) {
  const value = Math.floor(Number(quantity) || 0);
  if (value <= 0) delete state.cart[id];
  else if (PRODUCT_BY_ID.has(id)) state.cart[id] = Math.min(99, value);
}
function removeFromCart(id) { delete state.cart[id]; }
function toggleWishlist(id) {
  if (state.wishlist[id]) delete state.wishlist[id];
  else state.wishlist[id] = true;
  const product = PRODUCT_BY_ID.get(id);
  notify(state.wishlist[id] ? `${product?.short || 'Product'} saved to wishlist` : 'Removed from wishlist');
}
function openQuickView(id) { state.quickViewId = id; }
function closeQuickView() { state.quickViewId = null; }
function openLightbox(product, index = 0) { state.lightbox = { productId: product.id, index }; }
function closeLightbox() { state.lightbox = null; }
function saveCookiePreference(value) {
  state.cookiePreference = value;
  try { window.localStorage.setItem(COOKIE_KEY, JSON.stringify(value)); } catch { /* storage can be unavailable */ }
}
function clearCart() { state.cart = {}; }
function saveLastOrder(order) {
  try { window.localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order)); } catch { /* storage can be unavailable */ }
}
function readLastOrder() { return readStorage(LAST_ORDER_KEY, null); }
function shippingFor(subtotal, method = 'standard') {
  if (method === 'standard') return subtotal >= 50 ? 0 : 5.95;
  if (method === 'expedited') return 12.95;
  if (method === 'priority') return 24.95;
  return 0;
}

export function useStorefront() {
  return {
    state, cartItems, cartCount, cartSubtotal, cartShipping, cartTotal,
    quickViewProduct, money, notify, addToCart, setQuantity, removeFromCart,
    toggleWishlist, openQuickView, closeQuickView, openLightbox, closeLightbox,
    saveCookiePreference, clearCart, saveLastOrder, readLastOrder, shippingFor
  };
}
