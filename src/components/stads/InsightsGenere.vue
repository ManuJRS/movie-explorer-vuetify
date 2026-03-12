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
            <div class="flex flex-col gap-4">
                <div
                    v-for="genre in genres"
                    :key="genre.name"
                    class="glass p-4 rounded-2xl flex items-center gap-3 hover:bg-primary/5 transition-colors"
                >
                    <div class="size-16 rounded-full overflow-hidden flex items-center justify-center">
                        <div class="size-12 rounded-full flex items-center justify-center bg-primary/10 dark:bg-black/10">
                            <span class="material-symbols-outlined text-2xl text-primary">movie</span>
                        </div>
                    </div>
                    <div class="text-lg font-bold leading-tight line-clamp-2">{{ genre.name }}</div>
                    <!-- <span class="text-xs font-bold leading-tight text-primary">{{ genre.percentage }}%</span> -->
                </div>
                <div v-if="!genres?.length" class="col-span-2 sm:col-span-3 text-slate-500 text-sm py-8 text-center">
                    No genres data yet. Add movies from TMDB search to see your favorite genres.
                </div>
            </div>
        </section>
</template>