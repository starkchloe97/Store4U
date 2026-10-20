<script setup>
import { computed, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { productImageUrl, money } from '@/utils/catalog.js';
import { useStorefront } from '@/composables/useStorefront.js';
const { state, quickViewProduct, addToCart, closeQuickView } = useStorefront();
const quantity = ref(1);
watch(() => state.quickViewId, () => { quantity.value = 1; });
const image = computed(() => quickViewProduct.value ? productImageUrl(quickViewProduct.value, 0, 1000) : '');
function add() { if (!quickViewProduct.value) return; addToCart(quickViewProduct.value.id, quantity.value); closeQuickView(); }
</script>
<template>
  <div class="modal-scrim" :class="{ on: state.quickViewId }" role="dialog" aria-modal="true"
    aria-label="Product quick view" :aria-hidden="!state.quickViewId" @click.self="closeQuickView">
    <div v-if="quickViewProduct" class="modal"><button class="modal__close" aria-label="Close quick view"
        @click="closeQuickView"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg></button>
      <div class="modal__in">
        <div class="modal__art"><img class="is-cutout" :src="image" :alt="quickViewProduct.name"></div>
        <div class="modal__body">
          <p class="pdp__cat">{{ quickViewProduct.brand }} · {{ quickViewProduct.cat }}</p>
          <h3>{{ quickViewProduct.short }}</h3><span class="price">{{ money(quickViewProduct.price) }}</span>
          <p class="delivery">In stock. Ships within 1 business day; standard delivery 3–6 business days.</p>
          <ul class="bullets">
            <li v-for="bullet in quickViewProduct.bullets.slice(0, 3)" :key="bullet">{{ bullet }}</li>
          </ul>
          <div class="buy">
            <div class="qty"><button aria-label="Decrease quantity"
                @click="quantity = Math.max(1, quantity - 1)">−</button><span>{{ quantity }}</span><button
                aria-label="Increase quantity" @click="quantity = Math.min(99, quantity + 1)">+</button></div><button
              class="btn btn--pri" @click="add">Add to Cart · {{ money(quickViewProduct.price * quantity) }}</button>
          </div>
          <RouterLink class="link-arrow" :to="`/products/${quickViewProduct.id}/`" @click="closeQuickView">View full
            details →</RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.modal-scrim {
  position: fixed;
  inset: 0;
  background: rgba(26, 26, 24, .55);
  backdrop-filter: blur(4px);
  z-index: 110;
  opacity: 0;
  pointer-events: none;
  transition: opacity .28s;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  visibility: hidden
}

.modal-scrim.on {
  opacity: 1;
  pointer-events: auto;
  visibility: visible
}

.modal {
  background: var(--paper);
  border-radius: var(--r-lg);
  max-width: 920px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--sh-xl);
  transform: translateY(20px) scale(.97);
  transition: transform .35s var(--ease-spring);
  position: relative
}

.modal-scrim.on .modal {
  transform: none
}

.modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--white);
  display: grid;
  place-items: center;
  z-index: 3;
  transition: background .18s, transform .18s;
  box-shadow: var(--sh)
}

.modal__close:hover {
  background: var(--sand);
  transform: scale(1.08)
}

.modal__in {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0
}

.modal__art {
  aspect-ratio: 1;
  background: var(--sand)
}

.modal__art img {
  width: 100%;
  height: 100%
}

.modal__body {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem
}

.modal__body h3 {
  font-size: 1.4rem;
  line-height: 1.15
}

.modal__body .price {
  font-size: 1.6rem
}

.delivery {
  font-size: .83rem;
  color: var(--ok);
  font-weight: 500;
  margin: 0
}

.pdp__cat {
  font-size: .7rem;
  font-weight: 600;
  letter-spacing: .13em;
  text-transform: uppercase;
  color: var(--clay);
  margin-bottom: -.5rem
}

.bullets {
  list-style: none;
  padding: 0;
  margin: 0
}

.bullets li {
  position: relative;
  padding-left: 1.3rem;
  font-size: .85rem;
  color: var(--ink-2);
  margin-bottom: .6rem;
  line-height: 1.5
}

.bullets li::before {
  content: '';
  position: absolute;
  left: 0;
  top: .48em;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--clay)
}

.buy {
  display: flex;
  gap: .7rem;
  align-items: stretch;
  flex-wrap: wrap
}

.qty {
  display: flex;
  align-items: center;
  border: 1.5px solid var(--line-dk);
  border-radius: var(--r-sm);
  overflow: hidden
}

.qty button {
  width: 38px;
  height: 45px;
  display: grid;
  place-items: center;
  font-size: 1.1rem;
  color: var(--stone)
}

.qty button:hover {
  background: var(--sand);
  color: var(--ink)
}

.qty span {
  min-width: 32px;
  text-align: center;
  font-weight: 600;
  font-size: .92rem
}

@media(max-width:720px) {
  .modal__in {
    grid-template-columns: 1fr
  }

  .modal__art {
    max-height: 280px
  }

  .modal__body {
    padding: 1.4rem
  }
}
</style>
