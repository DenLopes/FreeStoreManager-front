import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from '../stores/authStore'
import axios from '@/services/axios'

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

router.beforeEach(async (to, from, next) => {
  await axios
    .get('/api/user')
    .then(() => {
      useAuthStore().isAuthenticated = true
    })
    .catch(() => {
      useAuthStore().isAuthenticated = false
    })
  if (to.meta.requireAuth && !useAuthStore().isAuthenticated) {
    return next({ name: 'Login' })
  }
  return next()
})

router.afterEach(() => {
  //After each route
})

export default router
