<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useStorefront } from '@/composables/useStorefront.js';
import AnnouncementBar from '@/components/layout/AnnouncementBar.vue'; 
import { SITE_NAME } from '@/config/siteInfo.js';
import brand from '@/assets/images/brand.png';
const { state, cartCount } = useStorefront();
const route = useRoute();
const scrolled = ref(false);
const onScroll = () => { scrolled.value = window.scrollY > 12; };
const isActive = path => route.path === path || (path !== '/' && route.path.startsWith(path));
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
</script>
<template>
  <AnnouncementBar />
  <header class="hdr" :class="{ 'is-scrolled': scrolled }">
    <div class="wrap hdr__in">
      <RouterLink to="/" class="brand"  :aria-label="`${SITE_NAME} home`" @click="state.mobileMenuOpen = false">
        <img :src="brand"  :alt="`${SITE_NAME} logo`" class="brand__mark" />
      </RouterLink>
      <nav class="nav" :class="{ open: state.mobileMenuOpen }" aria-label="Main navigation">
        <RouterLink to="/shop/" :class="{ 'is-on': isActive('/shop/') }" @click="state.mobileMenuOpen = false">Shop All
        </RouterLink>
        <RouterLink to="/collections/home-organization/"
          :class="{ 'is-on': isActive('/collections/home-organization/') }" @click="state.mobileMenuOpen = false">Home
          Organization</RouterLink>
        <RouterLink to="/collections/kitchen/" :class="{ 'is-on': isActive('/collections/kitchen/') }"
          @click="state.mobileMenuOpen = false">Kitchen</RouterLink>
        <RouterLink to="/about/" :class="{ 'is-on': isActive('/about/') }" @click="state.mobileMenuOpen = false">About
        </RouterLink>
        <RouterLink to="/contact/" :class="{ 'is-on': isActive('/contact/') }" @click="state.mobileMenuOpen = false">
          Contact</RouterLink>
      </nav>
      <div class="hdr__act">
        <button class="icon-btn" aria-label="Search products" @click="state.searchOpen = true"><svg width="20"
            height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.35-4.35" />
          </svg></button>
        <button class="icon-btn" aria-label="Open shopping cart" @click="state.cartOpen = true"><svg width="20"
            height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"
            stroke-linejoin="round" aria-hidden="true">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg><span v-if="cartCount" class="cart-count">{{ cartCount }}</span></button>
        <button class="icon-btn burger" :aria-expanded="state.mobileMenuOpen" aria-label="Toggle navigation"
          @click="state.mobileMenuOpen = !state.mobileMenuOpen"><svg width="21" height="21" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg></button>
      </div>
    </div>
  </header>
</template>
<style scoped>
.hdr {
  position: sticky;
  top: 0;
  z-index: 60;
  background: rgba(251, 250, 247, .94);
  backdrop-filter: saturate(180%) blur(14px);
  border-bottom: 1px solid var(--line);
  transition: height .25s var(--ease-out), background .25s
}

.hdr__in {
  display: flex;
  align-items: center;
  gap: 2rem;
  height: 70px;
  transition: height .25s var(--ease-out)
}

.hdr.is-scrolled .hdr__in {
  height: 58px
}

.hdr.is-scrolled {
  box-shadow: 0 1px 0 var(--line), 0 6px 24px rgba(26, 26, 24, .05)
}

.brand {
  display: flex;
  align-items: center;
  gap: .6rem;
  flex-shrink: 0
}

.brand__mark {
  width: auto;
  height: 60px;
  transition: transform .4s var(--ease-spring), background .2s
}

.brand__mark svg {
  width: 24px;
  height: 24px
}

.brand__txt {
  font-family: var(--serif);
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -.01em;
  line-height: 1
}

.brand__txt small {
  font-size: .62em;
  font-weight: 700;
  letter-spacing: .04em;
  color: var(--stone);
  margin-left: .15em
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.9rem;
  margin-left: auto
}

.nav a {
  font-size: .885rem;
  font-weight: 500;
  color: var(--ink-2);
  position: relative;
  padding: .35rem 0;
  transition: color .18s
}

.nav a:hover {
  color: var(--clay)
}

.nav a::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1.5px;
  background: var(--clay);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .28s var(--ease-out)
}

.nav a:hover::after,
.nav a.is-on::after {
  transform: scaleX(1)
}

.nav a.is-on {
  color: var(--ink)
}

.hdr__act {
  display: flex;
  align-items: center;
  gap: .35rem;
  margin-left: .75rem
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  position: relative;
  transition: background .18s, transform .18s var(--ease-out), color .18s;
  color: var(--ink)
}

.icon-btn:hover {
  background: var(--sand)
}

.cart-count {
  position: absolute;
  top: 2px;
  right: 1px;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  background: var(--clay);
  color: #fff;
  font-size: .66rem;
  font-weight: 700;
  border-radius: var(--r-sm);
  display: grid;
  place-items: center;
  font-family: var(--sans)
}

.burger {
  display: none
}

@media(max-width:940px) {
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: var(--paper);
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 5.5rem 24px 2rem;
    border-bottom: 1px solid var(--line);
    box-shadow: var(--sh-xl);
    transform: translateY(-100%);
    opacity: 0;
    pointer-events: none;
    transition: transform .35s var(--ease-out), opacity .25s;
    max-height: 100vh;
    overflow-y: auto
  }

  .nav.open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto
  }

  .nav a {
    padding: 1rem 0;
    border-bottom: 1px solid var(--line);
    font-size: 1.05rem
  }

  .nav a::after {
    display: none
  }

  .burger {
    display: grid;
    margin-left: auto
  }

  .hdr__act {
    margin-left: 0
  }
}

@media(max-width:520px) {
  .brand__txt {
    font-size: 1.08rem
  }

  .hdr__in {
    gap: .75rem
  }
}
</style>
