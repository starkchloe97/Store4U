<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import Breadcrumbs from '@/components/shared/Breadcrumbs.vue';
import ProductGrid from '@/components/catalog/ProductGrid.vue';
import TrustStrip from '@/components/catalog/TrustStrip.vue';
import { PRODUCTS, CATEGORIES, countIn, money, categoryUrl } from '@/utils/catalog.js';
const props = defineProps({ category: { type: String, default: 'All' }, pageInfo: { type: Object, default: () => ({}) } });
const route = useRoute();
const router = useRouter();
const sort = ref(route.query.sort || 'featured');
const priceMin = ref(route.query.min || '');
const priceMax = ref(route.query.max || '');
const inStock = ref(route.query.stock === '1');
const currentPage = ref(1);
const filtersOpen = ref(false);
const validCategories = computed(() => CATEGORIES.filter(category => category === 'All' || countIn(category) > 0));
const categoryName = computed(() => props.category || 'All');
const results = computed(() => {
  let result = PRODUCTS.filter(product => categoryName.value === 'All' || product.cat === categoryName.value || product.sub === categoryName.value);
  const min = priceMin.value === '' ? 0 : Math.max(0, Number(priceMin.value) || 0);
  const max = priceMax.value === '' ? Infinity : Math.max(0, Number(priceMax.value) || 0);
  result = result.filter(product => product.price >= min && product.price <= max);
  if (inStock.value) result = result.filter(product => product.stock > 0);
  if (sort.value === 'price-asc') result = result.slice().sort((a, b) => a.price - b.price);
  if (sort.value === 'price-desc') result = result.slice().sort((a, b) => b.price - a.price);
  return result;
});
const totalPages = computed(() => Math.max(1, Math.ceil(results.value.length / 24)));
const visibleProducts = computed(() => results.value.slice((currentPage.value - 1) * 24, currentPage.value * 24));
const countText = computed(() => results.value.length > 24 ? `${(currentPage.value - 1) * 24 + 1}–${Math.min(currentPage.value * 24, results.value.length)} of ${results.value.length} products` : `${results.value.length} product${results.value.length === 1 ? '' : 's'}`);
const categoryDescription = computed(() => categoryName.value === 'All'
  ? `${PRODUCTS.length} products across home organization and kitchen. Orders ship within one business day.`
  : `${countIn(categoryName.value)} products in our ${categoryName.value.toLowerCase()} range. Free US shipping on orders over $50.`);
watch(() => [props.category, route.query], () => {
  sort.value = route.query.sort || 'featured';
  priceMin.value = route.query.min || '';
  priceMax.value = route.query.max || '';
  inStock.value = route.query.stock === '1';
  currentPage.value = 1;
}, { deep: true });
function updateQuery() {
  const query = {};
  if (sort.value !== 'featured') query.sort = sort.value;
  if (priceMin.value !== '') query.min = String(priceMin.value);
  if (priceMax.value !== '') query.max = String(priceMax.value);
  if (inStock.value) query.stock = '1';
  currentPage.value = 1;
  router.replace({ path: route.path, query });
}
function clearFilters() { sort.value = 'featured'; priceMin.value = ''; priceMax.value = ''; inStock.value = false; currentPage.value = 1; router.replace({ path: route.path, query: {} }); }
function goToPage(page) { currentPage.value = Math.max(1, Math.min(totalPages.value, page)); }
</script>
<template>
  <main>
    <section class="phero"><div class="wrap"><Breadcrumbs :items="[{ label: categoryName === 'All' ? 'Shop' : 'Collections', to: categoryName === 'All' ? undefined : '/shop/' }, ...(categoryName === 'All' ? [] : [{ label: categoryName }])]" /><h1>{{ categoryName === 'All' ? 'All Products' : categoryName }}</h1><p>{{ categoryDescription }}</p></div></section>
    <section class="sec"><div class="wrap"><div class="shop-layout">
      <aside class="filter-panel" :class="{ open: filtersOpen }" aria-label="Product filters">
        <div class="filter-group"><h4>Category</h4><RouterLink v-for="category in validCategories" :key="category" class="filter-link" :class="{ 'is-on': category === categoryName }" :to="categoryUrl(category)">{{ category === 'All' ? 'All products' : category }}</RouterLink></div>
        <div class="filter-group"><h4>Price</h4><div class="price-inputs"><label class="sr" for="priceMin">Minimum price</label><input id="priceMin" v-model="priceMin" type="number" min="0" placeholder="Min" @change="updateQuery"><span aria-hidden="true">–</span><label class="sr" for="priceMax">Maximum price</label><input id="priceMax" v-model="priceMax" type="number" min="0" placeholder="Max" @change="updateQuery"></div></div>
        <div class="filter-group"><h4>Availability</h4><label class="availability"><input v-model="inStock" type="checkbox" @change="updateQuery"> In stock only</label></div>
        <button class="btn btn--ghost btn--sm btn--full clear" @click="clearFilters">Clear all filters</button>
      </aside>
      <div><div class="shop-head"><button class="btn btn--ghost btn--sm filter-toggle" :aria-expanded="filtersOpen" @click="filtersOpen = !filtersOpen"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 6h18M6 12h12M10 18h4"/></svg> Filters</button><span class="result-count" aria-live="polite">{{ countText }}</span><label class="sr" for="sortSelect">Sort by</label><select id="sortSelect" v-model="sort" class="sort-select" @change="updateQuery"><option value="featured">Featured</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option></select></div>
        <ProductGrid :products="visibleProducts"><template #empty-action><button class="btn btn--pri btn--sm" @click="clearFilters">Clear filters</button></template></ProductGrid>
        <nav v-if="totalPages > 1" class="pager" aria-label="Product pages"><button class="btn btn--ghost btn--sm" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">← Previous</button><button v-for="page in totalPages" :key="page" class="pager__n" :class="{ 'is-on': page === currentPage }" :aria-current="page === currentPage ? 'page' : undefined" @click="goToPage(page)">{{ page }}</button><button class="btn btn--ghost btn--sm" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">Next →</button></nav>
      </div>
    </div></div></section><TrustStrip />
  </main>
