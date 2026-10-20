<script setup>
import { computed } from 'vue';
import { productImageUrl, PRODUCT_BY_ID } from '@/utils/catalog.js';
import { useStorefront } from '@/composables/useStorefront.js';
const { state, closeLightbox } = useStorefront();
const product = computed(() => state.lightbox ? PRODUCT_BY_ID.get(state.lightbox.productId) : null);
const image = computed(() => product.value ? productImageUrl(product.value, state.lightbox?.index || 0, 1000) : '');
</script>
<template>
  <div class="lightbox" :class="{ on: state.lightbox }" role="dialog" aria-modal="true"
    aria-label="Enlarged product image" :aria-hidden="!state.lightbox" @click.self="closeLightbox"><button
      class="lightbox__close" aria-label="Close image" @click="closeLightbox"><svg width="24" height="24"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
        aria-hidden="true">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg></button>
    <div v-if="product" class="lightbox__art"><img class="is-cutout" :src="image" :alt="product.name"></div>
  </div>
</template>
<style scoped>
.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(26, 26, 24, .94);
  z-index: 130;
  display: grid;
  place-items: center;
  padding: 2rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity .3s;
  visibility: hidden
}

.lightbox.on {
  opacity: 1;
  pointer-events: auto;
  visibility: visible
}

.lightbox__art {
  max-width: min(760px, 92vw);
  max-height: 88vh;
  aspect-ratio: 1/1;
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--sand)
}

.lightbox__art img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-height: 88vh
}

.lightbox__close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .15);
  color: #fff;
  display: grid;
  place-items: center;
  backdrop-filter: blur(8px);
  transition: background .18s
}

.lightbox__close:hover {
  background: rgba(255, 255, 255, .28)
}
</style>
