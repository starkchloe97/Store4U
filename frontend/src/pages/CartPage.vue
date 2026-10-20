<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import PageHero from '@/components/shared/PageHero.vue';
import CartLineItem from '@/components/catalog/CartLineItem.vue';
import { money } from '@/utils/catalog.js';
import { useStorefront } from '@/composables/useStorefront.js';
const { cartItems, cartCount, cartSubtotal, cartShipping, cartTotal, setQuantity, removeFromCart } = useStorefront();
const remaining = computed(() => Math.max(0, 50 - cartSubtotal.value));
</script>
<template><main><PageHero title="Your cart" :breadcrumbs="[{ label: 'Cart' }]" slim /><section class="sec"><div class="wrap"><div v-if="!cartCount" class="empty"><h4>Your cart is empty</h4><p>Browse storage and kitchen products. Orders ship within one business day.</p><RouterLink to="/shop/" class="btn btn--pri">Shop all products</RouterLink></div><div v-else class="co"><div class="co__main"><CartLineItem v-for="item in cartItems" :key="item.product.id" :product="item.product" :quantity="item.quantity" @change="setQuantity(item.product.id, $event)" @remove="removeFromCart(item.product.id)" /></div><aside class="co__side"><h2 class="co__h">Order summary</h2><div class="sum-row"><span>Subtotal</span><span>{{ money(cartSubtotal) }}</span></div><div class="sum-row"><span>Standard shipping</span><span>{{ cartShipping === 0 ? 'Free' : money(cartShipping) }}</span></div><p v-if="remaining > 0" class="form-note free-shipping-note">Add {{ money(remaining) }} more for free standard shipping.</p><div class="sum-row sum-row--tot"><span>Estimated total</span><span>{{ money(cartTotal) }}</span></div><RouterLink to="/checkout/" class="btn btn--clay btn--full">Checkout</RouterLink><RouterLink to="/shop/" class="btn btn--ghost btn--full continue">Continue shopping</RouterLink></aside></div></div></section></main></template>
<style scoped>
.empty{text-align:center;padding:3.5rem 1rem;color:var(--stone)}.empty h4{font-family:var(--sans);font-size:1.35rem;color:var(--ink);margin-bottom:.5rem;font-weight:400}.empty p{font-size:.9rem;margin-bottom:1.5rem}.co{display:grid;grid-template-columns:1fr 380px;gap:clamp(1.5rem,4vw,3rem);align-items:start}.co__side{position:sticky;top:90px;background:var(--white);border:1px solid var(--line);border-radius:var(--r);padding:1.5rem}.co__h{font-size:1.05rem;margin-bottom:1rem}.sum-row{display:flex;justify-content:space-between;font-size:.875rem;margin-bottom:.6rem;color:var(--stone)}.sum-row--tot{font-size:1.15rem;font-weight:400;color:var(--ink);font-family:var(--sans);letter-spacing:-.015em;padding-top:.85rem;border-top:1px solid var(--line);margin-top:.85rem;margin-bottom:1.25rem}.form-note{font-size:.78rem;color:var(--stone);line-height:1.55}.free-shipping-note{margin:.25rem 0 .75rem}.continue{margin-top:.5rem}
@media(max-width:900px){.co{grid-template-columns:1fr}.co__side{position:static}}
</style>
