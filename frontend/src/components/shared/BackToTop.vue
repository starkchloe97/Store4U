<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
const visible = ref(false);
const update = () => { visible.value = window.scrollY > 500; };
const toTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
onMounted(() => window.addEventListener('scroll', update, { passive: true }));
onBeforeUnmount(() => window.removeEventListener('scroll', update));
</script>
<template><button class="totop" :class="{ on: visible }" aria-label="Back to top" :tabindex="visible ? 0 : -1" @click="toTop"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m18 15-6-6-6 6"/></svg></button></template>
<style scoped>
.totop{position:fixed;bottom:1.5rem;right:1.5rem;width:46px;height:46px;border-radius:50%;background:var(--ink);color:var(--paper);display:grid;place-items:center;box-shadow:var(--sh-xl);z-index:52;opacity:0;transform:translateY(20px);pointer-events:none;transition:opacity .3s,transform .35s var(--ease-out),background .18s}.totop.on{opacity:1;transform:none;pointer-events:auto}.totop:hover{background:var(--clay)}@media(max-width:940px){.totop{bottom:80px;right:1rem;width:42px;height:42px}}
</style>
