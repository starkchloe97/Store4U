<script setup>
import { useStorefront } from '@/composables/useStorefront.js';
const { state } = useStorefront();
</script>
<template>
    <div class="toast" :class="[{ on: state.toast.visible }, state.toast.type === 'success' ? 'toast--success' : '']"
        role="status" aria-live="polite"><span class="toast__ring" aria-hidden="true"></span>{{ state.toast.message }}
    </div>
</template>
<style scoped>
.toast {
    position: fixed;
    bottom: 26px;
    left: 50%;
    transform: translate(-50%, 140%);
    background: var(--ink);
    color: var(--paper);
    padding: .85rem 1.4rem;
    border-radius: var(--r-sm);
    font-size: .85rem;
    font-weight: 500;
    z-index: 120;
    transition: transform .4s var(--ease-spring);
    box-shadow: var(--sh-xl);
    white-space: nowrap;
    max-width: 90vw;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    gap: .6rem
}

.toast.on {
    transform: translate(-50%, 0)
}

.toast__ring {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, .35);
    border-top-color: var(--paper);
    animation: spin .8s linear infinite;
    position: relative
}

.toast--success .toast__ring {
    border-color: var(--ok);
    animation: none
}

.toast--success .toast__ring::after {
    content: '✓';
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: var(--ok);
    font-size: .7rem;
    font-weight: 700
}

@keyframes spin {
    to {
        transform: rotate(360deg)
    }
}
</style>
