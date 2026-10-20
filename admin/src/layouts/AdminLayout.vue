<script setup>
import { computed } from 'vue'
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'
import { LayoutDashboard, Package, ShoppingCart, Settings, LogOut, Store } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const pageTitle = computed(() => route.meta.title || 'Dashboard')
const navigation = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Products', to: '/products', icon: Package },
  { label: 'Orders', to: '/orders', icon: ShoppingCart },
]
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
        <div class="profile"><div class="avatar">S</div><div class="profile-copy"><strong>Store Admin</strong><span>Administrator</span></div><button class="icon-button" aria-label="Sign out" @click="router.push('/login')"><LogOut :size="16" /></button></div>
      </div>
    </aside>
    <main class="main-area">
      <header class="topbar"><div class="mobile-brand"><Store :size="19" /> Store4U</div><div class="breadcrumb">Store management <span>/</span> <strong>{{ pageTitle }}</strong></div><div class="top-actions"><span class="top-avatar">S</span></div></header>
      <section class="page-content"><RouterView /></section>
      <footer class="footer">Store4U Admin <span>·</span> Foundation setup</footer>
    </main>
  </div>
</template>
