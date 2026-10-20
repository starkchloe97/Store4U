<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useStorefront } from '@/composables/useStorefront.js';
const { state, saveCookiePreference } = useStorefront();
const visible = computed(() => state.cookiePreference === null);
</script>
<template>
    <aside v-if="visible" class="cookie" role="dialog" aria-label="Cookie consent">
        <h4>We use cookies</h4>
        <p>We use cookies to keep your cart working, remember your preferences, and understand how the site is used.
            Read our <RouterLink to="/policies/privacy/">Privacy Policy</RouterLink>.</p>
        <div class="cookie__actions"><button class="btn btn--ghost btn--sm"
                @click="saveCookiePreference('essential')">Essential only</button><button class="btn btn--pri btn--sm"
                @click="saveCookiePreference('all')">Accept all</button></div>
    </aside>
</template>
<style scoped>
.cookie {
    position: fixed;
    bottom: 1.5rem;
    left: 1.5rem;
    right: 1.5rem;
    max-width: 420px;
    background: var(--white);
    border: 1px solid var(--line);
    border-radius: var(--r-lg);
    padding: 1.35rem;
    box-shadow: var(--sh-xl);
    z-index: 70;
    animation: rise .5s var(--ease-spring)
}

.cookie h4 {
    font-size: 1rem;
    margin-bottom: .5rem
}

.cookie p {
    font-size: .82rem;
    color: var(--stone);
    margin-bottom: 1rem;
    line-height: 1.55
}

.cookie a {
    color: var(--clay);
    text-decoration: underline
}

.cookie__actions {
    display: flex;
    gap: .5rem
}

.cookie__actions .btn {
    flex: 1
}

@keyframes rise {
    from {
        transform: translateY(12px);
        opacity: 0
    }

    to {
        transform: none;
        opacity: 1
    }
}

@media(min-width:960px) {
    .cookie {
        left: auto;
        bottom: 1.5rem;
        right: 1.5rem
    }
}

@media(max-width:940px) {
    .cookie {
        bottom: 80px
    }
}
</style>
