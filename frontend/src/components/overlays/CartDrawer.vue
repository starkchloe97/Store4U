<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import CartLineItem from '@/components/catalog/CartLineItem.vue';
import { money } from '@/utils/catalog.js';
import { useStorefront } from '@/composables/useStorefront.js';
const { state, cartItems, cartCount, cartSubtotal, cartShipping, cartTotal, setQuantity, removeFromCart } = useStorefront();
const remaining = computed(() => Math.max(0, 50 - cartSubtotal.value));
const shippingPercent = computed(() => Math.min(100, (cartSubtotal.value / 50) * 100));
</script>
<template>
  <div class="scrim" :class="{ on: state.cartOpen }" :aria-hidden="!state.cartOpen" @click="state.cartOpen = false">
  </div>
  <aside class="drawer" :class="{ on: state.cartOpen }" role="dialog" aria-modal="true" aria-label="Shopping cart"
    :aria-hidden="!state.cartOpen">
    <div class="drawer__hd">
      <h3>Your Cart ({{ cartCount }})</h3><button class="icon-btn" aria-label="Close cart"
        @click="state.cartOpen = false"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg></button>
    </div>
    <div v-if="cartCount" class="drawer__ship">
      <div class="drawer__ship-label"><strong v-if="remaining === 0">Your order ships free!</strong><span v-else>Add {{
        money(remaining) }} for free standard shipping.</span></div>
      <div class="drawer__ship-track">
        <div class="drawer__ship-fill" :class="{ done: remaining === 0 }" :style="{ width: `${shippingPercent}%` }">
        </div>
      </div>
    </div>
    <div class="drawer__body">
      <div v-if="!cartItems.length" class="empty">
        <h4>Your cart is empty</h4>
        <p>Browse storage and kitchen products. Orders ship within one business day.</p>
        <RouterLink to="/shop/" class="btn btn--pri" @click="state.cartOpen = false">Shop all products</RouterLink>
      </div>
      <CartLineItem v-for="item in cartItems" :key="item.product.id" :product="item.product" :quantity="item.quantity"
        @change="setQuantity(item.product.id, $event)" @remove="removeFromCart(item.product.id)" />
    </div>
    <div v-if="cartItems.length" class="drawer__ft">
      <div class="sum-row"><span>Subtotal</span><span>{{ money(cartSubtotal) }}</span></div>
      <div class="sum-row"><span>Standard shipping</span><span>{{ cartShipping === 0 ? 'Free' : money(cartShipping)
          }}</span></div>
      <div class="sum-row sum-row--tot"><span>Estimated total</span><span>{{ money(cartTotal) }}</span></div>
      <RouterLink to="/checkout/" class="btn btn--clay btn--full" @click="state.cartOpen = false">Checkout</RouterLink>
      <RouterLink to="/cart/" class="btn btn--ghost btn--full continue" @click="state.cartOpen = false">View cart
      </RouterLink>
    </div>
  </aside>
</template>
<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  background: rgba(26, 26, 24, .48);
  z-index: 80;
  opacity: 0;
  pointer-events: none;
  transition: opacity .3s;
  backdrop-filter: blur(3px)
}

.scrim.on {
  opacity: 1;
  pointer-events: auto
}

.drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: min(440px, 100%);
  background: var(--paper);
  z-index: 90;
  transform: translateX(100%);
  transition: transform .45s var(--ease-spring);
  display: flex;
  flex-direction: column;
  box-shadow: -14px 0 48px rgba(26, 26, 24, .16);
  visibility: hidden
}

.drawer.on {
  transform: translateX(0);
  visibility: visible
}

.drawer__hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.35rem 1.5rem;
  border-bottom: 1px solid var(--line);
  flex-shrink: 0
}

.drawer__hd h3 {
  font-family: var(--sans);
  font-size: 1rem;
  font-weight: 600
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  position: relative;
  color: var(--ink)
}

.icon-btn:hover {
  background: var(--sand)
}

.drawer__ship {
  padding: 1rem 1.5rem;
  background: var(--sand);
  border-bottom: 1px solid var(--line);
  flex-shrink: 0
}

.drawer__ship-label {
  font-size: .78rem;
  color: var(--stone);
  margin-bottom: .5rem
}

.drawer__ship-label strong {
  color: var(--ink);
  font-weight: 600
}

.drawer__ship-track {
  height: 6px;
  background: var(--line-dk);
  border-radius: var(--r-sm);
  overflow: hidden
}

.drawer__ship-fill {
  height: 100%;
  background: var(--clay);
  border-radius: var(--r-sm);
  transition: width .5s var(--ease-out)
}

.drawer__ship-fill.done {
  background: var(--ok)
}

.drawer__body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem 1.5rem
}

.drawer__ft {
  border-top: 1px solid var(--line);
  padding: 1.35rem 1.5rem;
  flex-shrink: 0;
  background: var(--white)
}

.sum-row {
  display: flex;
  justify-content: space-between;
  font-size: .875rem;
  margin-bottom: .6rem;
  color: var(--stone)
}

.sum-row--tot {
  font-size: 1.15rem;
  font-weight: 400;
  color: var(--ink);
  font-family: var(--sans);
  letter-spacing: -.015em;
  padding-top: .85rem;
  border-top: 1px solid var(--line);
  margin-top: .85rem;
  margin-bottom: 1.25rem
}

.continue {
  margin-top: .5rem
}

.empty {
  text-align: center;
  padding: 3.5rem 1rem;
  color: var(--stone)
}

.empty h4 {
  font-family: var(--sans);
  font-size: 1.35rem;
  color: var(--ink);
  margin-bottom: .5rem;
  font-weight: 400
}

.empty p {
  font-size: .9rem;
  margin-bottom: 1.5rem
}
</style>
