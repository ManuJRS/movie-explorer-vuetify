import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/Home.vue'
import LoginPage from '@/pages/LoginPage.vue'
import MoviesPage from '@/pages/MoviesPage.vue'
import ConfirmEmail from '@/pages/ConfirmEmail.vue'
import { useAuthStore } from '@/stores/auth'
import ForgotPasswordView from '@/pages/ForgotPasswordView.vue'
import UpdatePasswordView from '@/pages/UpdatePasswordView.vue'
import UserSettings from '@/pages/UserSettings.vue' 
import InfoPage from '@/pages/InfoPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/login', name: 'login', component: LoginPage },
    { path: '/movies', name: 'movies', component: MoviesPage, meta: { requiresAuth: true } },
    { path: '/confirm-email', name: 'confirm-email', component: ConfirmEmail },
    { path: '/forgot-password', name: 'forgot-password', component: ForgotPasswordView },
    { path: '/update-password', name: 'update-password', component: UpdatePasswordView },
    { path: '/user-settings', name: 'user-settings', component: UserSettings },
    { path: '/info', name: 'info', component: InfoPage },
  ],
})

// src/router/index.ts
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.name === 'update-password' || to.name === 'confirm-email') {
    if (!auth._sessionRestored) await auth.init()
    return true
  }

  if (!auth._sessionRestored) {
    await auth.init()
  }

  if (to.meta.requiresAuth && !auth.user) {
    return { name: 'login' }
  }

  if (to.name === 'login' && auth.user) {
    return { name: 'movies' }
  }

  if (to.name === 'home' && auth.user) {
    return { name: 'movies' }
  }

  if (to.name === 'forgot-password' && auth.user) {
    return { name: 'movies' }
  }

  if (to.name === 'user-settings' && !auth.user) {
    return { name: 'login' }
  }

  if (to.name === 'info' && !auth.user) {
    return { name: 'login' }
  }

  return true
})
export default router