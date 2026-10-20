<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { SITE_ADDRESS_LINE2 } from '@/config/siteInfo.js';
const messages = [
  'Free US shipping on orders over $50',
  '30-day returns with no restocking fee',
  'Orders ship within 1 business day'
];
const active = ref(0);
let timer;
onMounted(() => { timer = window.setInterval(() => { active.value = (active.value + 1) % messages.length; }, 5000); });
onBeforeUnmount(() => window.clearInterval(timer));
</script>
<template>
  <div class="promo">
    <div class="promo__msgs" aria-live="polite"><span v-for="(message, index) in messages" :key="message"
        :class="{ 'is-on': active === index }">{{ message }}</span></div>
  </div>
</template>
<style scoped>
.promo {
  background: var(--ink);
  color: var(--paper);
  text-align: center;
  font-size: .755rem;
  letter-spacing: .04em;
  font-weight: 500;
  padding: .62rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap
}

.promo__msgs {
  position: relative;
  height: 1.4em;
  overflow: hidden;
  flex: 1;
  max-width: 640px
}

.promo__msgs span {
  position: absolute;
  inset: 0;
  text-align: center;
  opacity: 0;
  transform: translateY(100%);
  transition: opacity .45s ease, transform .45s ease
}

.promo__msgs span.is-on {
  opacity: 1;
  transform: none
}
</style>
