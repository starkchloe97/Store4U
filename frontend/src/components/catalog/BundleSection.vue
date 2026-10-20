<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { subcategories, firstIn, money, productImageUrl } from '@/utils/catalog.js';
import { useStorefront } from '@/composables/useStorefront.js';
const { addToCart } = useStorefront();
const products = computed(() => subcategories().map(category => firstIn(category)[0]).filter(Boolean).slice(0, 3));
const total = computed(() => products.value.reduce((sum, product) => sum + product.price, 0));
function addBundle() { products.value.forEach(product => addToCart(product.id)); }
</script>
<template>
    <section v-reveal class="rv sec sec--sand">
        <div class="wrap">
            <div class="bundle">
                <div class="bundle__head">
                    <h2>Kitchen starter set</h2>
                    <p class="lede">One best seller from each kitchen category, added to your cart in one click.</p>
                </div>
                <div class="bundle__items"><template v-for="(product, index) in products" :key="product.id">
                        <div class="bundle__item">
                            <RouterLink :to="`/products/${product.id}/`" class="bundle__item-art"><img class="is-cutout"
                                    :src="productImageUrl(product, 0, 400)" :alt="product.name" loading="lazy">
                            </RouterLink>
                            <h4>{{ product.short }}</h4><span class="price">{{ money(product.price) }}</span>
                        </div><span v-if="index < products.length - 1" class="bundle__plus" aria-hidden="true">+</span>
                    </template>
                </div>
                <div class="bundle__foot">
                    <div class="bundle__total"><span>Total for all three</span><strong>{{ money(total) }}</strong></div>
                    <button class="btn btn--pri" @click="addBundle">Add all three to cart</button>
                </div>
            </div>
        </div>
    </section>
</template>
<style scoped>
.bundle {
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: clamp(1.5rem, 4vw, 2.75rem)
}

.bundle__head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 1.8rem
}

.bundle__head h2 {
    margin: 0
}

.bundle__head .lede {
    margin: 0;
    max-width: 44ch;
    font-size: .95rem
}

.bundle__items {
    display: grid;
    grid-template-columns: 1fr 28px 1fr 28px 1fr;
    align-items: center;
    gap: .8rem
}

.bundle__item {
    text-align: center;
    min-width: 0
}

.bundle__item-art {
    display: block;
    aspect-ratio: 1;
    background: var(--sand);
    border-radius: var(--r);
    overflow: hidden;
    margin-bottom: .8rem
}

.bundle__item-art img {
    width: 100%;
    height: 100%;
    object-fit: contain
}

.bundle__item h4 {
    font-family: var(--sans);
    font-size: .9rem;
    font-weight: 600;
    line-height: 1.4;
    margin-bottom: .35rem
}

.bundle__plus {
    font-family: var(--serif);
    font-size: 1.6rem;
    color: var(--stone-lt);
    text-align: center
}

.bundle__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1.8rem;
    padding-top: 1.4rem;
    border-top: 1px solid var(--line)
}

.bundle__total>span {
    display: block;
    font-size: .85rem;
    color: var(--stone);
    margin-bottom: .25rem
}

.bundle__total strong {
    font-family: var(--serif);
    font-size: 1.6rem
}

@media(max-width:700px) {
    .bundle__head {
        display: block
    }

    .bundle__head .lede {
        margin-top: .7rem
    }

    .bundle__items {
        grid-template-columns: 1fr 18px 1fr 18px 1fr;
        gap: .25rem
    }

    .bundle__item h4 {
        font-size: .75rem
    }

    .bundle__plus {
        font-size: 1.1rem
    }

    .bundle__foot {
        align-items: flex-start;
        flex-direction: column
    }
}
</style>
