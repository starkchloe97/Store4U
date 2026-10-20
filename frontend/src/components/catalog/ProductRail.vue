<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import ProductCard from '@/components/catalog/ProductCard.vue';
defineProps({ title: { type: String, required: true }, products: { type: Array, default: () => [] }, to: { type: String, default: '/shop/' }, tone: { type: String, default: '' } });
const track = ref(null);
const scroll = direction => track.value?.scrollBy({ left: direction * Math.max(260, track.value.clientWidth * .8), behavior: 'smooth' });
</script>
<template>
  <section v-if="products.length" v-reveal class="sec rv" :class="tone">
    <div class="wrap">
      <div class="rail__head">
        <h2>{{ title }}</h2>
        <div class="rail__ctrl">
          <RouterLink :to="to" class="link-arrow">View all →</RouterLink><button class="rail__btn"
            aria-label="Scroll products left" @click="scroll(-1)"><svg width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg></button><button class="rail__btn" aria-label="Scroll products right" @click="scroll(1)"><svg
              width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m9 6 6 6-6 6" />
            </svg></button>
        </div>
      </div>
      <div ref="track" class="rail__track">
        <ProductCard v-for="product in products" :key="product.id" :product="product" />
      </div>
    </div>
  </section>
</template>
<style scoped>
.rail__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem
}

.rail__ctrl {
  display: flex;
  align-items: center;
  gap: .5rem
}

.rail__ctrl .link-arrow {
  margin-right: .75rem
}

.rail__btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--line-dk);
  background: var(--white);
  display: grid;
  place-items: center;
  color: var(--ink);
  transition: background .2s, color .2s, border-color .2s
}

.rail__btn:hover {
  background: var(--ink);
  color: #fff;
  border-color: var(--ink)
}

.rail__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - 3 * 1.25rem) / 4);
  gap: 1.25rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  padding: 6px 2px 14px;
  margin: -6px -2px 0
}

.rail__track::-webkit-scrollbar {
  display: none
}

.rail__track>* {
  scroll-snap-align: start
}

@media(max-width:1080px) {
  .rail__track {
    grid-auto-columns: calc((100% - 2 * 1.25rem) / 3)
  }
}

@media(max-width:820px) {
  .rail__track {
    grid-auto-columns: calc((100% - 1.25rem) / 2.25)
  }
}

@media(max-width:480px) {
  .rail__track {
    grid-auto-columns: 72%
  }
}
</style>
