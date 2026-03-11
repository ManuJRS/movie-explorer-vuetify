<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMoviesStore } from '@/stores/movies'

const { t } = useI18n()
const moviesStore = useMoviesStore()

const favoriteMovies = computed(() => {
  return moviesStore.movies.filter(movie => movie.favorite === true)
})

const decadeStats = computed(() => {
  const counts: Record<string, number> = {}

  for (const movie of favoriteMovies.value) {
    const year = Number(movie.year)

    if (!year || Number.isNaN(year)) continue

    const decade = Math.floor(year / 10) * 10
    const label = `${decade}s`

    if (counts[label]) {
      counts[label]++
    } else {
      counts[label] = 1
    }
  }

  return Object.entries(counts)
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total)
})

const chartSeries = computed(() => {
  return decadeStats.value.map(item => item.total)
})

const chartLabels = computed(() => {
  return decadeStats.value.map(item => item.label)
})

const totalFavoritesWithValidYear = computed(() => {
  return decadeStats.value.reduce((acc, item) => acc + item.total, 0)
})

const topDecade = computed(() => {
  return decadeStats.value[0]?.label ?? 'N/A'
})

const topDecadePercentage = computed(() => {
  if (!decadeStats.value.length || totalFavoritesWithValidYear.value === 0) return 0

  return Math.round((decadeStats.value[0].total / totalFavoritesWithValidYear.value) * 100)
})

const chartOptions = computed(() => ({
  chart: {
    type: 'donut',
    background: 'transparent',
    toolbar: {
      show: false,
    },
  },
  labels: chartLabels.value,
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: 0,
  },
  plotOptions: {
    pie: {
      donut: {
        size: '72%',
      },
    },
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (value: number) => `${value} movie${value !== 1 ? 's' : ''}`,
    },
  },
  colors: ['#1152d4', '#6366f1', '#a855f7', '#3b82f6', '#14b8a6', '#f59e0b'],
}))
</script>

<template>
  <div class="glass rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col">
    <h3 class="text-lg font-bold text-white mb-6">{{ t('statsFavs.decadesTitle') }}</h3>

    <div class="flex-1 flex items-center justify-center relative min-h-[220px]">
      <apexchart
        v-if="chartSeries.length"
        type="donut"
        height="220"
        width="220"
        :options="chartOptions"
        :series="chartSeries"
      />

      <div class="absolute flex flex-col items-center">
        <span class="text-2xl font-bold text-white">{{ topDecade }}</span>
        <span class="text-xs text-slate-400">{{ topDecadePercentage }}{{ t('statsFavs.percentTotal') }}</span>
      </div>

      <div
        v-if="!chartSeries.length"
        class="text-sm text-slate-400 text-center"
      >
        {{ t('statsFavs.noDecades') }}
      </div>
    </div>

    <div
      v-if="decadeStats.length"
      class="grid grid-cols-2 gap-3 mt-6"
    >
      <div
        v-for="(item, index) in decadeStats"
        :key="item.label"
        class="flex items-center gap-2"
      >
        <div
          class="w-2.5 h-2.5 rounded-full shrink-0"
          :class="[
            index === 0 && 'bg-blue-700',
            index === 1 && 'bg-indigo-500',
            index === 2 && 'bg-purple-500',
            index === 3 && 'bg-blue-500',
            index === 4 && 'bg-teal-500',
            index >= 5 && 'bg-amber-500'
          ]"
        />
        <span class="text-sm text-slate-300 truncate">
          {{ item.label }} ({{ item.total }})
        </span>
      </div>
    </div>
  </div>
</template>