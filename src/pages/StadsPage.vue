<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import InsightsIntro from '@/components/InsightsIntro.vue'
import InsightsActors from '@/components/InsightsActors.vue'
import InsightsDirectors from '@/components/InsightsDirectors.vue'
import InsightsGenere from '@/components/InsightsGenere.vue'
import InsightsWriters from '@/components/InsightsWriters.vue'
import { useMoviesStore } from '@/stores/movies'
import { useAuthStore } from '@/stores/auth'
import PageLoader from '@/components/ui/PageLoader.vue'

const isLoading = ref(true)

onMounted(async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1800))
  } finally {
    isLoading.value = false
  }
})
const moviesStore = useMoviesStore()
const authStore = useAuthStore()
const { movies } = storeToRefs(moviesStore)
const { user } = storeToRefs(authStore)

watch(user, async (u) => {
  if (u) await moviesStore.loadMovies()
  else moviesStore.resetMovies()
}, { immediate: true })

onMounted(async () => {
  if (user.value) await moviesStore.loadMovies()
})

const totalMovies = computed(() => movies.value.length)

const totalRuntimeMinutes = computed(() =>
  movies.value.reduce((sum, m) => sum + (m.runtime ?? 0), 0)
)

function formatWatchTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours < 24) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  const days = (minutes / (60 * 24)).toFixed(1)
  return `${parseFloat(days)}d`
}

const totalWatchTimeFormatted = computed(() =>
  formatWatchTime(totalRuntimeMinutes.value)
)

/** Top 5 actores más repetidos según las películas guardadas */
const topActors = computed(() => {
  const count: Record<string, number> = {}
  for (const movie of movies.value) {
    for (const actor of movie.mainActors ?? []) {
      if (actor) count[actor] = (count[actor] ?? 0) + 1
    }
  }
  return Object.entries(count)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name]) => name)
})

/** Top 3 directores más repetidos según las películas guardadas */
const topDirectors = computed(() => {
  const count: Record<string, number> = {}
  for (const movie of movies.value) {
    for (const director of movie.directors ?? []) {
      if (director) count[director] = (count[director] ?? 0) + 1
    }
  }
  return Object.entries(count)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name]) => name)
})

/** Top 3 géneros más repetidos con porcentaje según las películas guardadas */
const topGenres = computed(() => {
  const count: Record<string, number> = {}
  let total = 0
  for (const movie of movies.value) {
    for (const genre of movie.genres ?? []) {
      if (genre) {
        count[genre] = (count[genre] ?? 0) + 1
        total++
      }
    }
  }
  return Object.entries(count)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, cnt]) => ({
      name,
      count: cnt,
      percentage: total > 0 ? Math.round((cnt / total) * 100) : 0,
    }))
})

/** Top 3 escritores más repetidos según las películas guardadas */
const topWriters = computed(() => {
  const count: Record<string, number> = {}
  for (const movie of movies.value) {
    for (const writer of movie.writers ?? []) {
      if (writer) count[writer] = (count[writer] ?? 0) + 1
    }
  }
  return Object.entries(count)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name]) => name)
})
</script>

<template>
    <main class="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageLoader v-if="isLoading" />
        <InsightsIntro :total-movies="totalMovies" :total-watch-time="totalWatchTimeFormatted" />
        <InsightsActors :actors="topActors" />
        <InsightsDirectors :directors="topDirectors" />
        <InsightsGenere :genres="topGenres" />
        <InsightsWriters :writers="topWriters" />
    </main>
</template>