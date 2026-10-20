<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { productImageUrl, productImageCount, money } from '@/utils/catalog.js';
import { useStorefront } from '@/composables/useStorefront.js';
const props = defineProps({ product: { type: Object, required: true } });
const { state, addToCart, toggleWishlist, openQuickView } = useStorefront();
const wished = computed(() => Boolean(state.wishlist[props.product.id]));
</script>
<template>
  <article class="card">
    <div class="card__art">
      <RouterLink :to="`/products/${product.id}/`" :aria-label="product.name">
        <img class="is-cutout" :src="productImageUrl(product, 0, 600)" :alt="product.name" loading="lazy"
          decoding="async">
        <span v-if="productImageCount(product) > 1" class="card__alt" aria-hidden="true">
          <img class="is-cutout" :src="productImageUrl(product, 1, 600)" :alt="''" loading="lazy" decoding="async">
        </span>
      </RouterLink>
      <button class="card__wish" :class="{ 'is-on': wished }" :aria-pressed="wished"
        :aria-label="`${wished ? 'Remove' : 'Save'} ${product.short} ${wished ? 'from' : 'to'} wishlist`"
        @click="toggleWishlist(product.id)">
        <svg width="15" height="15" viewBox="0 0 24 24" :fill="wished ? 'currentColor' : 'none'" stroke="currentColor"
          stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>
      <button class="card__quick" @click="openQuickView(product.id)">Quick View</button>
    </div>
    <div class="card__body">
      <div class="card__cat">{{ product.brand || product.sub }}</div>
      <h3 class="card__title">
        <RouterLink :to="`/products/${product.id}/`">{{ product.short }}</RouterLink>
      </h3>
      <div class="card__stock"><i aria-hidden="true"></i>In stock</div>
      <div class="card__foot">
        <span class="price">{{ money(product.price) }}</span>
        <button class="card__add" :aria-label="`Add ${product.short} to cart`" @click="addToCart(product.id)">
          <svg class="ico-plus" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.9" stroke-linecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
          <svg class="ico-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>
<style scoped>
.card {
  background: var(--white);
  border: 1px solid var(--line);
  border-radius: var(--r);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform .3s cubic-bezier(.16, 1, .3, 1), box-shadow .3s, border-color .3s
}

.card:hover {
  border-color: var(--line-dk);
  box-shadow: var(--sh-lg);
  transform: translateY(-4px)
}

.card__art {
  position: relative;
  aspect-ratio: 1/1;
  background: var(--sand);
  overflow: hidden
}

.card__art>a {
  display: block;
  position: relative;
  width: 100%;
  height: 100%
}

.card__art img {
  width: 100%;
  height: 100%;
  transition: transform .8s var(--ease-out)
}

.card:hover .card__art img {
  transform: scale(1.055)
}

.card__alt {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity .4s ease
}

.card__alt img {
  width: 100%;
  height: 100%
}

.card:hover .card__alt {
  opacity: 1
}

.card__wish {
  position: absolute;
  bottom: .7rem;
  right: .7rem;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .94);
  display: grid;
  place-items: center;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity .25s, transform .25s var(--ease-out), background .18s;
  z-index: 3;
  color: var(--ink)
}

.card:hover .card__wish,
.card__wish.is-on {
  opacity: 1;
  transform: none
}

.card__wish:hover,
.card__wish.is-on {
  background: var(--clay);
  color: #fff
}

.card__wish.is-on svg {
  fill: currentColor
}

.card__quick {
  position: absolute;
  left: .7rem;
  right: .7rem;
  bottom: .7rem;
  background: rgba(26, 26, 24, .94);
  color: #fff;
  border-radius: var(--r-sm);
  padding: .58rem;
  font-size: .78rem;
  font-weight: 600;
  text-align: center;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity .28s, transform .28s var(--ease-out);
  z-index: 2
}

.card:hover .card__quick {
  opacity: 1;
  transform: none
}

.card__quick:hover {
  background: var(--clay)
}

.card__body {
  padding: 1.05rem 1.15rem 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1
}

.card__cat {
  font-size: .68rem;
  font-weight: 600;
  letter-spacing: .11em;
  text-transform: uppercase;
  color: var(--stone-lt);
  margin-bottom: .35rem
}

.card__title {
  font-family: var(--sans);
  font-size: .925rem;
  font-weight: 600;
  line-height: 1.38;
  margin-bottom: .5rem;
  letter-spacing: -.012em
}

.card__title a:hover {
  color: var(--clay)
}

.card__stock {
  font-size: .72rem;
  font-weight: 500;
  color: var(--ok);
  margin-bottom: .5rem;
  display: flex;
  align-items: center;
  gap: .35rem
}

.card__stock i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block
}

.card__foot {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .6rem
}

.price {
  font-family: var(--serif);
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0;
  font-variant-numeric: lining-nums tabular-nums
}

.card__add {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--sand);
  display: grid;
  place-items: center;
  transition: background .25s, color .25s, transform .25s var(--ease-spring);
  flex-shrink: 0;
  color: var(--ink);
  position: relative;
  overflow: hidden
}

.card__add:hover {
  background: var(--ink);
  color: var(--paper);
  transform: scale(1.08)
}

.card__add svg {
  transition: transform .3s var(--ease-spring), opacity .2s;
  position: absolute
}

.ico-plus {
  opacity: 1
}

.ico-check {
  opacity: 0;
  transform: scale(.4)
}

.card__add:active .ico-plus {
  opacity: 0
}

.card__add:active .ico-check {
  opacity: 1;
  transform: scale(1)
}

@media(prefers-reduced-motion:reduce) {

  .card,
  .card__art img,
  .card__wish,
  .card__quick {
    transition: none
  }

  .card:hover {
    transform: none
  }
}
</style>
