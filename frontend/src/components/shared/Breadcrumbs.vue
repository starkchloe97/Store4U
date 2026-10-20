<script setup>
import { RouterLink } from 'vue-router';
defineProps({ items: { type: Array, default: () => [] } });
</script>
<template>
  <nav class="crumbs" aria-label="Breadcrumb">
    <RouterLink to="/">Home</RouterLink>
    <template v-for="item in items" :key="item.label">
      <span aria-hidden="true">/</span>
      <RouterLink v-if="item.to" :to="item.to">{{ item.label }}</RouterLink>
      <span v-else aria-current="page">{{ item.label }}</span>
    </template>
  </nav>
</template>
<style scoped>
.crumbs{display:flex;align-items:center;flex-wrap:wrap;gap:.55rem;font-size:.78rem;color:var(--stone);margin-bottom:1.5rem}
.crumbs a:hover{color:var(--clay)}.crumbs span[aria-current=page]{color:var(--ink)}
</style>
