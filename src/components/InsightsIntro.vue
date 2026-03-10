<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWindowWidth } from '@/composables/useWindowWidth'
const windowWidth = useWindowWidth()
const isMobile = computed(() => windowWidth.value < 640)
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
            <div class="flex gap-4" v-if="!isMobile">
                <div class="glass-panel px-6 py-4 rounded-2xl text-center">
                    <div class="text-3xl font-bold text-primary">{{ totalMovies ?? 0 }}</div>
                    <div class="text-xs text-slate-500 font-medium"> {{ t('insightsPage.totalMovies') }} </div>
                </div>
                <div class="glass-panel px-6 py-4 rounded-2xl text-center">
                    <div class="text-3xl font-bold text-primary">{{ totalWatchTime ?? '0m' }}</div>
                    <div class="text-xs text-slate-500 font-medium"> {{ t('insightsPage.totalWatchTime') }} </div>
                </div>
            </div>
        </section>
        <div class="flex flex-col gap-4 md:hidden" v-if="isMobile">
            <div class="glass-panel px-6 py-4 rounded-2xl text-center">
                <div class="text-4xl font-bold text-primary">{{ totalMovies ?? 0 }}</div>
                <div class="text-xs text-slate-500 font-medium"> {{ t('insightsPage.totalMovies') }} </div>
            </div>
            <div class="glass-panel px-6 py-4 rounded-2xl text-center">
                <div class="text-4xl font-bold text-primary">{{ totalWatchTime ?? '0m' }}</div>
                <div class="text-xs text-slate-500 font-medium"> {{ t('insightsPage.totalWatchTime') }} </div>
            </div>
        </div>
</template>