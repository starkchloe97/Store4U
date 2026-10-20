<script setup>
import { computed, nextTick, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { searchProducts, productImageUrl } from '@/utils/catalog.js';
import { useStorefront } from '@/composables/useStorefront.js';
const { state, money } = useStorefront();
const query = ref('');
const input = ref(null);
const results = computed(() => searchProducts(query.value, 20));
const popular = ['under sink', 'drawer', 'pantry', 'container', 'spice', 'rack', 'funnel'];
watch(() => state.searchOpen, async open => {
  if (open) { await nextTick(); input.value?.focus(); }
  else query.value = '';
});
</script>
<template>
  <div class="search-ol" :class="{ on: state.searchOpen }" role="dialog" aria-modal="true" aria-label="Search products"
    :aria-hidden="!state.searchOpen" @click.self="state.searchOpen = false">
    <div class="search-ol__in">
      <div class="search-ol__bar"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" />
        </svg><label class="sr" for="searchInput">Search products</label><input id="searchInput" ref="input"
          v-model="query" type="search" placeholder="Search storage, kitchen, and more…" autocomplete="off"><button
          class="search-ol__close" aria-label="Close search" @click="state.searchOpen = false"><svg width="22"
            height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
            aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg></button></div>
      <div class="search-results"><template v-if="!query.trim()">
          <p class="search-hint">Popular searches</p>
          <div class="search-tags"><button v-for="tag in popular" :key="tag" @click="query = tag">{{ tag }}</button>
          </div>
        </template>
        <p v-else class="search-hint">{{ results.length }} result{{ results.length === 1 ? '' : 's' }} for “{{ query }}”
        </p>
        <div v-for="product in results" :key="product.id" class="search-item">
          <RouterLink class="search-item__art" :to="`/products/${product.id}/`" @click="state.searchOpen = false"><img
              class="is-cutout" :src="productImageUrl(product, 0, 200)" :alt="product.name" loading="lazy"></RouterLink>
          <div>
            <h4>
              <RouterLink :to="`/products/${product.id}/`" @click="state.searchOpen = false">{{ product.short }}
              </RouterLink>
            </h4><span>{{ product.brand || product.sub }}</span>
          </div><span class="price">{{ money(product.price) }}</span>
        </div>
        <p v-if="query.trim() && !results.length" class="no-results">No products match “{{ query }}”. Try a different
          search
          term.</p>
      </div>
    </div>
  </div>
</template>
<style scoped>
.search-ol {
  position: fixed;
  inset: 0;
  background: rgba(251, 250, 247, .98);
  backdrop-filter: blur(14px);
  z-index: 100;
  opacity: 0;
  pointer-events: none;
  transition: opacity .28s;
  display: flex;
  flex-direction: column;
  padding: 2rem 0;
  visibility: hidden
}

.search-ol.on {
  opacity: 1;
  pointer-events: auto;
  visibility: visible
}

.search-ol__in {
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
  padding: 0 24px;
  flex: 1;
  display: flex;
  flex-direction: column
}

.search-ol__bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 2px solid var(--ink);
  padding-bottom: 1rem;
  margin-bottom: 2rem
}

.search-ol__bar input {
  flex: 1;
  background: none;
  border: 0;
  font-size: 1.5rem;
  font-family: var(--sans);
  letter-spacing: -.02em;
  padding: .5rem 0
}

.search-ol__bar input:focus {
  outline: none
}

.search-ol__bar input::placeholder {
  color: var(--stone-lt)
}

.search-ol__close {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  transition: background .18s
}

.search-ol__close:hover {
  background: var(--sand)
}

.search-results {
  flex: 1;
  overflow-y: auto
}

.search-hint {
  font-size: .78rem;
  font-weight: 600;
  letter-spacing: .11em;
  text-transform: uppercase;
  color: var(--stone-lt);
  margin-bottom: 1rem
}

.search-tags {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  margin-bottom: 2rem
}

.search-tags button {
  padding: .5rem 1rem;
  border-radius: var(--r-sm);
  border: 1px solid var(--line-dk);
  font-size: .82rem;
  color: var(--ink-2);
  transition: all .18s
}

.search-tags button:hover {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink)
}

.search-item {
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: .85rem 0;
  border-bottom: 1px solid var(--line);
  transition: background .18s
}

.search-item:hover {
  background: var(--sand)
}

.search-item__art {
  width: 60px;
  height: 60px;
  border-radius: var(--r-sm);
  overflow: hidden;
  background: var(--sand)
}

.search-item__art img {
  width: 100%;
  height: 100%
}

.search-item h4 {
  font-family: var(--sans);
  font-size: .9rem;
  font-weight: 600;
  margin-bottom: .2rem
}

.search-item h4 a:hover {
  color: var(--clay)
}

.search-item span {
  font-size: .78rem;
  color: var(--stone)
}

.search-item .price {
  font-size: 1rem
}

.no-results {
  padding: 1rem 0;
  color: var(--stone)
}
</style>
