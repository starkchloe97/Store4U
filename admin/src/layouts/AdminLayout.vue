<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Store } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const signingOut = ref(false)
const pageTitle = computed(() => route.meta.title || 'Dashboard')
const navigation = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Products', to: '/products', icon: Package },
  { label: 'Orders', to: '/orders', icon: ShoppingCart },
]

async function signOut() {
  if (signingOut.value) return
  signingOut.value = true
  try {
    await auth.logout()
  } finally {
    signingOut.value = false
    await router.replace('/login')
  }
}
</script>

<template>
  <div class="admin-shell">
    <aside class="sidebar">
      <RouterLink to="/" class="brand"><span class="brand-mark"><Store :size="20" /></span><span>Store<span class="brand-accent">4U</span><small>COMMERCE ADMIN</small></span></RouterLink>
      <p class="nav-label">WORKSPACE</p>
      <nav class="side-nav">
        <RouterLink v-for="item in navigation" :key="item.to" :to="item.to" class="nav-item" :class="{ active: route.path === item.to }">
          <component :is="item.icon" :size="18" /><span>{{ item.label }}</span>
        </RouterLink>
      </nav>
      <div class="sidebar-bottom">
        <p class="nav-label">PREFERENCES</p>
        <button class="nav-item" type="button" disabled><Settings :size="18" /><span>Settings</span><small>Later</small></button>
        <div class="profile"><div class="avatar">{{ (auth.user?.name || 'A').slice(0, 1).toUpperCase() }}</div><div class="profile-copy"><strong>{{ auth.user?.name || 'Store Admin' }}</strong><span>{{ auth.user?.email || 'Administrator' }}</span></div><button class="icon-button" aria-label="Sign out" :disabled="signingOut" @click="signOut"><LogOut :size="16" /></button></div>
      </div>
    </aside>
    <main class="main-area">
      <header class="topbar"><div class="mobile-brand"><Store :size="19" /> Store4U</div><div class="breadcrumb">Store management <span>/</span> <strong>{{ pageTitle }}</strong></div><div class="top-actions"><span class="top-avatar">{{ (auth.user?.name || 'A').slice(0, 1).toUpperCase() }}</span></div></header>
      <section class="page-content"><RouterView /></section>
      <footer class="footer">Store4U Admin <span>·</span> Connected to Laravel</footer>
    </main>
  </div>
</template>
