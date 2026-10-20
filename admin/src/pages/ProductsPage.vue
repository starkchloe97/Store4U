<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Package, Plus, Search, SlidersHorizontal, Pencil, Trash2, X, RefreshCw } from 'lucide-vue-next'
import http from '../api/http'

const products = ref([])
const categories = ref([])
const search = ref('')
const categoryFilter = ref('')
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const success = ref('')
const modalOpen = ref(false)
const editingId = ref(null)
const form = reactive(blankProduct())
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const visibleCount = computed(() => products.value.length)

function blankProduct() {
  return { sku: '', asin: '', brand: '', name: '', short_description: '', category: '', subcategory: '', price: '0.00', stock: 0, image_ids: [], bullets: [], specs: {}, is_active: true }
}
function errorText(err) {
  const errors = err.response?.data?.errors
  if (errors) return Object.values(errors).flat().join(' ')
  return err.response?.data?.message || 'Request failed. Check the Laravel API and try again.'
}
async function loadProducts() {
  loading.value = true
  error.value = ''
  try {
    const params = { per_page: 100 }
    if (search.value.trim()) params.search = search.value.trim()
    if (categoryFilter.value) params.category = categoryFilter.value
    const { data } = await http.get('/admin/products', { params })
    products.value = data.data.data
    categories.value = data.categories || []
  } catch (err) {
    error.value = errorText(err)
  } finally {
    loading.value = false
  }
}
function openCreate() {
  editingId.value = null
  Object.assign(form, blankProduct())
  error.value = ''
  modalOpen.value = true
}
function openEdit(product) {
  editingId.value = product.id
  Object.assign(form, blankProduct(), {
    ...product,
    price: String(product.price ?? '0.00'),
    image_ids: product.image_ids || [],
    bullets: product.bullets || [],
    specs: product.specs || {},
  })
  error.value = ''
  modalOpen.value = true
}
async function saveProduct() {
  saving.value = true
  error.value = ''
  success.value = ''
  const payload = { ...form, price: Number(form.price), stock: Number(form.stock) }
  try {
    if (editingId.value) await http.put(`/admin/products/${editingId.value}`, payload)
    else await http.post('/admin/products', payload)
    modalOpen.value = false
    success.value = editingId.value ? 'Product updated successfully.' : 'Product created successfully.'
    await loadProducts()
  } catch (err) {
    error.value = errorText(err)
  } finally {
    saving.value = false
  }
}
async function deleteProduct(product) {
  if (!window.confirm(`Delete “${product.name}” from the catalog? This cannot be undone.`)) return
  error.value = ''
  success.value = ''
  try {
    await http.delete(`/admin/products/${product.id}`)
    success.value = 'Product deleted.'
    await loadProducts()
  } catch (err) {
    error.value = errorText(err)
  }
}
onMounted(loadProducts)
</script>

<template>
  <div class="page-heading">
    <div><p class="eyebrow">CATALOG</p><h1>Products</h1><p class="page-description">Manage your catalog, pricing, categories and stock.</p></div>
    <button class="primary-button" type="button" @click="openCreate"><Plus :size="17" /> Add product</button>
  </div>
  <div v-if="error && !modalOpen" class="api-error" role="alert">{{ error }}</div>
  <div v-if="success" class="api-success" role="status">{{ success }}</div>
  <section class="panel table-panel">
    <form class="table-toolbar" @submit.prevent="loadProducts">
      <div class="table-search"><Search :size="16" /><input v-model="search" placeholder="Search name, SKU, brand or ASIN" /></div>
      <label class="filter-select"><SlidersHorizontal :size="16" /><select v-model="categoryFilter" aria-label="Filter by category"><option value="">All categories</option><option v-for="category in categories" :key="category" :value="category">{{ category }}</option></select></label>
      <button class="secondary-button" type="submit" :disabled="loading"><RefreshCw :size="15" /> Search</button>
    </form>
    <div class="table-summary"><span>{{ loading ? 'Loading products…' : `${visibleCount} products shown` }}</span><span>Catalog data from Laravel</span></div>
    <div v-if="!loading && !products.length" class="empty-state compact"><span class="empty-icon"><Package :size="24" /></span><h3>{{ error ? 'Products could not be loaded' : 'No products found' }}</h3><p>{{ error ? 'Check your API connection, migrations and sign-in session.' : 'Try a different search, or add your first product.' }}</p></div>
    <div v-else class="table-scroll">
      <table class="admin-table">
        <thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th class="actions-heading">Actions</th></tr></thead>
        <tbody><tr v-for="product in products" :key="product.id">
          <td><strong>{{ product.name }}</strong><small class="cell-sub">{{ product.brand || 'No brand' }}</small></td>
          <td>{{ product.sku }}</td><td>{{ product.category || '—' }}</td><td>{{ money.format(Number(product.price || 0)) }}</td>
          <td><span :class="{ 'low-stock': Number(product.stock) <= 5 }">{{ product.stock }}</span></td>
          <td><span class="active-pill" :class="{ inactive: !product.is_active }">{{ product.is_active ? 'Active' : 'Draft' }}</span></td>
          <td class="row-actions"><button class="icon-action" type="button" title="Edit product" :aria-label="`Edit ${product.name}`" @click="openEdit(product)"><Pencil :size="15" /></button><button class="icon-action danger" type="button" title="Delete product" :aria-label="`Delete ${product.name}`" @click="deleteProduct(product)"><Trash2 :size="15" /></button></td>
        </tr></tbody>
      </table>
    </div>
  </section>

  <div v-if="modalOpen" class="modal-backdrop" @click.self="modalOpen = false">
    <section class="product-modal" role="dialog" aria-modal="true" :aria-label="editingId ? 'Edit product' : 'Add product'">
      <header class="modal-header"><div><p class="eyebrow">{{ editingId ? 'EDIT CATALOG ITEM' : 'NEW CATALOG ITEM' }}</p><h2>{{ editingId ? 'Edit product' : 'Add product' }}</h2></div><button class="icon-action" type="button" aria-label="Close" @click="modalOpen = false"><X :size="18" /></button></header>
      <form class="product-form" @submit.prevent="saveProduct">
        <label>Product name *<input v-model.trim="form.name" required maxlength="255" /></label>
        <div class="form-row"><label>SKU *<input v-model.trim="form.sku" required maxlength="80" /></label><label>Brand<input v-model.trim="form.brand" maxlength="120" /></label></div>
        <div class="form-row"><label>Category<input v-model.trim="form.category" maxlength="120" /></label><label>Subcategory<input v-model.trim="form.subcategory" maxlength="120" /></label></div>
        <div class="form-row"><label>Price (USD) *<input v-model="form.price" type="number" min="0" step="0.01" required /></label><label>Stock quantity *<input v-model="form.stock" type="number" min="0" step="1" required /></label></div>
        <label>ASIN<input v-model.trim="form.asin" maxlength="32" /></label>
        <label>Short description<textarea v-model.trim="form.short_description" rows="2" maxlength="1000" /></label>
        <label class="checkbox-field"><input v-model="form.is_active" type="checkbox" /> Product is active in the catalog</label>
        <p v-if="error" class="api-error" role="alert">{{ error }}</p>
        <footer class="modal-footer"><button class="secondary-button" type="button" :disabled="saving" @click="modalOpen = false">Cancel</button><button class="primary-button" type="submit" :disabled="saving">{{ saving ? 'Saving…' : (editingId ? 'Save changes' : 'Create product') }}</button></footer>
      </form>
    </section>
  </div>
