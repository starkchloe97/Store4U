<script setup>
import { RouterLink } from 'vue-router';
import { money, productImageUrl } from '@/utils/catalog.js';
const props = defineProps({ product: { type: Object, required: true }, quantity: { type: Number, required: true } });
const emit = defineEmits(['change', 'remove']);
</script>
<template>
  <article class="line-item">
    <RouterLink class="line-item__art" :to="`/products/${product.id}/`"><img class="is-cutout"
        :src="productImageUrl(product, 0, 200)" :alt="product.name" loading="lazy"></RouterLink>
    <div>
      <h4>
        <RouterLink :to="`/products/${product.id}/`">{{ product.short }}</RouterLink>
      </h4>
      <div class="line-item__sku">{{ product.item ? `Item # ${product.item}` : product.brand }}</div>
      <div class="line-item__row">
        <div class="mini-qty"><button type="button" :aria-label="`Decrease ${product.short} quantity`"
            @click="emit('change', quantity - 1)">−</button><span>{{ quantity }}</span><button type="button"
            :aria-label="`Increase ${product.short} quantity`" @click="emit('change', quantity + 1)">+</button></div>
        <span class="line-item__price">{{ money(product.price * quantity) }}</span>
      </div><button type="button" class="rm" @click="emit('remove')">Remove</button>
    </div>
  </article>
</template>
<style scoped>
.line-item {
  display: grid;
  grid-template-columns: 74px 1fr;
  gap: 1rem;
  padding: 1.05rem 0;
  border-bottom: 1px solid var(--line);
  animation: lineIn .4s var(--ease-out)
}

@keyframes lineIn {
  from {
    opacity: 0;
    transform: translateX(8px)
  }

  to {
    opacity: 1;
    transform: none
  }
}

.line-item:first-child {
  padding-top: 0;
  border-top: 0
}

.line-item__art {
  aspect-ratio: 1;
  border-radius: var(--r-sm);
  overflow: hidden;
  background: var(--sand)
}

.line-item__art img {
  width: 100%;
  height: 100%
}

.line-item h4 {
  font-family: var(--sans);
  font-size: .855rem;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: .25rem
}

.line-item h4 a:hover {
  color: var(--clay)
}

.line-item__sku {
  font-size: .7rem;
  color: var(--stone-lt);
  margin-bottom: .55rem;
  font-family: ui-monospace, monospace
}

.line-item__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem
}

.mini-qty {
  display: flex;
  align-items: center;
  border: 1px solid var(--line-dk);
  border-radius: var(--r-sm);
  overflow: hidden
}

.mini-qty button {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  font-size: .95rem;
  color: var(--stone);
  transition: background .18s
}

.mini-qty button:hover {
  background: var(--sand);
  color: var(--ink)
}

.mini-qty span {
  min-width: 24px;
  text-align: center;
  font-size: .8rem;
  font-weight: 600
}

.line-item__price {
  font-weight: 600;
  font-size: .9rem
}

.rm {
  font-size: .72rem;
  color: var(--stone-lt);
  text-decoration: underline;
  text-underline-offset: 2px;
  margin-top: .5rem
}

.rm:hover {
  color: var(--clay)
}
</style>
