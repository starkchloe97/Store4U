<script setup>
import { onMounted, ref } from 'vue'
import { Package, ShoppingBag, CircleDollarSign, Clock3, AlertTriangle, RefreshCw } from 'lucide-vue-next'
import http from '../api/http'

const loading = ref(true)
const error = ref('')
const metrics = ref({ gross_sales: 0, orders: 0, pending_orders: 0, products: 0, low_stock: 0 })
const recentOrders = ref([])
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
const dateFormat = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })

const cards = [
  { key: 'gross_sales', label: 'Gross sales', icon: CircleDollarSign, format: value => money.format(Number(value || 0)), note: 'Total order value, excluding cancelled orders' },
  { key: 'orders', label: 'Total orders', icon: ShoppingBag, format: value => Number(value || 0).toLocaleString(), note: 'All orders recorded by the storefront' },
  { key: 'products', label: 'Products', icon: Package, format: value => Number(value || 0).toLocaleString(), note: 'Products in the admin catalog' },
  { key: 'pending_orders', label: 'Pending review', icon: Clock3, format: value => Number(value || 0).toLocaleString(), note: 'Orders that need attention' },
]

async function loadDashboard() {
  loading.value = true
  error.value = ''
  try {
    const { data } = await http.get('/admin/dashboard')
    metrics.value = data.metrics
    recentOrders.value = data.recent_orders
  } catch (err) {
    error.value = err.response?.data?.message || 'Could not load dashboard data. Check the Laravel API and database.'
  } finally {
    loading.value = false
  }
}

function statusLabel(status) {
  return String(status || 'unknown').replaceAll('_', ' ')
}

onMounted(loadDashboard)
</script>

<template>
  <div class="page-heading">
    <div><p class="eyebrow">OVERVIEW</p><h1>Dashboard</h1><p class="page-description">A clear view of your store's performance and daily operations.</p></div>
    <button class="secondary-button" type="button" :disabled="loading" @click="loadDashboard"><RefreshCw :size="16" /> Refresh</button>
  </div>

  <div v-if="error" class="api-error" role="alert">{{ error }}</div>
  <div class="metric-grid">
    <article v-for="card in cards" :key="card.key" class="metric-card">
      <div class="metric-top"><span>{{ card.label }}</span><span class="metric-icon"><component :is="card.icon" :size="19" /></span></div>
      <div class="metric-value">{{ loading ? '…' : card.format(metrics[card.key]) }}</div>
      <p class="metric-note">{{ card.note }}</p>
    </article>
  </div>

  <div class="dashboard-grid">
    <section class="panel table-panel">
      <div class="panel-heading"><div><h2>Recent orders</h2><p>The latest checkout activity from your store.</p></div><RouterLink to="/orders" class="text-link">View all</RouterLink></div>
      <div v-if="loading" class="table-message">Loading recent orders…</div>
      <div v-else-if="!recentOrders.length" class="table-message"><ShoppingBag :size="22" /><strong>No orders yet</strong><span>Orders will appear here when they exist in the store database.</span></div>
      <div v-else class="table-scroll">
        <table class="admin-table">
          <thead><tr><th>Order</th><th>Customer</th><th>Date</th><th>Status</th><th class="numeric">Total</th></tr></thead>
          <tbody><tr v-for="order in recentOrders" :key="order.id">
            <td><RouterLink class="order-link" to="/orders">#{{ order.order_number }}</RouterLink></td>
            <td><strong>{{ order.first_name }} {{ order.last_name }}</strong><small class="cell-sub">{{ order.email }}</small></td>
            <td>{{ dateFormat.format(new Date(order.created_at)) }}</td>
            <td><span class="status-pill" :class="'status-' + order.status">{{ statusLabel(order.status) }}</span></td>
            <td class="numeric">{{ money.format(Number(order.total || 0)) }}</td>
          </tr></tbody>
        </table>
      </div>
    </section>

    <section class="panel health-panel">
      <div class="panel-heading"><div><h2>Inventory watch</h2><p>Items that may need restocking.</p></div><span class="metric-icon warning"><AlertTriangle :size="18" /></span></div>
      <div class="stock-stat"><span>Low-stock products</span><strong>{{ loading ? '…' : metrics.low_stock }}</strong></div>
      <p class="panel-hint">Low stock means 5 units or fewer. Update quantities from the Products page.</p>
      <RouterLink to="/products" class="text-link">Manage products <span aria-hidden="true">→</span></RouterLink>
    </section>
  </div>
</template>

<style scoped>
.api-error{margin:0 0 18px;padding:12px 14px;border:1px solid #fecdca;background:#fef3f2;color:#b42318;border-radius:10px;font-size:13px}
.table-scroll{overflow:auto}.admin-table{width:100%;border-collapse:collapse;min-width:600px;font-size:13px}.admin-table th,.admin-table td{padding:13px 16px;border-bottom:1px solid var(--border,#eaecf0);text-align:left;white-space:nowrap}.admin-table th{font-size:11px;color:var(--text-muted,#667085);font-weight:600;text-transform:uppercase;letter-spacing:.04em}.admin-table tbody tr:last-child td{border-bottom:0}.numeric{text-align:right!important}.cell-sub{display:block;margin-top:4px;color:var(--text-muted,#667085);font-size:11px}.order-link,.text-link{color:var(--accent,#3157d5);text-decoration:none;font-weight:600}.status-pill{display:inline-block;padding:4px 8px;border-radius:99px;background:#f2f4f7;color:#344054;font-size:11px;text-transform:capitalize}.status-pending_review{background:#fffaeb;color:#b54708}.status-processing{background:#eff8ff;color:#175cd3}.status-shipped{background:#eef4ff;color:#3538cd}.status-completed{background:#ecfdf3;color:#027a48}.status-cancelled{background:#fef3f2;color:#b42318}.table-message{min-height:160px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;color:var(--text-muted,#667085);font-size:13px;text-align:center;padding:24px}.table-message strong{color:var(--text,#101828)}.health-panel{align-self:start}.stock-stat{display:flex;align-items:center;justify-content:space-between;padding:18px 0 8px}.stock-stat strong{font-size:30px}.panel-hint{font-size:12px;line-height:1.6;color:var(--text-muted,#667085);margin:0 0 16px}.metric-icon.warning{color:#b54708;background:#fffaeb}
</style>
