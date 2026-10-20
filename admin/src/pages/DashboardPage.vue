<script setup>
import { Package, ShoppingBag, Users, CircleDollarSign, PlugZap, ArrowUpRight } from 'lucide-vue-next'
const cards = [
  { label: 'Gross sales', icon: CircleDollarSign, note: 'Awaiting API connection' },
  { label: 'Orders', icon: ShoppingBag, note: 'Order totals will appear here' },
  { label: 'Products', icon: Package, note: 'Catalog will load from Laravel' },
  { label: 'Customers', icon: Users, note: 'Customer metrics not connected' },
]
</script>

<template>
  <div class="page-heading"><div><p class="eyebrow">OVERVIEW</p><h1>Dashboard</h1><p class="page-description">A clear view of your store's performance and daily operations.</p></div><span class="date-pill">API connection pending</span></div>
  <div class="metric-grid"><article v-for="card in cards" :key="card.label" class="metric-card"><div class="metric-top"><span>{{ card.label }}</span><span class="metric-icon"><component :is="card.icon" :size="19" /></span></div><div class="metric-value">—</div><p class="metric-note">{{ card.note }}</p></article></div>
  <div class="dashboard-grid">
    <section class="panel"><div class="panel-heading"><div><h2>Store activity</h2><p>Recent orders and changes will appear here.</p></div><span class="panel-tag">Live data later</span></div><div class="empty-state"><span class="empty-icon"><PlugZap :size="24" /></span><h3>Connect your Laravel API</h3><p>This dashboard is ready for integration. It contains no sample figures that could be mistaken for real store data.</p><a href="https://github.com/starkchloe97/Store4U/tree/chore/admin-dashboard-foundation/backend" target="_blank" rel="noreferrer">View backend setup notes <ArrowUpRight :size="15" /></a></div></section>
    <section class="panel"><div class="panel-heading"><div><h2>Setup checklist</h2><p>Foundation progress</p></div></div><ul class="checklist"><li><span class="check-dot done">✓</span><div><strong>Admin app scaffold</strong><small>Vue, Vite, router and shared styles</small></div></li><li><span class="check-dot done">✓</span><div><strong>Admin navigation</strong><small>Dashboard, products and orders</small></div></li><li><span class="check-dot pending">3</span><div><strong>Laravel API</strong><small>Install framework and Sanctum</small></div></li><li><span class="check-dot pending">4</span><div><strong>Store data integration</strong><small>Products, orders and admin login</small></div></li></ul></section>
  </div>
</template>
