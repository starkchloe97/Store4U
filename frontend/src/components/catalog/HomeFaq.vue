<script setup>
import { RouterLink } from 'vue-router';
import { SITE_NAME, SITE_EMAIL } from '@/config/siteInfo.js';
const faqs = [
  { question: 'How long does shipping take?', answer: 'Orders placed before 1:00 PM Central Time ship the same business day. Standard shipping takes 3–6 business days. Expedited (2–3 days) and Priority (1–2 days) are available at checkout.' },
  { question: 'What is your return policy?', answer: 'You may return any unused item within 30 days of delivery in its original packaging for a full refund of the purchase price. No restocking fee. Return shipping is free for defective or incorrect items.' },
  { question: 'Where do you ship from?', answer: 'All orders ship from our Dallas, Texas facility. We currently ship within the United States only.' },
  { question: 'Are your products authentic?', answer: 'Yes. Every product is a genuine branded item, and each listing names the brand and shows its specifications.' },
  { question: 'What if a product fails?', answer: `Every ${SITE_NAME} product carries a 1–2 year limited warranty. Email ${SITE_EMAIL} with photos of the problem and we will replace it or refund you.` }
];
</script>
<template>
  <section v-reveal class="rv sec sec--sand">
    <div class="wrap faq-home">
      <div class="sec-head">
        <h2>Common questions</h2>
      </div>
      <div class="faq">
        <details v-for="faq in faqs" :key="faq.question">
          <summary>{{ faq.question }}</summary>
          <div class="faq__body">
            <div class="faq__body-inner">
              <p>{{ faq.answer }}</p>
            </div>
          </div>
        </details>
      </div>
      <p class="faq-more">More questions? <RouterLink to="/faq/">See the full FAQ</RouterLink> or <RouterLink
          to="/contact/">contact us</RouterLink>. We reply within one business day.</p>
    </div>
  </section>
</template>
<style scoped>
.faq-home {
  text-align: center
}

.faq-home .sec-head,
.faq-home .faq {
  margin-left: auto;
  margin-right: auto
}

.faq-home .faq {
  text-align: left;
  max-width: 840px
}

.faq details {
  border-bottom: 1px solid var(--line-dk)
}

.faq details:first-child {
  border-top: 1px solid var(--line-dk)
}

.faq summary {
  cursor: pointer;
  list-style: none;
  padding: 1.15rem 2.2rem 1.15rem 0;
  font-weight: 600;
  position: relative
}

.faq summary::-webkit-details-marker {
  display: none
}

.faq summary::after {
  content: '+';
  position: absolute;
  right: .15rem;
  top: .85rem;
  font-size: 1.4rem;
  font-weight: 400;
  color: var(--clay)
}

.faq details[open] summary::after {
  content: '−'
}

.faq__body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows .25s
}

.faq details[open] .faq__body {
  grid-template-rows: 1fr
}

.faq__body-inner {
  overflow: hidden
}

.faq__body p {
  font-size: .92rem;
  color: var(--stone);
  padding: 0 0 1.15rem;
  margin: 0
}

.faq-more {
  margin-top: 2rem;
  font-size: .9rem;
  color: var(--stone)
}

.faq-more a {
  color: var(--clay);
  text-decoration: underline
}
</style>
