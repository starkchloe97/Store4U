<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { firstIn, PRODUCTS, money, productImageUrl, categoryUrl } from '@/utils/catalog.js';
const storage = computed(() => firstIn('Storage', 2));
const cabinet = computed(() => firstIn('Cabinet & Drawer', 2));
const lowPrice = computed(() => Math.min(...PRODUCTS.filter(product => product.sub === 'Cabinet & Drawer').map(product => product.price)));
</script>
<template>
  <section v-reveal class="sec sec--tight rv">
    <div class="wrap ptiles">
      <RouterLink to="/collections/storage/" class="ptile ptile--ink">
        <div class="ptile__copy">
          <p class="ptile__kicker">Free shipping</p>
          <h3>Spend $50, ship free</h3>
          <p>Standard US shipping is on us for every order over $50.</p><span class="ptile__cta">Shop storage →</span>
        </div>
        <div class="ptile__art"><img v-for="product in storage" :key="product.id" class="is-cutout"
            :src="productImageUrl(product, 0, 400)" :alt="product.name" loading="lazy"></div>
      </RouterLink>
      <RouterLink :to="categoryUrl('Cabinet & Drawer')" class="ptile ptile--clay">
        <div class="ptile__copy">
          <p class="ptile__kicker">Get organized</p>
          <h3>Drawer and cabinet makeover</h3>
          <p>Trays, dividers and organizers from {{ money(lowPrice) }}.</p><span class="ptile__cta">Shop organizers
            →</span>
        </div>
        <div class="ptile__art"><img v-for="product in cabinet" :key="product.id" class="is-cutout"
            :src="productImageUrl(product, 0, 400)" :alt="product.name" loading="lazy"></div>
      </RouterLink>
    </div>
  </section>
</template>
<style scoped>
.ptiles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem
}

.ptile {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  border-radius: var(--r-lg);
  overflow: hidden;
  min-height: 250px;
  transition: transform .3s cubic-bezier(.16, 1, .3, 1), box-shadow .3s
}

.ptile:hover {
  transform: translateY(-4px);
  box-shadow: var(--sh-xl)
}

.ptile--ink {
  background: var(--ink);
  color: var(--paper)
}

.ptile--clay {
  background: var(--clay);
  color: #fff
}

.ptile__copy {
  padding: clamp(1.25rem, 3vw, 2rem)
}

.ptile__kicker {
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  opacity: .75;
  margin-bottom: .45rem
}

.ptile h3 {
  font-size: clamp(1.3rem, 2.2vw, 1.65rem);
  color: inherit;
  margin-bottom: .5rem
}

.ptile p {
  font-size: .92rem;
  opacity: .88;
  margin-bottom: 1.1rem
}

.ptile__cta {
  font-weight: 700;
  font-size: .92rem;
  border-bottom: 2px solid currentColor;
  padding-bottom: 2px
}

.ptile__art {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: .6rem;
  padding: 1.25rem 1.25rem 1.25rem 0;
  align-content: center
}

.ptile__art img {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--r);
  transition: transform .5s cubic-bezier(.16, 1, .3, 1)
}

.ptile:hover .ptile__art img {
  transform: scale(1.05) rotate(-1deg)
}

.ptile:hover .ptile__art img+img {
  transform: scale(1.05) rotate(1deg)
}

@media(max-width:820px) {
  .ptiles {
    grid-template-columns: 1fr
  }
}

@media(prefers-reduced-motion:reduce) {
  .ptile {
    transition: none
  }

  .ptile:hover,
  .ptile:hover .ptile__art img {
    transform: none
  }
}
</style>
