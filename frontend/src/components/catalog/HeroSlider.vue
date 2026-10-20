<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { PRODUCTS, countIn, firstIn, categoryUrl, productImageUrl } from '@/utils/catalog.js';
const slides = [
  { category: 'Prep Tools', tone: 'sand', kicker: 'Kitchen gadgets', title: 'Small tools that make every meal easier', text: 'Scales, thermometers, openers and the gadgets you reach for every day.' },
  { category: 'Storage', tone: 'sage', kicker: 'Food storage', title: 'Keep food fresh and your fridge in order', text: 'Containers, bag holders, wraps and racks that put everything in its place.' },
  { category: 'Cabinet & Drawer', tone: 'clay', kicker: 'Drawer organizers', title: 'Open a drawer and find it on the first try', text: 'Utensil trays and drawer organizers that end the junk-drawer dig.' },
  { category: 'Home Organization', tone: 'stone', kicker: 'Around the house', title: 'Racks, bins and shelves for every room', text: 'Storage that keeps closets, bathrooms and laundry rooms tidy.' }
].filter(slide => countIn(slide.category) >= 4);
const active = ref(0);
const paused = ref(false);
let timer;
function go(index) { active.value = (index + slides.length) % slides.length; restart(); }
function restart() { window.clearInterval(timer); if (!paused.value && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) timer = window.setInterval(() => { active.value = (active.value + 1) % slides.length; }, 6000); }
onMounted(restart);
onBeforeUnmount(() => window.clearInterval(timer));
const slideProducts = category => firstIn(category, 4);
const collages = category => slideProducts(category).slice(0, 4);
const image = (product, idx = 0) => productImageUrl(product, idx, 500);
</script>
<template>
  <section class="hs" aria-roledescription="carousel" aria-label="Featured collections"
    @mouseenter="paused = true; restart()" @mouseleave="paused = false; restart()" @focusin="paused = true"
    @focusout="paused = false; restart()">
    <div class="hs__track">
      <article v-for="(slide, index) in slides" :key="slide.category" class="hs__slide"
        :class="[`hs__slide--${slide.tone}`, { 'is-on': active === index }]" role="group" aria-roledescription="slide"
        :aria-label="`${index + 1} of ${slides.length}`" :aria-hidden="active !== index">
        <div class="wrap hs__in">
          <div class="hs__copy">
            <p class="hs__kicker">{{ slide.kicker }}</p>
            <component :is="index === 0 ? 'h1' : 'h2'" class="hs__title">{{ slide.title }}</component>
            <p class="lede">{{ slide.text }}</p>
            <div class="hero__cta">
              <RouterLink :to="categoryUrl(slide.category)" class="btn btn--pri">Shop {{ countIn(slide.category) }}
                products</RouterLink>
              <RouterLink to="/shop/" class="btn btn--ghost">Shop all</RouterLink>
            </div>
          </div>
          <div class="hs__art">
            <div class="collage"><img v-for="(product, i) in collages(slide.category)" :key="product.id"
                class="is-cutout" :src="image(product, i)" :alt="product.name"
                :loading="active === index ? 'eager' : 'lazy'" decoding="async"></div>
          </div>
        </div>
      </article>
    </div>
    <template v-if="slides.length > 1"><button class="hs__arrow hs__arrow--prev" aria-label="Previous slide"
        @click="go(active - 1)"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m15 18-6-6 6-6" />
        </svg></button><button class="hs__arrow hs__arrow--next" aria-label="Next slide" @click="go(active + 1)"><svg
          width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m9 6 6 6-6 6" />
        </svg></button>
      <div class="hs__dots"><button v-for="(_, index) in slides" :key="index" :class="{ 'is-on': active === index }"
          :aria-label="`Go to slide ${index + 1}`" @click="go(index)"><span></span></button></div>
    </template>
  </section>
</template>
<style scoped>
.hs {
  position: relative;
  overflow: hidden
}

.hs__track {
  display: grid
}

.hs__slide {
  grid-area: 1/1;
  opacity: 0;
  visibility: hidden;
  transition: opacity .7s ease, visibility .7s
}

.hs__slide.is-on {
  opacity: 1;
  visibility: visible
}

.hs__slide--sand {
  background: var(--sand)
}

.hs__slide--sage {
  background: #E6EBDF
}

.hs__slide--clay {
  background: #F4E4DA
}

.hs__slide--stone {
  background: #ECEAE4
}

.hs__in {
  display: grid;
  grid-template-columns: 1.05fr .95fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
  padding-top: clamp(2.5rem, 5vw, 4rem);
  padding-bottom: clamp(3.5rem, 6vw, 5rem);
  min-height: clamp(440px, 44vw, 560px)
}

.hs__kicker {
  font-size: .8rem;
  font-weight: 700;
  letter-spacing: .09em;
  text-transform: uppercase;
  color: var(--clay);
  margin-bottom: .7rem
}

.hs__title {
  font-size: clamp(2rem, 4.2vw, 3.25rem);
  margin-bottom: 1rem
}

.hs__copy .lede {
  margin-bottom: 1.75rem
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
  margin-bottom: 2.25rem
}

.hs__art {
  width: 100%;
  max-width: 470px;
  justify-self: center;
  aspect-ratio: 1;
  border-radius: var(--r-lg);
  overflow: hidden;
  background: #fff;
  box-shadow: var(--sh-xl)
}

.collage {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 2px;
  width: 100%;
  height: 100%;
  background: var(--line)
}

.collage img {
  width: 100%;
  height: 100%;
  min-height: 0;
  object-fit: contain;
  background: #fff;
  padding: 8%
}

.hs__slide.is-on .hs__copy {
  animation: hsUp .8s cubic-bezier(.16, 1, .3, 1) both
}

.hs__slide.is-on .hs__art {
  animation: hsZoom 1s cubic-bezier(.16, 1, .3, 1) .1s both
}

@keyframes hsUp {
  from {
    opacity: 0;
    transform: translateY(26px)
  }

  to {
    opacity: 1;
    transform: none
  }
}

@keyframes hsZoom {
  from {
    opacity: 0;
    transform: scale(.95) rotate(-1deg)
  }

  to {
    opacity: 1;
    transform: none
  }
}

.hs__arrow {
  position: absolute;
  bottom: 8px;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .92);
  box-shadow: var(--sh);
  display: grid;
  place-items: center;
  color: var(--ink);
  z-index: 3;
  transition: background .2s, color .2s
}

.hs__arrow:hover {
  background: var(--ink);
  color: #fff
}

.hs__arrow--prev {
  left: calc(50% - 110px)
}

.hs__arrow--next {
  right: calc(50% - 110px)
}

.hs__dots {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 23px;
  display: flex;
  justify-content: center;
  gap: .5rem;
  z-index: 3;
  pointer-events: none
}

.hs__dots button {
  pointer-events: auto;
  width: 38px;
  height: 4px;
  padding: 0;
  border-radius: 2px;
  background: rgba(26, 26, 24, .18);
  overflow: hidden
}

.hs__dots span {
  display: block;
  height: 100%;
  width: 0;
  background: var(--ink)
}

.hs__dots button.is-on span {
  animation: hsProg 6s linear forwards
}

@keyframes hsProg {
  to {
    width: 100%
  }
}

@media(max-width:880px) {
  .hs__in {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    min-height: 0;
    padding-top: 1.75rem
  }

  .hs__art {
    order: -1;
    max-width: 300px
  }
}

@media(prefers-reduced-motion:reduce) {

  .hs__slide.is-on .hs__copy,
  .hs__slide.is-on .hs__art,
  .hs__dots button.is-on span {
    animation: none
  }
}
</style>
