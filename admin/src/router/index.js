import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AdminLayout from '../layouts/AdminLayout.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import ProductsPage from '../pages/ProductsPage.vue'
import OrdersPage from '../pages/OrdersPage.vue'
import LoginPage from '../pages/LoginPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/login', name: 'login', component: LoginPage, meta: { title: 'Sign in' } },
    {
      path: '/',
      component: AdminLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'dashboard', component: DashboardPage, meta: { title: 'Dashboard' } },
        { path: 'products', name: 'products', component: ProductsPage, meta: { title: 'Products' } },
        { path: 'orders', name: 'orders', component: OrdersPage, meta: { title: 'Orders' } },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth) {
    try {
      await auth.loadUser()
    } catch {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
  }

  if (to.name === 'login') {
    try {
      await auth.loadUser()
      return { name: 'dashboard' }
    } catch {
      // No active session; show the login page.
    }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | Store4U Admin` : 'Store4U Admin'
})

export default router