</template>

<style scoped>
.api-error,.api-success{margin:0 0 14px;padding:11px 13px;border-radius:9px;font-size:13px}.api-error{background:#fef3f2;border:1px solid #fecdca;color:#b42318}.api-success{background:#ecfdf3;border:1px solid #abefc6;color:#027a48}.table-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.table-search{flex:1;min-width:230px}.table-search input{width:100%}.filter-select{display:flex;align-items:center;gap:8px;border:1px solid var(--border,#d0d5dd);border-radius:8px;padding:0 10px;min-height:38px;color:var(--text-muted,#667085)}.filter-select select{border:0;background:transparent;outline:none;padding:0 4px;color:var(--text,#101828);min-height:36px}.table-summary{display:flex;justify-content:space-between;gap:10px;padding:14px 18px;border-bottom:1px solid var(--border,#eaecf0);font-size:12px;color:var(--text-muted,#667085)}.table-scroll{overflow:auto}.admin-table{width:100%;border-collapse:collapse;min-width:760px;font-size:13px}.admin-table th,.admin-table td{padding:13px 16px;border-bottom:1px solid var(--border,#eaecf0);text-align:left;vertical-align:middle}.admin-table th{font-size:11px;color:var(--text-muted,#667085);font-weight:600;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap}.admin-table tbody tr:last-child td{border-bottom:0}.cell-sub{display:block;margin-top:4px;color:var(--text-muted,#667085);font-size:11px}.active-pill{display:inline-block;border-radius:99px;background:#ecfdf3;color:#027a48;padding:4px 8px;font-size:11px}.active-pill.inactive{background:#f2f4f7;color:#667085}.low-stock{color:#b54708;font-weight:700}.actions-heading{text-align:right!important}.row-actions{display:flex;justify-content:flex-end;gap:6px}.icon-action{display:inline-flex;align-items:center;justify-content:center;width:31px;height:31px;border:1px solid var(--border,#eaecf0);border-radius:7px;background:#fff;color:var(--text,#344054);cursor:pointer}.icon-action:hover{background:#f9fafb}.icon-action.danger{color:#b42318}.modal-backdrop{position:fixed;z-index:50;inset:0;background:rgba(16,24,40,.48);display:flex;align-items:center;justify-content:center;padding:20px}.product-modal{background:#fff;width:min(100%,620px);max-height:90vh;overflow:auto;border-radius:16px;box-shadow:0 24px 70px rgba(16,24,40,.22)}.modal-header{display:flex;justify-content:space-between;align-items:flex-start;padding:22px 24px;border-bottom:1px solid var(--border,#eaecf0)}.modal-header h2{font-size:21px;margin:5px 0 0}.product-form{padding:22px 24px;display:flex;flex-direction:column;gap:15px}.product-form label{display:flex;flex-direction:column;gap:7px;font-size:12px;font-weight:600;color:var(--text,#344054)}.product-form input:not([type=checkbox]),.product-form textarea{width:100%;padding:10px 11px;border:1px solid var(--border,#d0d5dd);border-radius:8px;font:inherit;font-weight:400;color:var(--text,#101828);outline-color:var(--accent,#3157d5)}.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}.product-form .checkbox-field{flex-direction:row;align-items:center;font-weight:500}.modal-footer{display:flex;justify-content:flex-end;gap:10px;padding-top:8px}.empty-state.compact{padding:40px 18px}.table-panel{overflow:hidden}
@media(max-width:600px){.form-row{grid-template-columns:1fr}.modal-backdrop{padding:10px}.product-form,.modal-header{padding:18px}}
</style>
