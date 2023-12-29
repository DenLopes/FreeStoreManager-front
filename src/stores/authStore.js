import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { saveCookie } from '@/helpers/cookies'
import { useRouter } from 'vue-router'
import axios from '@/services/axios'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const router = useRouter()

  const login = (email, password) => {
    axios.get('/sanctum/csrf-cookie').then(() => {
      axios
        .post('/login', {
          email: email,
          password: password
        })
        .then((response) => {
          if (response.status === 200) {
            useAuthStore().isAuthenticated = true
            router.push({ name: 'Dashboard' })
          }
        })
    })
  }

  const logout = () => {
    axios.post('/logout').then((response) => {
      if (response.status === 200) {
        useAuthStore().isAuthenticated = false
        router.push({ name: 'Login' })
      }
    })
  }

  watch(isAuthenticated, (value) => {
    saveCookie('isAuthenticated', value, { days: 1 })
  })
  return {
    isAuthenticated,
    login,
    logout
  }
})
