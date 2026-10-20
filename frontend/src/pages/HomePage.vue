<script setup>
import { computed } from 'vue';
import HeroSlider from '@/components/catalog/HeroSlider.vue';
import TrustStrip from '@/components/catalog/TrustStrip.vue';
import CategoryCircles from '@/components/catalog/CategoryCircles.vue';
import ProductRail from '@/components/catalog/ProductRail.vue';
import PromoTiles from '@/components/catalog/PromoTiles.vue';
import FeaturedBanner from '@/components/catalog/FeaturedBanner.vue';
import BundleSection from '@/components/catalog/BundleSection.vue';
import FounderStory from '@/components/catalog/FounderStory.vue';
import HomeFaq from '@/components/catalog/HomeFaq.vue';
import { PRODUCTS, firstIn, subcategories, categoryUrl } from '@/utils/catalog.js';
const bestSellers = computed(() => subcategories().flatMap(category => firstIn(category, 4)).slice(0, 12));
const under15 = computed(() => PRODUCTS.filter(product => product.price < 15).slice(0, 12));
const kitchenGadgets = computed(() => firstIn('Prep Tools', 12));
const foodStorage = computed(() => firstIn('Storage', 14).slice(2));
</script>
<template>
  <main>
    <HeroSlider />
    <TrustStrip />
    <CategoryCircles />
    <ProductRail title="Best sellers" :products="bestSellers" to="/shop/" />
    <PromoTiles />
    <ProductRail title="Under $15" :products="under15" to="/shop/" tone="sec--sand" />
    <ProductRail title="Kitchen gadgets" :products="kitchenGadgets" :to="categoryUrl('Prep Tools')" />
    <FeaturedBanner />
    <ProductRail title="Food storage" :products="foodStorage" :to="categoryUrl('Storage')" />
    <BundleSection />
    <FounderStory />
    <HomeFaq />
  </main>
</template>
<style scoped>
/* No additional local overrides; layout and details are encapsulated by child components. */
</style>
