<script setup lang="ts">
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
const themeStore = useThemeStore()
import { useI18n } from 'vue-i18n'
const { isDark } = storeToRefs(themeStore)
import InteractiveHoverButton from '@/components/InteractiveHoverButton.vue'
const { t, locale } = useI18n()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const router = useRouter()

function changeLanguage() {
    const next = locale.value === 'en' ? 'es' : 'en'
    locale.value = next
    localStorage.setItem('lang', next)
}

watch(isDark, (value) => {
    if (value) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
}, { immediate: true })

function toggleTheme() {
    isDark.value = !isDark.value
}

async function logout() {
    await authStore.signOut()
    router.push('/login')
}

</script>

<template>
    <nav class="fixed top-0 z-50 w-full glass border-b border-black/10 dark:border-white/10 px-6 py-2 h-16">
        <div class="max-w-7xl mx-auto flex items-center justify-between">

            <div class="flex items-center gap-3">
                <router-link to="/" class="...">
                    <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    SYM
                    </h1>
                </router-link>
            </div>

            <div class="flex items-center gap-2 h-[50px]">
                <button
                    v-if="user"
                        @click="logout"
                        class="py-2 text-sm rounded-lg hover:cursor-pointer text-white transition"
                >
                    <span class="material-symbols-outlined hover:text-red-500 rounded-full p-2">logout</span>
                </button>

                <button @click="changeLanguage" class="hover:text-gray-500 hover:scale-105 transition-all duration-300 py-2 text-sm rounded-lg hover:cursor-pointer text-white transition inline-flex items-center gap-2">
                    <span v-if="locale === 'en'">Eng</span>
                    <span v-else>Esp</span>
                    <span class="material-symbols-outlined  rounded-full">{{ t('nav.language') === 'en' ? 'language' : 'language' }}</span>
                </button>
                <router-link v-if="!user" to="/login">
                    <InteractiveHoverButton class="w-full sm:w-auto hover:cursor-pointer bg-black/70 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2" :text="t('nav.sigIn')" variant="login" />
                </router-link>
            </div>
        </div>
    </nav>
</template>