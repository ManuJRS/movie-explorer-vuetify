import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/Home.vue') },
    { path: '/login', name: 'login', component: () => import('@/pages/LoginPage.vue') },
    { path: '/movies', name: 'movies', component: () => import('@/pages/MoviesPage.vue'), meta: { requiresAuth: true } },
    { path: '/confirm-email', name: 'confirm-email', component: () => import('@/pages/ConfirmEmail.vue') },
    { path: '/forgot-password', name: 'forgot-password', component: () => import('@/pages/ForgotPasswordView.vue') },
    { path: '/update-password', name: 'update-password', component: () => import('@/pages/UpdatePasswordView.vue') },
    { path: '/user-settings', name: 'user-settings', component: () => import('@/pages/UserSettings.vue'), meta: { requiresAuth: true } },
    { path: '/info', name: 'info', component: () => import('@/pages/InfoPage.vue'), meta: { requiresAuth: true } },
    { path: '/recommendations', name: 'recommendations', component: () => import('@/pages/RecommendationsPage.vue'), meta: { requiresAuth: true } },
    { path: '/watch-list', name: 'watch-list', component: () => import('@/pages/WatchList.vue'), meta: { requiresAuth: true } },
    { path: '/favorites', name: 'favorites', component: () => import('@/pages/FavoritesPage.vue'), meta: { requiresAuth: true } },
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

  return true
})
export default router