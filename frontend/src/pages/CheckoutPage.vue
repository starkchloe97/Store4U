<script setup>
import { computed, reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import PageHero from '@/components/shared/PageHero.vue';
import { useStorefront } from '@/composables/useStorefront.js';
import { money } from '@/utils/catalog.js';
import { SITE_PHONE } from '@/config/siteInfo.js';
import { submitSiteForm, collectTracking } from '@/utils/formSubmission.js';

const router = useRouter();
const { cartItems, cartCount, cartSubtotal, clearCart, saveLastOrder, shippingFor } = useStorefront();
const states = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','PR','GU','VI','AS','MP'];
const methods = [
  { id: 'standard', label: 'Standard', eta: '3–6 business days' },
  { id: 'expedited', label: 'Expedited', eta: '2–3 business days' },
  { id: 'priority', label: 'Priority', eta: '1–2 business days' }
];
const form = reactive({ email: '', phone: '', firstName: '', lastName: '', address1: '', address2: '', city: '', state: '', zip: '', shipping: 'standard', notes: '', agree: false });
const errors = ref({});
const errorMessage = ref('');
const busy = ref(false);
const shippingCost = computed(() => shippingFor(cartSubtotal.value, form.shipping));
const total = computed(() => cartSubtotal.value + shippingCost.value);
const moneyShipping = cost => cost === 0 ? 'Free' : money(cost);

function validate() {
  const next = {};
  for (const key of ['email','phone','firstName','lastName','address1','city','state','zip']) {
    if (!String(form[key] || '').trim()) next[key] = true;
  }
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = true;
  if (form.zip && !/^\d{5}(-\d{4})?$/.test(form.zip.trim())) next.zip = true;
  if (form.phone && form.phone.replace(/\D/g, '').length < 10) next.phone = true;
  errors.value = next;
  if (Object.keys(next).length) { errorMessage.value = 'Please check the highlighted fields.'; return false; }
  if (!form.agree) { errorMessage.value = 'Please agree to the Terms, Returns and Privacy policies to place your order.'; return false; }
  errorMessage.value = '';
  return true;
}

async function placeOrder() {
  if (busy.value || !validate()) return;
  if (!cartItems.value.length) { router.push('/cart/'); return; }
  busy.value = true;
  errorMessage.value = '';
  const now = new Date();
  const order = {
    number: '',
    placed: now.toISOString(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    name: form.firstName.trim() + ' ' + form.lastName.trim(),
    address: [form.address1.trim(), form.address2.trim(), form.city.trim() + ', ' + form.state + ' ' + form.zip.trim()].filter(Boolean),
    shipping: { method: form.shipping, cost: shippingCost.value },
    items: cartItems.value.map(({ product, quantity }) => ({
      sku: product.item || product.id, name: product.name, qty: quantity, price: product.price
    })),
    subtotal: Number(cartSubtotal.value.toFixed(2)),
    total: Number(total.value.toFixed(2)),
    notes: form.notes.trim(),
    payment: 'invoice'
  };

  try {
    const result = await submitSiteForm({
      form_type: 'order',
      customer: {
        email: form.email.trim(), phone: form.phone.trim(),
        first_name: form.firstName.trim(), last_name: form.lastName.trim()
      },
      shipping_address: {
        address1: form.address1.trim(), address2: form.address2.trim(),
        city: form.city.trim(), state: form.state, zip: form.zip.trim()
      },
      shipping: { method: form.shipping },
      items: order.items,
      notes: form.notes.trim(),
      accepted_terms: form.agree,
      tracking: collectTracking()
    });
    order.number = result.order_number;
    order.subtotal = Number(result.subtotal);
    order.shipping.cost = Number(result.shipping_cost);
    order.total = Number(result.total);
    saveLastOrder(order);
    clearCart();
    router.push('/thank-you/');
  } catch (error) {
    errorMessage.value = error?.message || `We could not submit your order request. Please try again or call ${SITE_PHONE}.`;
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <main><PageHero title="Checkout" :breadcrumbs="[{ label: 'Cart', to: '/cart/' }, { label: 'Checkout' }]" slim />
    <section v-if="!cartCount" class="sec"><div class="wrap center empty-state"><h1>Your cart is empty</h1><p class="lede">Add something to your cart before checking out.</p><RouterLink to="/shop/" class="btn btn--pri">Shop all products</RouterLink></div></section>
    <section v-else class="sec"><div class="wrap"><form class="co" novalidate @submit.prevent="placeOrder"><div class="co__main">
      <div v-if="errorMessage" class="alert alert--err" role="alert">{{ errorMessage }}</div>
      <fieldset class="co__step"><legend>1. Contact</legend><div class="form-2"><div class="form-row"><label for="coEmail">Email *</label><input id="coEmail" v-model="form.email" type="email" autocomplete="email" :class="{ 'is-bad': errors.email }" required @input="errors.email = false"></div><div class="form-row"><label for="coPhone">Phone *</label><input id="coPhone" v-model="form.phone" type="tel" autocomplete="tel" :class="{ 'is-bad': errors.phone }" required @input="errors.phone = false"></div></div><p class="form-note">We use these details to follow up with you about your order request.</p></fieldset>
      <fieldset class="co__step"><legend>2. Shipping address</legend><div class="form-2"><div class="form-row"><label for="coFirst">First name *</label><input id="coFirst" v-model="form.firstName" autocomplete="given-name" :class="{ 'is-bad': errors.firstName }" required @input="errors.firstName = false"></div><div class="form-row"><label for="coLast">Last name *</label><input id="coLast" v-model="form.lastName" autocomplete="family-name" :class="{ 'is-bad': errors.lastName }" required @input="errors.lastName = false"></div></div><div class="form-row"><label for="coAddr1">Street address *</label><input id="coAddr1" v-model="form.address1" autocomplete="address-line1" :class="{ 'is-bad': errors.address1 }" required @input="errors.address1 = false"></div><div class="form-row"><label for="coAddr2">Apartment, suite, etc. (optional)</label><input id="coAddr2" v-model="form.address2" autocomplete="address-line2"></div><div class="form-3"><div class="form-row"><label for="coCity">City *</label><input id="coCity" v-model="form.city" autocomplete="address-level2" :class="{ 'is-bad': errors.city }" required @input="errors.city = false"></div><div class="form-row"><label for="coState">State *</label><select id="coState" v-model="form.state" autocomplete="address-level1" :class="{ 'is-bad': errors.state }" required @change="errors.state = false"><option value="">Select</option><option v-for="state in states" :key="state" :value="state">{{ state }}</option></select></div><div class="form-row"><label for="coZip">ZIP code *</label><input id="coZip" v-model="form.zip" inputmode="numeric" maxlength="10" autocomplete="postal-code" :class="{ 'is-bad': errors.zip }" required @input="errors.zip = false"></div></div><p class="form-note">We ship within the United States only.</p></fieldset>
      <fieldset class="co__step"><legend>3. Delivery method</legend><div class="co__opts"><label v-for="method in methods" :key="method.id" class="co__opt" :class="{ 'is-on': form.shipping === method.id }"><input v-model="form.shipping" type="radio" name="coShip" :value="method.id"><span><strong>{{ method.label }}</strong><small>{{ method.eta }} after processing</small></span><b>{{ moneyShipping(shippingFor(cartSubtotal, method.id)) }}</b></label></div></fieldset>
      <fieldset class="co__step"><legend>4. Payment</legend><label class="co__opt is-on"><input type="radio" name="coPay" value="invoice" checked><span><strong>Order submission — no payment collected</strong><small>Submitting saves your order request for review. This website does not automatically send invoices or collect payment. Our team will review the request and contact you separately.</small></span></label><div class="form-row notes-row"><label for="coNotes">Order notes (optional)</label><textarea id="coNotes" v-model="form.notes" rows="3" placeholder="Delivery instructions, gift message, etc."></textarea></div><label class="co__agree"><input v-model="form.agree" type="checkbox" required><span>I agree to the <RouterLink to="/policies/terms/">Terms of Service</RouterLink>, <RouterLink to="/policies/returns/">Returns Policy</RouterLink> and <RouterLink to="/policies/privacy/">Privacy Policy</RouterLink>.</span></label></fieldset>
    </div><aside class="co__side"><h2 class="co__h">Order summary</h2><div class="co__items"><div v-for="item in cartItems" :key="item.product.id" class="co__item"><div class="co__thumb"><img class="is-cutout" :src="`https://m.media-amazon.com/images/I/${item.product.amz[0]}._AC_SL200_.jpg`" :alt="item.product.name"><span>{{ item.quantity }}</span></div><div class="co__iname">{{ item.product.short }}<small>{{ item.product.item ? `Item # ${item.product.item}` : item.product.brand }}</small></div><div>{{ money(item.product.price * item.quantity) }}</div></div></div><div class="sum-row"><span>Subtotal</span><span>{{ money(cartSubtotal) }}</span></div><div class="sum-row"><span>Shipping</span><span>{{ moneyShipping(shippingCost) }}</span></div><div class="sum-row"><span>Sales tax</span><span>Added to invoice</span></div><div class="sum-row sum-row--tot"><span>Total</span><span>{{ money(total) }}</span></div><button type="submit" class="btn btn--clay btn--full" :disabled="busy">{{ busy ? 'Placing order…' : 'Place order' }}</button><p class="form-note secure-note">30-day returns · 1–2 year warranty</p><p class="form-note endpoint-note">Order requests are saved for review. No payment is collected on this page.</p></aside></form></div></section>
  </main>
</template>
<style scoped>
.empty-state{padding-top:3rem;padding-bottom:3rem}.empty-state .lede{margin:1rem auto 2rem}.co{display:grid;grid-template-columns:1fr 380px;gap:clamp(1.5rem,4vw,3rem);align-items:start}.co__side{position:sticky;top:90px;background:var(--white);border:1px solid var(--line);border-radius:var(--r);padding:1.5rem}.co__h{font-size:1.05rem;margin-bottom:1rem}.co__step{border:1px solid var(--line);border-radius:var(--r);background:var(--white);padding:1.25rem 1.4rem .4rem;margin:0 0 1.25rem;min-width:0}.co__step legend{font-weight:700;font-size:1.05rem;padding:0 .4rem;margin-left:-.4rem}.form-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.form-3{display:grid;grid-template-columns:1.4fr 1fr 1fr;gap:1rem}.form-row{display:grid;gap:.35rem;margin-bottom:1.1rem}.form-row label{font-size:.8rem;font-weight:600;color:var(--ink)}.form-row input,.form-row select,.form-row textarea{width:100%;padding:.78rem .95rem;border:1.5px solid var(--line-dk);border-radius:var(--r-sm);background:var(--white);font-size:.92rem;transition:border-color .18s;font-family:var(--sans);min-width:0}.form-row input:focus,.form-row select:focus,.form-row textarea:focus{outline:none;border-color:var(--ink)}.form-row textarea{resize:vertical;min-height:130px}.form-row .is-bad{border-color:var(--clay);background:#FDF5F1}.form-note{font-size:.78rem;color:var(--stone);line-height:1.55}.co__opts{display:grid;gap:.6rem;margin-bottom:1rem}.co__opt{display:flex;gap:.8rem;align-items:flex-start;border:1.5px solid var(--line-dk);border-radius:var(--r-sm);padding:.85rem 1rem;cursor:pointer}.co__opt.is-on,.co__opt:has(input:checked){border-color:var(--ink)}.co__opt input{margin-top:.25rem;accent-color:var(--ink)}.co__opt span{flex:1}.co__opt strong{display:block;font-size:.92rem}.co__opt small{display:block;font-size:.8rem;color:var(--stone);line-height:1.5;margin-top:.15rem}.co__opt b{font-size:.92rem}.notes-row{margin-top:1.1rem}.notes-row textarea{min-height:80px}.co__agree{display:flex;gap:.6rem;align-items:flex-start;font-size:.85rem;color:var(--ink-2);margin:.25rem 0 1.1rem}.co__agree input{margin-top:.25rem;accent-color:var(--ink)}.co__agree a{color:var(--clay);text-decoration:underline}.co__items{border-bottom:1px solid var(--line);margin-bottom:1rem;padding-bottom:.5rem}.co__item{display:grid;grid-template-columns:56px 1fr auto;gap:.8rem;align-items:center;font-size:.85rem;margin-bottom:.75rem}.co__thumb{position:relative;width:56px;height:56px;border-radius:var(--r-sm);overflow:hidden;background:var(--sand);border:1px solid var(--line)}.co__thumb img{width:100%;height:100%;object-fit:cover}.co__thumb span{position:absolute;top:2px;right:2px;background:var(--ink);color:#fff;font-size:.65rem;font-weight:700;min-width:18px;height:18px;border-radius:9px;display:grid;place-items:center;padding:0 4px}.co__iname{font-weight:600;line-height:1.35}.co__iname small{display:block;font-weight:400;color:var(--stone-lt);font-size:.72rem}.sum-row{display:flex;justify-content:space-between;font-size:.875rem;margin-bottom:.6rem;color:var(--stone)}.sum-row--tot{font-size:1.15rem;color:var(--ink);padding-top:.85rem;border-top:1px solid var(--line);margin-top:.85rem;margin-bottom:1.25rem}.alert{padding:.9rem 1.15rem;border-radius:var(--r-sm);font-size:.88rem;margin-bottom:1.25rem;background:#FBEDE7;border:1px solid #EFC7B6;color:#8E3A1C}.secure-note{text-align:center;margin-top:.75rem}.endpoint-note{margin-top:.5rem;text-align:center;font-size:.7rem}
@media(max-width:900px){.co{grid-template-columns:1fr}.co__side{position:static}}@media(max-width:600px){.form-3{grid-template-columns:1fr 1fr}.form-3>:first-child{grid-column:1/-1}}@media(max-width:520px){.form-2{grid-template-columns:1fr}}
</style>
