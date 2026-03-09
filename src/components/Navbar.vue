<script setup lang="ts">
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '../stores/theme'
const themeStore = useThemeStore()
import { useI18n } from 'vue-i18n'
const { isDark } = storeToRefs(themeStore)
const { t, locale } = useI18n()


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

                <button @click="changeLanguage" class="hover:text-gray-500 hover:scale-105 transition-all duration-300 py-2 text-sm rounded-lg hover:cursor-pointer text-white transition inline-flex items-center gap-2">
                    <span v-if="locale === 'en'">Eng</span>
                    <span v-else>Esp</span>
                    <span class="material-symbols-outlined  rounded-full">{{ t('nav.language') === 'en' ? 'language' : 'language' }}</span>
                </button>
            </div>
        </div>
    </nav>
</template>