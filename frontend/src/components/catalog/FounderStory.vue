<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { PRODUCTS, subcategories, firstIn, productImageUrl } from '@/utils/catalog.js';
import { SITE_NAME } from '@/config/siteInfo.js';
const images = computed(() => subcategories().map(category => firstIn(category, 2)[1] || firstIn(category)[0]).filter(Boolean).concat(PRODUCTS.slice(4)).slice(0, 4));
</script>
<template>
    <section v-reveal class="rv sec">
        <div class="wrap founder">
            <div class="founder__img founder__img--white">
                <div class="collage"><img v-for="product in images" :key="product.id" class="is-cutout"
                        :src="productImageUrl(product, 0, 500)" :alt="product.name" loading="lazy"></div>
            </div>
            <div>
                <h2>A small store in Dallas, Texas</h2>
                <p class="lede">{{ SITE_NAME }} brings together the best-selling storage and kitchen products in one
                    place, so you don't have to dig through thousands of listings to find the ones that work.</p>
                <p class="lede">Every listing shows the brand, full specifications and photos. Orders ship from Dallas
                    and returns come back to the same address.</p>
                <RouterLink to="/about/" class="link-arrow">About the company →</RouterLink>
            </div>
        </div>
    </section>
</template>
<style scoped>
.founder {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: clamp(2rem, 5vw, 4.5rem);
    align-items: center
}

.founder__img {
    aspect-ratio: 1/1;
    border-radius: var(--r-lg);
    overflow: hidden;
    background: var(--sand);
    position: relative
}

.founder__img--white {
    background: #fff
}

.collage {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 2px;
    background: var(--line)
}

.collage img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: #fff;
    padding: 8%
}

.founder h2 {
    font-size: clamp(1.7rem, 3vw, 2.25rem);
    margin-bottom: 1rem
}

.founder .lede {
    font-size: 1rem;
    margin-bottom: 1.2rem
}

.founder .link-arrow {
    margin-top: .5rem
}

@media(max-width:780px) {
    .founder {
        grid-template-columns: 1fr
    }

    .founder__img {
        max-height: 360px
    }
}
</style>
