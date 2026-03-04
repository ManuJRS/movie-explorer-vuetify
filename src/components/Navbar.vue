<script setup>
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '../stores/theme';

const themeStore = useThemeStore();
const { isDark } = storeToRefs(themeStore);

watch(isDark, (value) => {
    if (value) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}, { immediate: true });

function toggleTheme() {
    isDark.value = !isDark.value;
}
</script>

<template>
    <nav class="fixed top-0 z-50 w-full glass border-b border-black/10 dark:border-white/10 px-6 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
            <div class="flex items-center gap-3">
                <h1 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Guarda tus peliculas</h1>
            </div>

            <div class="flex items-center gap-4">
                <button
                    type="button"
                    @click="toggleTheme"
                    class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200 dark:bg-white/5 border border-white/10 hover:bg-slate-300 dark:hover:bg-white/10 transition-all text-slate-900 dark:text-white"
                    :aria-label="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
                >
                    <span class="material-symbols-outlined text-sm">{{ isDark ? 'dark_mode' : 'light_mode' }}</span>
                    <span class="text-xs font-semibold">{{ isDark ? 'Dark' : 'Light' }}</span>
                </button>
            </div>
        </div>
    </nav>
</template>
