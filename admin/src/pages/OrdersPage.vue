<script setup>
import { onMounted, ref } from 'vue'
import { ShoppingCart, Search, RefreshCw, X, Eye } from 'lucide-vue-next'
import http from '../api/http'

const orders = ref([])
const statuses = ref(['pending_review', 'processing', 'shipped', 'completed', 'cancelled'])
const search = ref('')
const statusFilter = ref('')
const loading = ref(false)
const updatingId = ref(null)
const error = ref('')
const selectedOrder = ref(null)
const detailLoading = ref(false)
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' })

function errorText(err) {
  return err.response?.data?.message || 'Request failed. Check the Laravel API and try again.'
}
function label(value) {
  return String(value || 'unknown').replaceAll('_', ' ')
}
async function loadOrders() {
  loading.value = true
  error.value = ''
  try {
    const params = { per_page: 100 }
    if (search.value.trim()) params.search = search.value.trim()
    if (statusFilter.value) params.status = statusFilter.value
    const { data } = await http.get('/admin/orders', { params })
    orders.value = data.data.data
    statuses.value = data.statuses || statuses.value
  } catch (err) {
    error.value = errorText(err)
  } finally {
    loading.value = false
  }
}
async function changeStatus(order, status) {
  updatingId.value = order.id
  error.value = ''
  try {
    const { data } = await http.patch(`/admin/orders/${order.id}/status`, { status })
    const index = orders.value.findIndex(item => item.id === order.id)
    if (index !== -1) orders.value[index] = { ...orders.value[index], ...data.data }
    if (selectedOrder.value?.id === order.id) selectedOrder.value = data.data
  } catch (err) {
    error.value = errorText(err)
    await loadOrders()
  } finally {
    updatingId.value = null
  }
}
async function openDetails(order) {
  selectedOrder.value = null
  detailLoading.value = true
  try {
    const { data } = await http.get(`/admin/orders/${order.id}`)
    selectedOrder.value = data.data
  } catch (err) {
    error.value = errorText(err)
  } finally {
    detailLoading.value = false
  }
}
onMounted(loadOrders)
</script>

