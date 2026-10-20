<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  runs: { type: Array, default: () => [] }
});
</script>

<template>
  <template v-for="(run, index) in runs" :key="`${index}-${run.text || 'break'}`">
    <br v-if="run.break" />
    <RouterLink v-else-if="run.to" :to="run.to">{{ run.text }}</RouterLink>
    <a v-else-if="run.href" :href="run.href">{{ run.text }}</a>
    <component :is="run.tag" v-else-if="run.tag">{{ run.text }}</component>
    <template v-else>{{ run.text }}</template>
  </template>
</template>

<style scoped>
/* Inline runs inherit typography and color from their parent content block. */
</style>
