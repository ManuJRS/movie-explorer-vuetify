<script setup lang="ts">
import { computed, onMounted, watch, ref } from 'vue'
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import InsightsIntro from '@/components/stads/InsightsIntro.vue'
import InsightsActors from '@/components/stads/InsightsActors.vue'
import InsightsDirectors from '@/components/stads/InsightsDirectors.vue'
import InsightsGenere from '@/components/stads/InsightsGenere.vue'
import InsightsWriters from '@/components/stads/InsightsWriters.vue'
import { useMoviesStore } from '@/stores/movies'
import PageLoader from '@/components/ui/PageLoader.vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const isLoading = ref(true)

onMounted(async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1800))
  } finally {
    isLoading.value = false
  }
})

const moviesStore = useMoviesStore()
const { movies } = storeToRefs(moviesStore)
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

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
    <PageLoader v-if="isLoading" />
    <div class="min-h-screen mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 align-left justify-left mt-4">
              <router-link to="/movies" class="text-gray-500 hover:text-blue-600 no-underline font-semibold text-base sm:text-lg flex"><span class="material-symbols-outlined mr-2">arrow_back</span>{{ t('settingsPage.BackToMovies') }}</router-link>
          </div>
      <div>
        <InsightsIntro class="mt-12" :total-movies="totalMovies" :total-watch-time="totalWatchTimeFormatted" />
      </div>
      <div class="glass p-4 sm:p-6 md:p-8 rounded-xl border border-black/10 dark:border-white/10">
      <div class="space-y-12 sm:space-y-16">
        <div class="space-y-12 sm:space-y-14">
          <InsightsActors :actors="topActors" />
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <InsightsDirectors :directors="topDirectors" />
            <InsightsGenere :genres="topGenres" />
            <InsightsWriters :writers="topWriters" />
          </div>
        </div>
    </div>
    </div>
    <div class="glass p-4 sm:p-6 md:p-8 rounded-xl border border-black/10 dark:border-white/10">
          <h2 class="text-xl sm:text-2xl font-bold mb-2 text-slate-900 dark:text-white">{{ t('settingsPage.titlePreview') }}</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm mb-6 sm:mb-8">
              {{ t('settingsPage.description') }}
          </p>
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-4 sm:mb-3">
              <h3 class="text-sm sm:text-base font-bold tracking-wider text-slate-400 shrink-0">{{ t('settingsPage.ProfileName') }}:</h3>
              <h4 class="text-base sm:text-lg tracking-wider text-slate-900 dark:text-white break-words min-w-0">{{ user?.user_metadata?.username || user?.user_metadata?.name || '—' }}</h4>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-4 sm:mb-3">
              <h3 class="text-sm sm:text-base font-bold tracking-wider text-slate-400 shrink-0">{{ t('settingsPage.ProfileEmail') }}:</h3>
              <h4 class="text-base sm:text-lg tracking-wider text-slate-900 dark:text-white break-all min-w-0">{{ user?.email ?? '—' }}</h4>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <h3 class="text-sm sm:text-base font-bold tracking-wider text-slate-400 shrink-0">{{ t('settingsPage.Password') }}:</h3>
              <router-link to="/update-password" class="text-blue-500 hover:text-blue-600 underline sm:no-underline font-semibold text-base sm:text-lg">{{ t('settingsPage.UpdatePassword') }}</router-link>
          </div>

    </div>
    </div>


</template>
