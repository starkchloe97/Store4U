<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue';
import { RouterView } from 'vue-router';
import SiteHeader from '@/components/layout/SiteHeader.vue';
import SiteFooter from '@/components/layout/SiteFooter.vue';
import MobileBottomNav from '@/components/layout/MobileBottomNav.vue';
import CartDrawer from '@/components/overlays/CartDrawer.vue';
import SearchDialog from '@/components/overlays/SearchDialog.vue';
import QuickViewDialog from '@/components/overlays/QuickViewDialog.vue';
import LightboxDialog from '@/components/overlays/LightboxDialog.vue';
import ToastMessage from '@/components/overlays/ToastMessage.vue';
import CookieConsent from '@/components/overlays/CookieConsent.vue';
import BackToTop from '@/components/shared/BackToTop.vue';
import { useStorefront } from '@/composables/useStorefront.js';

const { state } = useStorefront();
const activeOverlay = () => state.cartOpen || state.searchOpen || Boolean(state.quickViewId) || Boolean(state.lightbox);
const onKeydown = event => {
  if (event.key === 'Escape') {
    state.cartOpen = false;
    state.searchOpen = false;
    state.quickViewId = null;
    state.lightbox = null;
    state.mobileMenuOpen = false;
  }
};
watch(activeOverlay, open => {
  document.body.classList.toggle('no-scroll', open);
});
onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
  document.body.classList.remove('no-scroll');
});
</script>

<template>
  <div class="site-root">
    <SiteHeader />
    <RouterView v-slot="{ Component }">
      <Transition name="page-fade" mode="out-in">
        <component :is="Component" :key="$route.fullPath" />
      </Transition>
    </RouterView>
    <SiteFooter />
    <MobileBottomNav />
    <CartDrawer />
    <SearchDialog />
    <QuickViewDialog />
    <LightboxDialog />
    <ToastMessage />
    <CookieConsent />
    <BackToTop />
  </div>
</template>

<style scoped>
.site-root { min-height: 100vh; }
.page-fade-enter-active, .page-fade-leave-active { transition: opacity .15s ease; }
.page-fade-enter-from, .page-fade-leave-to { opacity: 0; }
@media (prefers-reduced-motion: reduce) {
  .page-fade-enter-active, .page-fade-leave-active { transition: none; }
}
</style>
