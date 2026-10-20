<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { PRODUCTS, countIn, firstIn, subcategories, categoryUrl, productImageUrl, CATEGORY_CARDS } from '@/utils/catalog.js';
const subs = computed(() => subcategories().filter(category => countIn(category)));
const extras = computed(() => CATEGORY_CARDS.map(category => category.name).filter(category => !subs.value.includes(category) && category !== 'Kitchen' && countIn(category)));
const products = computed(() => [...subs.value.map(category => ({ label: category, product: firstIn(category)[0] })), ...extras.value.map(category => ({ label: category, product: firstIn(category)[0] }))]);
</script>
<template>
    <section v-reveal class="sec sec--tight rv">
        <div class="wrap">
            <div class="circles">
                <RouterLink to="/shop/" class="circle"><span class="circle__img circle__img--all">{{ PRODUCTS.length
                        }}<small>products</small></span><span class="circle__label">Shop all</span></RouterLink>
                <RouterLink v-for="item in products" :key="item.label" :to="categoryUrl(item.label)" class="circle">
                    <span class="circle__img"><img class="is-cutout" :src="productImageUrl(item.product, 0, 200)"
                            :alt="item.product.name" loading="lazy"></span><span class="circle__label">{{ item.label
                        }}</span></RouterLink>
            </div>
        </div>
    </section>
</template>
<style scoped>
.circles {
    display: flex;
    gap: clamp(1rem, 3vw, 2.25rem);
    justify-content: safe center;
    overflow-x: auto;
    scrollbar-width: none;
    padding: .5rem 0 .75rem
}

.circles::-webkit-scrollbar {
    display: none
}

.circle {
    flex: 0 0 auto;
    width: 116px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .65rem;
    text-align: center
}

.circle__img {
    width: 108px;
    height: 108px;
    border-radius: 50%;
    background: #fff;
    border: 1.5px solid var(--line);
    overflow: hidden;
    display: grid;
    place-items: center;
    transition: transform .3s cubic-bezier(.16, 1, .3, 1), box-shadow .3s, border-color .3s
}

.circle__img img {
    width: 100%;
    height: 100%;
    padding: 16%
}

.circle:hover .circle__img {
    transform: translateY(-5px);
    box-shadow: var(--sh-lg);
    border-color: var(--clay)
}

.circle__img--all {
    background: var(--ink);
    border-color: var(--ink);
    color: #fff;
    font-family: var(--serif);
    font-size: 1.7rem;
    font-weight: 700;
    line-height: 1;
    align-content: center;
    gap: .2rem
}

.circle__img--all small {
    font-family: var(--sans);
    font-size: .72rem;
    font-weight: 400;
    opacity: .8
}

.circle__label {
    font-size: .88rem;
    font-weight: 700;
    line-height: 1.3
}

.circle:hover .circle__label {
    color: var(--clay)
}

@media(prefers-reduced-motion:reduce) {
    .circle__img {
        transition: none
    }

    .circle:hover .circle__img {
        transform: none
    }
}
</style>
