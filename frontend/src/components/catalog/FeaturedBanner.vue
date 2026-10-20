<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { countIn, firstIn, productImageUrl } from '@/utils/catalog.js';
const products = computed(() => firstIn('Storage', 4));
</script>
<template>
    <section v-if="products.length" v-reveal class="sec rv">
        <div class="wrap">
            <div class="fcb">
                <div class="fcb__body">
                    <h2>Kitchen and food storage</h2>
                    <p>Food containers, bag holders, wraps and pantry racks. {{ countIn('Storage') }} storage products,
                        with free US shipping on orders over $50.</p>
                    <div class="fcb__actions">
                        <RouterLink to="/collections/storage/" class="btn btn--light">Shop storage</RouterLink>
                    </div>
                </div>
                <div class="fcb__art fcb__art--white">
                    <div class="collage"><img v-for="product in products" :key="product.id" class="is-cutout"
                            :src="productImageUrl(product, 0, 500)" :alt="product.name" loading="lazy"></div>
                </div>
            </div>
        </div>
    </section>
</template>
<style scoped>
.fcb {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 340px;
    border-radius: var(--r-lg);
    overflow: hidden;
    background: var(--ink);
    color: var(--paper)
}

.fcb__body {
    padding: clamp(2rem, 5vw, 4.5rem);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start
}

.fcb h2 {
    font-size: clamp(1.75rem, 3vw, 2.35rem);
    margin-bottom: .85rem
}

.fcb p {
    color: #C5C0B4;
    font-size: .98rem;
    max-width: 45ch;
    margin-bottom: 1.5rem
}

.fcb__actions {
    display: flex;
    gap: .7rem;
    flex-wrap: wrap
}

.fcb__art {
    position: relative;
    min-height: 250px;
    background: var(--sand)
}

.fcb__art--white {
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
    min-height: 0;
    object-fit: contain;
    background: #fff;
    padding: 8%
}

@media(max-width:760px) {
    .fcb {
        grid-template-columns: 1fr
    }

    .fcb__art {
        order: -1;
        max-height: 300px;
        aspect-ratio: 1.25
    }
}
</style>
