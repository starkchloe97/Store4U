<script setup>
import { ShoppingCart, Search } from 'lucide-vue-next'
</script>
<template>
  <div class="page-heading"><div><p class="eyebrow">FULFILLMENT</p><h1>Orders</h1><p class="page-description">Review checkout submissions and manage order status.</p></div></div>
  <section class="panel table-panel"><div class="table-toolbar"><div class="table-search"><Search :size="16" /><input placeholder="Search by order number or customer" disabled /></div><span class="panel-tag">Read-only until connected</span></div><div class="empty-state compact"><span class="empty-icon"><ShoppingCart :size="24" /></span><h3>Order data not connected</h3><p>Existing orders are stored in <code>store_orders</code> and <code>store_order_items</code>. Laravel must read these tables (or a safely migrated equivalent) before this screen can display or update orders.</p></div></section>
</template>
