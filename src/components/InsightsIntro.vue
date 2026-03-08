<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps<{
  totalMovies?: number
  totalWatchTime?: string
}>()
</script>

<template>
        <section
            class="flex flex-col md:flex-row md:items-end justify-between gap-6 glass p-8 rounded-xl top-28 border border-black/10 dark:border-white/10">
            <div class="space-y-2">
                <div class="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs">
                    <span class="material-symbols-outlined text-sm">analytics</span>
                    {{ t('insightsPage.tag') }}
                </div>
                <h1 class="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">{{ t('insightsPage.title') }}</h1>
                <p class="text-slate-500 dark:text-slate-400 max-w-xl">{{ t('insightsPage.description') }}</p>
            </div>
            <div class="flex gap-4">
                <div class="glass-panel px-6 py-4 rounded-2xl text-center">
                    <div class="text-2xl font-bold text-primary">{{ totalMovies ?? 0 }}</div>
                    <div class="text-xs text-slate-500 font-medium"> {{ t('insightsPage.totalMovies') }} </div>
                </div>
                <div class="glass-panel px-6 py-4 rounded-2xl text-center">
                    <div class="text-2xl font-bold text-primary">{{ totalWatchTime ?? '0m' }}</div>
                    <div class="text-xs text-slate-500 font-medium"> {{ t('insightsPage.totalWatchTime') }} </div>
                </div>
            </div>
        </section>
</template>