<template>
  <div class="page-heading"><div><p class="eyebrow">FULFILLMENT</p><h1>Orders</h1><p class="page-description">Review checkout submissions and update order progress.</p></div><button class="secondary-button" type="button" :disabled="loading" @click="loadOrders"><RefreshCw :size="16" /> Refresh</button></div>
  <div v-if="error" class="api-error" role="alert">{{ error }}</div>
  <section class="panel table-panel">
    <form class="table-toolbar" @submit.prevent="loadOrders">
      <div class="table-search"><Search :size="16" /><input v-model="search" placeholder="Search order number or customer" /></div>
      <label class="filter-select"><span>Status</span><select v-model="statusFilter" aria-label="Filter by order status"><option value="">All statuses</option><option v-for="status in statuses" :key="status" :value="status">{{ label(status) }}</option></select></label>
      <button class="secondary-button" type="submit" :disabled="loading">Search</button>
    </form>
    <div class="table-summary"><span>{{ loading ? 'Loading orders…' : `${orders.length} orders shown` }}</span><span>Legacy storefront order records</span></div>
    <div v-if="!loading && !orders.length" class="empty-state compact"><span class="empty-icon"><ShoppingCart :size="24" /></span><h3>{{ error ? 'Orders could not be loaded' : 'No orders found' }}</h3><p>{{ error ? 'Check the API connection, database configuration and sign-in session.' : 'New storefront orders will appear here.' }}</p></div>
    <div v-else class="table-scroll">
      <table class="admin-table">
        <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th></th></tr></thead>
        <tbody><tr v-for="order in orders" :key="order.id">
          <td><strong>#{{ order.order_number }}</strong></td>
          <td><strong>{{ order.first_name }} {{ order.last_name }}</strong><small class="cell-sub">{{ order.email }}</small></td>
          <td>{{ dateFormat.format(new Date(order.created_at)) }}</td><td>{{ order.items_count ?? '—' }}</td><td>{{ money.format(Number(order.total || 0)) }}</td>
          <td><span class="payment-pill">{{ label(order.payment_status) }}</span></td>
          <td><select class="status-select" :value="order.status" :disabled="updatingId === order.id" :aria-label="`Status for order ${order.order_number}`" @change="changeStatus(order, $event.target.value)"><option v-if="!statuses.includes(order.status)" :value="order.status">{{ label(order.status) }}</option><option v-for="status in statuses" :key="status" :value="status">{{ label(status) }}</option></select></td>
          <td><button class="icon-action" type="button" :aria-label="`View order ${order.order_number}`" title="View order details" @click="openDetails(order)"><Eye :size="16" /></button></td>
        </tr></tbody>
      </table>
    </div>
  </section>

  <div v-if="detailLoading || selectedOrder" class="modal-backdrop" @click.self="selectedOrder = null">
    <section class="order-modal" role="dialog" aria-modal="true" aria-label="Order details">
      <header class="modal-header"><div><p class="eyebrow">ORDER DETAILS</p><h2>{{ selectedOrder ? `Order #${selectedOrder.order_number}` : 'Loading order…' }}</h2></div><button class="icon-action" type="button" aria-label="Close" @click="selectedOrder = null"><X :size="18" /></button></header>
      <div v-if="detailLoading" class="detail-loading">Loading order details…</div>
      <div v-else-if="selectedOrder" class="order-detail-content">
        <div class="detail-grid"><div><span>Customer</span><strong>{{ selectedOrder.first_name }} {{ selectedOrder.last_name }}</strong><small>{{ selectedOrder.email }}</small><small>{{ selectedOrder.phone }}</small></div><div><span>Order status</span><strong class="capitalize">{{ label(selectedOrder.status) }}</strong><small>{{ selectedOrder.payment_method }} · {{ label(selectedOrder.payment_status) }}</small></div><div><span>Shipping address</span><strong>{{ selectedOrder.street_address }}</strong><small v-if="selectedOrder.address_line2">{{ selectedOrder.address_line2 }}</small><small>{{ selectedOrder.city }}, {{ selectedOrder.state }} {{ selectedOrder.postal_code }}</small></div><div><span>Shipping method</span><strong class="capitalize">{{ label(selectedOrder.shipping_method) }}</strong><small>{{ dateFormat.format(new Date(selectedOrder.created_at)) }}</small></div></div>
        <h3>Items</h3><div class="detail-items"><div v-for="item in selectedOrder.items" :key="item.id" class="detail-item"><div><strong>{{ item.product_name }}</strong><small>{{ item.sku }} · Qty {{ item.quantity }}</small></div><strong>{{ money.format(Number(item.line_total || 0)) }}</strong></div></div>
        <div class="totals"><div><span>Subtotal</span><strong>{{ money.format(Number(selectedOrder.subtotal || 0)) }}</strong></div><div><span>Shipping</span><strong>{{ money.format(Number(selectedOrder.shipping_cost || 0)) }}</strong></div><div class="grand-total"><span>Total</span><strong>{{ money.format(Number(selectedOrder.total || 0)) }}</strong></div></div>
        <p v-if="selectedOrder.notes" class="order-notes"><strong>Customer notes:</strong> {{ selectedOrder.notes }}</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.api-error{margin:0 0 14px;padding:11px 13px;border-radius:9px;background:#fef3f2;border:1px solid #fecdca;color:#b42318;font-size:13px}.table-toolbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.table-search{flex:1;min-width:230px}.table-search input{width:100%}.filter-select{display:flex;align-items:center;gap:8px;border:1px solid var(--border,#d0d5dd);border-radius:8px;padding:0 10px;min-height:38px;font-size:12px;color:var(--text-muted,#667085)}.filter-select select{border:0;background:transparent;outline:none;padding:0 4px;color:var(--text,#101828);min-height:36px}.table-summary{display:flex;justify-content:space-between;gap:10px;padding:14px 18px;border-bottom:1px solid var(--border,#eaecf0);font-size:12px;color:var(--text-muted,#667085)}.table-scroll{overflow:auto}.admin-table{width:100%;border-collapse:collapse;min-width:1020px;font-size:12px}.admin-table th,.admin-table td{padding:12px 13px;border-bottom:1px solid var(--border,#eaecf0);text-align:left;vertical-align:middle}.admin-table th{font-size:10px;color:var(--text-muted,#667085);font-weight:600;text-transform:uppercase;letter-spacing:.04em;white-space:nowrap}.admin-table tbody tr:last-child td{border-bottom:0}.cell-sub{display:block;margin-top:4px;color:var(--text-muted,#667085);font-size:11px}.payment-pill{display:inline-block;background:#f2f4f7;color:#475467;border-radius:99px;padding:4px 7px;font-size:10px;white-space:nowrap;text-transform:capitalize}.status-select{max-width:140px;padding:7px 8px;border:1px solid var(--border,#d0d5dd);border-radius:7px;background:#fff;color:var(--text,#344054);font-size:11px;text-transform:capitalize}.icon-action{display:inline-flex;align-items:center;justify-content:center;width:31px;height:31px;border:1px solid var(--border,#eaecf0);border-radius:7px;background:#fff;color:var(--text,#344054);cursor:pointer}.modal-backdrop{position:fixed;z-index:50;inset:0;background:rgba(16,24,40,.48);display:flex;align-items:center;justify-content:center;padding:20px}.order-modal{background:#fff;width:min(100%,700px);max-height:90vh;overflow:auto;border-radius:16px;box-shadow:0 24px 70px rgba(16,24,40,.22)}.modal-header{display:flex;justify-content:space-between;align-items:flex-start;padding:22px 24px;border-bottom:1px solid var(--border,#eaecf0)}.modal-header h2{font-size:21px;margin:5px 0 0}.order-detail-content{padding:22px 24px}.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;padding-bottom:22px;border-bottom:1px solid var(--border,#eaecf0)}.detail-grid>div{display:flex;flex-direction:column;gap:5px}.detail-grid span,.totals span{font-size:11px;color:var(--text-muted,#667085)}.detail-grid strong{font-size:13px}.detail-grid small,.detail-item small{font-size:11px;color:var(--text-muted,#667085)}.capitalize{text-transform:capitalize}.order-detail-content h3{font-size:14px;margin:22px 0 10px}.detail-items{border-top:1px solid var(--border,#eaecf0)}.detail-item{display:flex;justify-content:space-between;gap:15px;padding:12px 0;border-bottom:1px solid var(--border,#eaecf0);font-size:12px}.detail-item>div{display:flex;flex-direction:column;gap:4px}.totals{margin:18px 0 0 auto;width:min(100%,260px);display:flex;flex-direction:column;gap:10px}.totals>div{display:flex;justify-content:space-between;gap:15px;font-size:12px}.totals .grand-total{padding-top:12px;border-top:1px solid var(--border,#eaecf0);font-size:15px}.order-notes{font-size:12px;line-height:1.6;background:#f9fafb;padding:12px;border-radius:8px}.detail-loading{padding:50px;text-align:center;color:var(--text-muted,#667085);font-size:13px}
@media(max-width:600px){.detail-grid{grid-template-columns:1fr}.modal-backdrop{padding:10px}.order-detail-content,.modal-header{padding:18px}}
</style>
