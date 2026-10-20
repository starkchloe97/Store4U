<script setup>
import { Package, Plus, Search, SlidersHorizontal } from 'lucide-vue-next'
</script>
<template>
  <div class="page-heading"><div><p class="eyebrow">CATALOG</p><h1>Products</h1><p class="page-description">Manage your catalog, pricing, categories and stock.</p></div><button class="primary-button" type="button" disabled title="Available after API integration"><Plus :size="17" /> Add product</button></div>
  <section class="panel table-panel"><div class="table-toolbar"><div class="table-search"><Search :size="16" /><input placeholder="Search products" disabled /></div><button class="secondary-button" disabled><SlidersHorizontal :size="16" /> Filters</button></div><div class="empty-state compact"><span class="empty-icon"><Package :size="24" /></span><h3>Product catalog not connected</h3><p>Your current catalog lives in <code>frontend/src/data/catalog.js</code>. The next step is importing it into a database-backed Laravel products table so edits here can flow back to the storefront.</p></div></section>
</template>
