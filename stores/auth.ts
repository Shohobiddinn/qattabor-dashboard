import { defineStore } from 'pinia'
import type { AuthType } from '~/types'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useCookie('user').value && typeof useCookie('user').value === 'string' 
      ? JSON.parse(String(useCookie('user').value)) 
      : null,
    access_token: useCookie('access_token') || ''
  }),
  actions: {
    setUser(user: AuthType) {
      this.user = user
      useCookie('user').value = JSON.stringify(user) || '';
      useCookie('access_token').value = user?.access_token || '';
      useCookie('refresh_token').value = user?.refresh_token || '';
    },
    loadUser() {
      const userFromCookie = useCookie('user').value
      this.user = userFromCookie && typeof userFromCookie === 'string' 
        ? JSON.parse(String(userFromCookie)) 
        : null
    },
    removeUser() {
      this.user = null
      useCookie('user').value = undefined 
    }
  }
})
