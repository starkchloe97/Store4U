<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ShieldCheck, Store } from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const email = ref('')
const password = ref('')
const remember = ref(false)
const loading = ref(false)
const message = ref('')

async function submitLogin() {
  loading.value = true
  message.value = ''
  try {
    await auth.login({ email: email.value, password: password.value, remember: remember.value })
    await router.replace(typeof route.query.redirect === 'string' ? route.query.redirect : '/')
  } catch (error) {
    message.value = error.response?.data?.errors?.email?.[0]
      || error.response?.data?.message
      || 'Could not sign in. Check the API connection and your credentials.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-screen">
    <section class="login-card">
      <RouterLink to="/" class="brand"><span class="brand-mark"><Store :size="20" /></span><span>Store<span class="brand-accent">4U</span><small>COMMERCE ADMIN</small></span></RouterLink>
      <div class="login-icon"><ShieldCheck :size="23" /></div>
      <p class="eyebrow">ADMIN ACCESS</p>
      <h1>Welcome back</h1>
      <p class="page-description">Sign in to manage your store.</p>
      <form @submit.prevent="submitLogin">
        <label class="form-label">Email address<input v-model="email" type="email" autocomplete="username" placeholder="admin@example.com" required /></label>
        <label class="form-label">Password<input v-model="password" type="password" autocomplete="current-password" placeholder="Enter password" required /></label>
        <label class="remember-option"><input v-model="remember" type="checkbox" /> Keep me signed in</label>
        <button class="primary-button full-width" type="submit" :disabled="loading">{{ loading ? 'Signing in…' : 'Sign in' }}</button>
      </form>
      <p v-if="message" class="login-message error-message" role="alert">{{ message }}</p>
    </section>
  </main>
</template>

<style scoped>
.remember-option{display:flex;align-items:center;gap:8px;margin:0 0 18px;font-size:13px;color:var(--text-muted,#667085)}
.error-message{color:#b42318}
</style>
