<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import PageHero from '@/components/shared/PageHero.vue';
import { SITE_NAME, SITE_PHONE, SITE_PHONE_RAW, SITE_EMAIL, SITE_ADDRESS_LINE1, SITE_ADDRESS_LINE2, SITE_PARTNER_EMAIL } from '@/config/siteInfo.js';
import { submitSiteForm, collectTracking } from '@/utils/formSubmission.js';

const topics = ['Order status or shipping', 'Return or refund', 'Product question', 'Warranty claim', 'Wholesale or partnership', 'Something else'];
const form = ref({ firstName: '', lastName: '', email: '', order: '', topic: '', message: '', website: '' });
const submitted = ref(false);
const busy = ref(false);
const errors = ref({});
const errorMessage = ref('');

function validateContact() {
  const next = {};
  for (const key of ['firstName', 'lastName', 'email', 'topic', 'message']) {
    if (!String(form.value[key] || '').trim()) next[key] = true;
  }
  if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email.trim())) next.email = true;
  errors.value = next;
  if (Object.keys(next).length) {
    errorMessage.value = 'Please complete the required fields and enter a valid email address.';
    return false;
  }
  errorMessage.value = '';
  return true;
}

async function submitContact() {
  if (busy.value || submitted.value || !validateContact()) return;
  busy.value = true;
  errorMessage.value = '';
  try {
    await submitSiteForm({
      form_type: 'contact',
      first_name: form.value.firstName.trim(),
      last_name: form.value.lastName.trim(),
      email: form.value.email.trim(),
      order_number: form.value.order.trim(),
      topic: form.value.topic,
      message: form.value.message.trim(),
      website: form.value.website,
      tracking: collectTracking()
    });
    submitted.value = true;
  } catch (error) {
    errorMessage.value = error?.message || 'We could not submit your message. Please try again.';
  } finally {
    busy.value = false;
  }
}
</script>
<template><main><PageHero title="Contact Us" description="Questions about an order, a product, or a partnership? We answer every message within one business day." :breadcrumbs="[{ label: 'Contact Us' }]"/><section class="sec"><div class="wrap contact-grid"><div><div class="info-block"><h3>Customer Support</h3><p><a :href="`mailto:${SITE_EMAIL}`">{{ SITE_EMAIL }}</a><br><a :href="`tel:${SITE_PHONE_RAW}`">{{ SITE_PHONE }}</a></p></div><div class="info-block"><h3>Business Address</h3><address><strong>{{ SITE_NAME }}</strong><br>{{ SITE_ADDRESS_LINE1 }}<br>{{ SITE_ADDRESS_LINE2 }}</address></div><div class="info-block"><h3>Returns Address</h3><address>{{ SITE_NAME }} — Returns Dept.<br>{{ SITE_ADDRESS_LINE1 }}<br>{{ SITE_ADDRESS_LINE2 }}</address></div><div class="info-block"><h3>Business Hours</h3><p>Monday – Friday<br>9:00 AM – 5:00 PM Central Time<br>Closed weekends and US federal holidays</p></div><div class="info-block"><h3>Response Times</h3><p>Email: within 1 business day<br>Returns processed: within 3 business days of receipt</p></div><div class="info-block"><h3>Wholesale &amp; Partnerships</h3><p>For reseller, marketplace, or wholesale inquiries, email <a :href="`mailto:${SITE_PARTNER_EMAIL}`">{{ SITE_PARTNER_EMAIL }}</a> with your company name and resale certificate.</p></div></div>  <div class="contact-form-card"><h2>Send us a message</h2><p class="form-intro">Fields marked with an asterisk are required. We'll respond to the email address you provide.</p><div v-if="errorMessage" class="alert alert--err" role="alert">{{ errorMessage }}</div><div v-if="submitted" class="alert" role="status">Thank you. Your message has been submitted successfully. Our team will reply within one business day.</div><form novalidate @submit.prevent="submitContact"><div class="form-honeypot" aria-hidden="true"><label for="contactWebsite">Leave this field blank</label><input id="contactWebsite" v-model="form.website" name="website" tabindex="-1" autocomplete="off"></div><div class="form-2"><div class="form-row"><label for="cFirst">First name *</label><input id="cFirst" v-model.trim="form.firstName" name="firstName" required autocomplete="given-name" :class="{ 'is-bad': errors.firstName }" @input="errors.firstName = false"></div><div class="form-row"><label for="cLast">Last name *</label><input id="cLast" v-model.trim="form.lastName" name="lastName" required autocomplete="family-name" :class="{ 'is-bad': errors.lastName }" @input="errors.lastName = false"></div></div><div class="form-row"><label for="cEmail">Email address *</label><input id="cEmail" v-model.trim="form.email" name="email" type="email" required autocomplete="email" :class="{ 'is-bad': errors.email }" @input="errors.email = false"></div><div class="form-row"><label for="cOrder">Order number (optional)</label><input id="cOrder" v-model.trim="form.order" name="order" type="text" placeholder="HF-000000"></div><div class="form-row"><label for="cTopic">What is this regarding? *</label><select id="cTopic" v-model="form.topic" name="topic" required :class="{ 'is-bad': errors.topic }" @change="errors.topic = false"><option value="">Select a topic</option><option v-for="topic in topics" :key="topic">{{ topic }}</option></select></div><div class="form-row"><label for="cMsg">Message *</label><textarea id="cMsg" v-model.trim="form.message" name="message" required placeholder="Tell us what you need help with." :class="{ 'is-bad': errors.message }" @input="errors.message = false"></textarea></div><button type="submit" class="btn btn--pri btn--full" :disabled="busy || submitted">{{ busy ? 'Submitting…' : submitted ? 'Message Submitted' : 'Send Message' }}</button><p class="form-note">By submitting this form you agree to our <RouterLink to="/policies/privacy/">Privacy Policy</RouterLink>. We never sell or share your contact information.</p></form></div></div></section></main></template>
<style scoped>
.contact-grid{display:grid;grid-template-columns:1fr 1.15fr;gap:clamp(2rem,5vw,4rem);align-items:start}.info-block{border-top:1px solid var(--line);padding:1.35rem 0}.info-block:first-child{border-top:0;padding-top:0}.info-block h3{font-family:var(--sans);font-size:.72rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--stone-lt);margin-bottom:.55rem}.info-block p,.info-block address{font-style:normal;font-size:.94rem;color:var(--ink-2);line-height:1.7;margin:0}.info-block a{color:var(--clay);font-weight:500}.info-block a:hover{text-decoration:underline;text-underline-offset:2px}.contact-form-card{background:var(--white);border:1px solid var(--line);border-radius:var(--r-lg);padding:clamp(1.5rem,3vw,2.25rem)}.contact-form-card h2{font-size:1.4rem;margin-bottom:.5rem}.form-intro{font-size:.88rem;color:var(--stone);margin-bottom:1.75rem}.form-2{display:grid;grid-template-columns:1fr 1fr;gap:1rem}.form-row{display:grid;gap:.35rem;margin-bottom:1.1rem}.form-row label{font-size:.8rem;font-weight:600;color:var(--ink)}.form-row input,.form-row select,.form-row textarea{width:100%;padding:.78rem .95rem;border:1.5px solid var(--line-dk);border-radius:var(--r-sm);background:var(--white);font-size:.92rem;transition:border-color .18s;font-family:var(--sans)}.form-row input:focus,.form-row select:focus,.form-row textarea:focus{outline:none;border-color:var(--ink)}.form-row .is-bad{border-color:var(--clay);background:#FDF5F1}.form-row textarea{resize:vertical;min-height:130px}.form-note{font-size:.78rem;color:var(--stone);line-height:1.55;margin-top:1rem}.form-note a{color:var(--clay)}.form-honeypot{position:absolute!important;left:-10000px!important;top:auto!important;width:1px!important;height:1px!important;overflow:hidden!important}.btn:disabled{opacity:.65;cursor:wait}.alert{padding:.9rem 1.15rem;border-radius:var(--r-sm);font-size:.88rem;margin-bottom:1.25rem;background:#EDF4EE;border:1px solid #C6DECB;color:#2E5B39}.alert--err{background:#FBEDE7;border-color:#EFC7B6;color:#8E3A1C}
@media(max-width:860px){.contact-grid{grid-template-columns:1fr;gap:2.5rem}}@media(max-width:520px){.form-2{grid-template-columns:1fr}}
</style>
