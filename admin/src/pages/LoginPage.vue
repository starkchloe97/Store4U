<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Store, ShieldCheck } from 'lucide-vue-next'
const email = ref('')
const password = ref('')
const message = ref('Login is not enabled yet. Connect the Laravel Sanctum authentication endpoints first.')
</script>
<template>
  <main class="login-page"><section class="login-card">
    <RouterLink to="/" class="brand login-brand"><span class="brand-mark"><Store :size="20" /></span><span>Store<span class="brand-accent">4U</span><small>COMMERCE ADMIN</small></span></RouterLink>
    <div class="login-icon"><ShieldCheck :size="23" /></div><p class="eyebrow">ADMIN ACCESS</p><h1>Welcome back</h1><p class="page-description">Sign in to manage your store.</p>
    <form @submit.prevent="message = 'Authentication is not configured yet. No credentials were sent.'">
      <label class="form-label">Email address<input v-model="email" type="email" autocomplete="username" placeholder="admin@example.com" required /></label>
      <label class="form-label">Password<input v-model="password" type="password" autocomplete="current-password" placeholder="Enter password" required /></label>
      <button class="primary-button full-width" type="submit">Sign in</button>
    </form>
    <p class="login-message">{{ message }}</p><RouterLink to="/" class="back-link">Back to dashboard preview</RouterLink>
  </section></main>
</template>
