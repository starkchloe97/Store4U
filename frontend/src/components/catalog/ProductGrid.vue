<script setup>
import ProductCard from '@/components/catalog/ProductCard.vue';
defineProps({ products: { type: Array, default: () => [] } });
</script>
<template>
  <div class="grid">
    <ProductCard v-for="product in products" :key="product.id" :product="product" />
    <div v-if="!products.length" class="empty-grid">
      <h3>No products match these filters</h3>
      <p>Try removing a filter or widening the price range.</p>
      <slot name="empty-action" />
    </div>
  </div>
</template>
<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.35rem
}

.empty-grid {
  grid-column: 1/-1;
  text-align: center;
  padding: 4rem 1rem
}

.empty-grid h3 {
  font-family: var(--sans);
  font-size: 1.5rem;
  margin-bottom: .5rem
}

.empty-grid p {
  color: var(--stone);
  margin-bottom: 1.5rem
}

@media(max-width:1080px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr))
  }
}

@media(max-width:820px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem
  }
}

@media(max-width:430px) {
  .grid {
    grid-template-columns: 1fr
  }
}
</style>
