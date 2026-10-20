<script setup>
import { RouterLink } from 'vue-router';
import PageHero from '@/components/shared/PageHero.vue';
</script>
<template>
  <main>
    <PageHero title="Page not found" description="The page you’re looking for may have moved or no longer exists." :breadcrumbs="[{ label: 'Page Not Found' }]" />
    <section class="sec"><div class="wrap not-found"><p>Let’s help you find what you need.</p><div><RouterLink class="btn btn--pri" to="/shop/">Browse the shop</RouterLink><RouterLink class="btn btn--ghost" to="/">Go to homepage</RouterLink></div></div></section>
  </main>
</template>
<style scoped>
.not-found{text-align:center;max-width:38rem}.not-found p{color:var(--stone);margin-bottom:1.5rem}.not-found div{display:flex;justify-content:center;gap:.75rem;flex-wrap:wrap}
</style>