</template>
<style scoped>
.phero{background:var(--sand);border-bottom:1px solid var(--line);padding:clamp(2.5rem,5vw,4rem) 0}.phero h1{font-size:clamp(2.2rem,4.5vw,3.4rem);margin-bottom:.7rem}.phero p{color:var(--stone);max-width:62ch;font-size:1.02rem;margin:0}.shop-layout{display:grid;grid-template-columns:230px 1fr;gap:2.5rem;align-items:start}.filter-panel{position:sticky;top:96px;background:var(--white);border:1px solid var(--line);border-radius:var(--r);padding:1.4rem}.filter-group{border-bottom:1px solid var(--line);padding-bottom:1.1rem;margin-bottom:1.1rem}.filter-group:last-child{border-bottom:0;padding-bottom:0;margin-bottom:0}.filter-group h4{font-family:var(--sans);font-size:.72rem;font-weight:700;letter-spacing:.13em;text-transform:uppercase;color:var(--stone-lt);margin-bottom:.85rem}.filter-link{display:block;font-size:.88rem;padding:.32rem 0;color:var(--ink-2)}.filter-link:hover{color:var(--clay)}.filter-link.is-on{color:var(--ink);font-weight:600}.availability{display:flex;align-items:center;gap:.55rem;font-size:.86rem;color:var(--ink-2);cursor:pointer}.availability input{accent-color:var(--clay)}.price-inputs{display:flex;gap:.5rem;align-items:center}.price-inputs input{min-width:0;width:100%;padding:.5rem .7rem;border:1px solid var(--line-dk);border-radius:var(--r-sm);font-size:.82rem;background:var(--paper)}.price-inputs input:focus{outline:none;border-color:var(--ink)}.clear{margin-top:1rem}.shop-head{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1.75rem;flex-wrap:wrap}.result-count{font-size:.83rem;color:var(--stone);margin-right:auto}.sort-select{padding:.55rem .9rem;border:1px solid var(--line-dk);border-radius:var(--r-sm);background:var(--white);font-size:.82rem;cursor:pointer;transition:border-color .18s}.sort-select:focus{outline:none;border-color:var(--ink)}.filter-toggle{display:none}.pager{display:flex;flex-wrap:wrap;gap:.4rem;justify-content:center;align-items:center;margin-top:2.5rem}.pager__n{min-width:38px;height:38px;border-radius:var(--r-sm);border:1px solid var(--line-dk);font-size:.88rem;font-weight:600;color:var(--ink-2);background:var(--white)}.pager__n:hover{border-color:var(--ink)}.pager__n.is-on{background:var(--ink);color:#fff;border-color:var(--ink)}.pager .btn[disabled]{opacity:.4}
@media(max-width:940px){.shop-layout{grid-template-columns:1fr;gap:1.5rem}.filter-panel{position:static;display:none}.filter-panel.open{display:block}.filter-toggle{display:inline-flex}}
</style>
