<script setup>
import { RouterLink } from 'vue-router';
import PageHero from '@/components/shared/PageHero.vue';
import { SITE_EMAIL, SITE_PHONE, SITE_PHONE_RAW } from '@/config/siteInfo.js';
const faqs = [
  ['How long does shipping take?', 'Orders placed before 1:00 PM Central Time ship the same business day. Standard shipping takes 3–6 business days after processing. Expedited (2–3 days) and Priority (1–2 days) options are available at checkout.'],
  ['Do you offer free shipping?', 'Yes. Standard shipping is free on all US orders over $50. Orders under $50 ship for a flat $5.95.'],
  ['What is your return policy?', 'You may return any unused item within 30 days of delivery in its original packaging for a full refund of the purchase price. There is no restocking fee. Return shipping is free for defective or incorrect items.'],
  ['Where do you ship from?', 'Orders ship from our fulfillment facility. We currently ship within the United States only.'],
  ['Do you ship internationally?', 'Not at this time. We ship to all 50 US states, Washington D.C., and US territories.'],
  ['Are your products dishwasher safe?', 'It depends on the product. Each product page lists a "Dishwasher" specification. Silicone and glass components are generally dishwasher safe; bamboo and items with stainless springs should be hand washed.'],
  ['Are your products authentic?', 'Yes. Every product is a genuine branded item. Each listing names the brand and shows full specifications and photos.'],
  ['How do I contact a human?', `Email ${SITE_EMAIL} or call ${SITE_PHONE}. We will respond within one business day.`]
];
</script>
<template><main><PageHero title="Frequently Asked Questions" description="Answers to the questions we get most often. If yours isn't here, email or call us — we reply within one business day." :breadcrumbs="[{ label: 'FAQ' }]"/><section class="sec"><div class="wrap"><div class="faq"><details v-for="faq in faqs" :key="faq[0]"><summary>{{ faq[0] }}</summary><div class="faq__body"><div class="faq__body-inner"><p>{{ faq[1] }}</p></div></div></details></div><div class="callout"><strong>Still need help?</strong>Email <a :href="`mailto:${SITE_EMAIL}`">{{ SITE_EMAIL }}</a> or call <a :href="`tel:${SITE_PHONE_RAW}`">{{ SITE_PHONE }}</a>. We will respond within one business day.</div></div></section></main></template><style scoped>
.faq{max-width:900px}.faq details{border-bottom:1px solid var(--line-dk)}.faq details:first-child{border-top:1px solid var(--line-dk)}.faq summary{cursor:pointer;list-style:none;padding:1.15rem 2.2rem 1.15rem 0;font-weight:600;position:relative}.faq summary::-webkit-details-marker{display:none}.faq summary::after{content:'+';position:absolute;right:.15rem;top:.85rem;font-size:1.4rem;font-weight:400;color:var(--clay)}.faq details[open] summary::after{content:'−'}.faq__body{display:grid;grid-template-rows:0fr;transition:grid-template-rows .25s}.faq details[open] .faq__body{grid-template-rows:1fr}.faq__body-inner{overflow:hidden}.faq__body p{font-size:.92rem;color:var(--stone);padding:0 0 1.15rem;margin:0}.callout{background:var(--sand);border-left:3px solid var(--clay);border-radius:0 var(--r-sm) var(--r-sm) 0;padding:1.15rem 1.4rem;margin:2.5rem 0 0;font-size:.9rem;color:var(--ink-2);max-width:78ch}.callout strong{display:block;color:var(--ink);margin-bottom:.25rem}.callout a{color:var(--clay)}
</style>
