<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMoviesStore } from '@/stores/movies'

const { t } = useI18n()
const moviesStore = useMoviesStore()

const favoriteMovies = computed(() => {
  return moviesStore.movies.filter(movie => movie.favorite === true)
})

const topWritters = computed(() => {
  const counts: Record<string, number> = {}

  for (const movie of favoriteMovies.value) {
    if (!movie.writers?.length) continue

    for (const writer of movie.writers) {
      const name = writer.trim()
      if (!name) continue

      if (counts[name]) {
        counts[name]++
      } else {
        counts[name] = 1
      }
    }
  }

  return Object.entries(counts)
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 4)
})
</script>

<template>
  <div class="glass rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col">
    <h3 class="text-lg font-bold text-white mb-6">{{ t('statsFavs.writersTitle') }}</h3>

    <div v-if="topWritters.length" class="space-y-4">
      <div
        v-for="(item, index) in topWritters"
        :key="item.label"
        class="flex items-center gap-3 group"
      >
        <div
          class="h-10 w-10 rounded-full shrink-0 flex items-center justify-center text-sm font-bold"
          :class="[
            index === 0 && 'bg-amber-500/20 text-amber-400',
            index === 1 && 'bg-slate-500/20 text-slate-300',
            index === 2 && 'bg-amber-700/20 text-amber-600',
            index >= 3 && 'bg-primary/10 text-primary'
          ]"
        >
          {{ index + 1 }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-bold text-white truncate">{{ item.label }}</p>
          <p class="text-xs text-slate-500 uppercase font-medium">
            {{ t('statsFavs.writer') }} • {{ item.total }} {{ item.total === 1 ? t('statsFavs.movie_one') : t('statsFavs.movie_other') }}
          </p>
        </div>
      </div>
    </div>

    <p v-else class="text-sm text-slate-400 text-center py-6">
      {{ t('statsFavs.noWriters') }}
    </p>
  </div>
</template>