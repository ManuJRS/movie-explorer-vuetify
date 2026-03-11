<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { useWindowWidth } from '@/composables/useWindowWidth'
const windowWidth = useWindowWidth()
const isMobile = computed(() => windowWidth.value < 640)

function changeLanguage() {
    const next = locale.value === 'en' ? 'es' : 'en'
    locale.value = next
    localStorage.setItem('lang', next)
}

const isActive = (path: string) => {
  return route.path === path
}

type HeaderLink = {
  label: string
  href: string
}

interface Props {
  brand?: string
  links?: HeaderLink[]
  loginText?: string
  signInText?: string
  getStartedText?: string
}

const props = withDefaults(defineProps<Props>(), {
  brand: 'SYM',
  loginText: 'Login',
  signInText: 'Sign In',
  getStartedText: 'Get Started',
  links: () => [
    { label: 'nav.recommendations', href: '/recommendations' },
    { label: 'nav.statistics', href: '/stads' },
    { label: 'nav.watchList', href: '/watch-list' },
    { label: 'nav.settings', href: '/user-settings' },
    { label: 'nav.favorites', href: '/favorites' },
  ],
})

const open = ref(false)

const toggleMenu = () => {
  open.value = !open.value
}

const closeMenu = () => {
  open.value = false
}

watch(open, (isOpen) => {
  if (typeof document === 'undefined') return

  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})


async function logout() {
    await authStore.signOut()
    router.push('/login')
}
</script>

<template>
  <header
    class="py-2 sticky top-0 z-50 mx-auto w-full border border-black/10 dark:border-white/10 bg-white/95 shadow backdrop-blur-lg supports-[backdrop-filter]:bg-white/80 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/80"
  >
    <nav class="mx-auto flex items-center justify-between p-1.5">
      <!-- Brand -->
      <router-link
        to="/"
        class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 transition duration-100 hover:bg-black/5 dark:hover:bg-white/5"
      >
        <span class="material-symbols-outlined text-lg">movie</span>
        <p class="font-mono text-base font-bold">{{ brand }}</p>
      </router-link>

      <!-- Desktop links -->
      <div class="hidden items-center gap-1 lg:flex">
        <router-link
          v-if="user"
          v-for="link in links"
          :key="link.label"
          :to="link.href"
          class="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 [&.router-link-exact-active]:bg-primary/15 [&.router-link-exact-active]:text-primary [&.router-link-exact-active]:dark:bg-slate-500/20"
        >
          {{ t(link.label) }}
        </router-link>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">

        <button @click="changeLanguage" class="hover:text-gray-500 hover:scale-105 transition-all duration-300 py-2 text-sm rounded-lg hover:cursor-pointer text-white transition inline-flex items-center gap-2">
                    <span v-if="locale === 'en'">Eng</span>
                    <span v-else>Esp</span>
                    <span class="material-symbols-outlined  rounded-full">{{ t('nav.language') === 'en' ? 'language' : 'language' }}</span>
        </button>
        <div v-if="!isMobile">
            <button
            v-if="user"
            type="button"
            class=" hover:cursor-pointer inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-black/10 bg-white text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-slate-950 dark:hover:bg-white/5 px-4"
            @click="logout(); closeMenu();"
          >
            <span class="material-symbols-outlined text-lg">logout</span>
            {{ t('nav.signOut') }}
          </button>
        </div>
        <button
            v-if="!user"
            type="button"
            class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-4 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-slate-950 dark:hover:bg-white/5"
            @click="router.push('/login'); closeMenu();"
          >
            {{ t('nav.signIn') }}
          </button>
        <button
          v-if="user"
          type="button"
          @click="toggleMenu"
          class="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 bg-white text-slate-900 transition-colors hover:bg-black/5 lg:hidden dark:border-white/10 dark:bg-slate-950 dark:text-white dark:hover:bg-white/5"
          aria-label="Open menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="h-4 w-4"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </nav>
  </header>

  <!-- Mobile sheet -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        @click="closeMenu"
      />
    </Transition>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="-translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-if="open"
        class="fixed inset-y-0 left-0 z-[60] flex h-full w-3/4 max-w-sm flex-col border-r border-black/10 bg-white/95 shadow-lg backdrop-blur-lg dark:border-white/10 dark:bg-slate-950/95"
      >
        <!-- Close button -->
        <button
          type="button"
          @click="closeMenu"
          class="absolute top-5 right-5 rounded-full p-2 transition hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Close menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="h-4 w-4"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <!-- Links -->
        <div class="grid gap-y-2 overflow-y-auto px-4 pt-12 pb-5">
          <router-link
            v-for="link in links"
            :key="link.label"
            :to="link.href"
            class="inline-flex h-10 items-center justify-start rounded-md px-3 text-sm font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 [&.router-link-exact-active]:bg-primary/15 [&.router-link-exact-active]:text-primary [&.router-link-exact-active]:dark:dark:bg-slate-500/20"
            @click="closeMenu"
          >
            {{ t(link.label) }}
          </router-link>
        </div>

        <!-- Footer -->
        <div class="mt-auto flex flex-col gap-2 border-t border-black/10 bg-black/5 p-4 dark:border-white/10 dark:bg-white/5">
          <button
            v-if="user"
            type="button"
            class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-black/10 bg-white text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-slate-950 dark:hover:bg-white/5"
            @click="logout(); closeMenu();"
          >
            <span class="material-symbols-outlined text-lg">logout</span>
            {{ t('nav.signOut') }}
          </button>
          <button
            v-else
            type="button"
            class="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-4 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/10 dark:bg-slate-950 dark:hover:bg-white/5"
            @click="router.push('/login'); closeMenu();"
          >
            {{ signInText }}
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>