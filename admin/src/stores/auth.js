import { defineStore } from 'pinia'
import http, { prepareCsrfCookie } from '../api/http'

export const useAuthStore = defineStore('auth', {
  state: () => ({ user: null, checked: false }),
  actions: {
    async loadUser() {
      if (this.user) return this.user
      try {
        const response = await http.get('/admin/me')
        this.user = response.data.user
        this.checked = true
        return this.user
      } catch (error) {
        this.user = null
        this.checked = true
        throw error
      }
    },
    async login(credentials) {
      await prepareCsrfCookie()
      const response = await http.post('/admin/login', credentials)
      this.user = response.data.user
      this.checked = true
      return this.user
    },
    async logout() {
      try {
        await http.post('/admin/logout')
      } finally {
        this.user = null
        this.checked = true
      }
    },
  },
})
