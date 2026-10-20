<script setup>
import Breadcrumbs from '@/components/shared/Breadcrumbs.vue';
defineProps({ title: { type: String, required: true }, description: { type: String, default: '' }, breadcrumbs: { type: Array, default: () => [] }, slim: { type: Boolean, default: false } });
</script>
<template>
    <section class="phero" :class="{ 'phero--slim': slim }">
        <div class="wrap">
            <Breadcrumbs :items="breadcrumbs" />
            <h1>{{ title }}</h1>
            <p v-if="description">{{ description }}</p>
        </div>
    </section>
</template>
<style scoped>
.phero {
    background: var(--sand);
    border-bottom: 1px solid var(--line);
    padding: clamp(2.5rem, 5vw, 4rem) 0
}

.phero--slim {
    padding: clamp(1.5rem, 3vw, 2.25rem) 0
}

.phero h1 {
    font-size: clamp(2.2rem, 4.5vw, 3.4rem);
    margin-bottom: .7rem
}

.phero p {
    color: var(--stone);
    max-width: 62ch;
    font-size: 1.02rem;
    margin: 0
}
</style>
