<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps<{
  genres?: { name: string; count: number; percentage: number }[]
}>()
</script>

<template>
        <section class="space-y-6 pt-8">
            <h3 class="text-xl font-bold flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">pie_chart</span>
                {{ t('insightsPage.GenresTitle') }}
            </h3>
            <div class="grid grid-cols-3 sm:grid-cols-3 gap-4">
                <div
                    v-for="genre in genres"
                    :key="genre.name"
                    class="glass p-4 rounded-2xl flex flex-col items-center text-center gap-3 hover:bg-primary/5 transition-colors"
                >
                    <div class="size-16 rounded-full overflow-hidden flex items-center justify-center">
                        <span class="material-symbols-outlined text-4xl text-primary">movie</span>
                    </div>
                    <div class="text-xs md:text-base font-bold">{{ genre.name }}</div>
                    <!-- <span class="text-xs font-bold leading-tight text-primary">{{ genre.percentage }}%</span> -->
                </div>
                <div v-if="!genres?.length" class="col-span-2 sm:col-span-3 text-slate-500 text-sm py-8 text-center">
                    No genres data yet. Add movies from TMDB search to see your favorite genres.
                </div>
            </div>
        </section>
</template>