import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { useWindowWidth } from '@/composables/useWindowWidth'

const BODY_OVERFLOW_KEY = 'overflow'

export function useFloatingHeader() {
  const { t, locale } = useI18n()
  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)
  const router = useRouter()
  const route = useRoute()
  const windowWidth = useWindowWidth()

  const open = ref(false)
  const isMobile = computed(() => windowWidth.value < 640)

  function changeLanguage() {
    const next = locale.value === 'en' ? 'es' : 'en'
    locale.value = next
    localStorage.setItem('lang', next)
  }

  function isActive(path: string) {
    return route.path === path
  }

  function toggleMenu() {
    open.value = !open.value
  }

  function closeMenu() {
    open.value = false
  }

  async function logout() {
    await authStore.signOut()
    router.push('/login')
  }

  function goToLogin() {
    window.location.href = 'https://movie-collection-manu.netlify.app/login'
  }

  watch(open, (isOpen) => {
    if (typeof document === 'undefined') return
    document.body.style[BODY_OVERFLOW_KEY] = isOpen ? 'hidden' : ''
  })

  return {
    t,
    locale,
    user,
    open,
    isMobile,
    changeLanguage,
    isActive,
    toggleMenu,
    closeMenu,
    logout,
    goToLogin,
  }
}
