<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRecommendations } from '@/composables/useRecommendations'
import { useMoviesStore } from '@/stores/movies'
import { useWatchlistStore } from '@/stores/watchlist'
import { getMovieFullData } from '@/lib/tmdb'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const moviesStore = useMoviesStore()
const watchlistStore = useWatchlistStore()

const savingId = ref<number | null>(null)
const seedingId = ref<number | null>(null)

async function seedToMovies(movie: { id: number; poster_path: string | null }) {
  seedingId.value = movie.id
  try {
    const fullData = await getMovieFullData(movie.id)
    await moviesStore.addMovie({
      tmdbId: fullData.tmdbId,
      title: fullData.title,
      year: fullData.year,
      image: fullData.image || getPosterUrl(movie.poster_path),
      platform: '',
      synopsis: fullData.synopsis,
      genres: fullData.genres,
      runtime: fullData.runtime,
      rating: fullData.rating,
      directors: fullData.directors,
      mainActors: fullData.mainActors,
      writers: fullData.writers,
    })
    await removeAndReplaceMovie(movie.id)
  } catch {
    // Error ya se maneja en el store
  } finally {
    seedingId.value = null
  }
}

function isInMovies(tmdbId: number) {
  return moviesStore.movies.some((m) => m.tmdbId === tmdbId)
}

async function saveToWatchlist(movie: { id: number; title: string; poster_path: string | null; overview: string; release_date: string; vote_average: number }) {
  savingId.value = movie.id
  try {
    await watchlistStore.addToWatchlist(movie)
    await removeAndReplaceMovie(movie.id)
  } catch {
    // Error ya se maneja en el store
  } finally {
    savingId.value = null
  }
}

const {
  recommendations,
  loading,
  error,
  getRecommendations,
  getPosterUrl,
  removeAndReplaceMovie,
} = useRecommendations()

const expandedOverviewIds = ref<Set<number>>(new Set())

function toggleOverview(movieId: number) {
  const set = new Set(expandedOverviewIds.value)
  if (set.has(movieId)) {
    set.delete(movieId)
  } else {
    set.add(movieId)
  }
  expandedOverviewIds.value = set
}

onMounted(async () => {
  await moviesStore.loadMovies()
  await watchlistStore.loadWatchlist()
  getRecommendations()
})
</script>

<template>
  <section class="min-h-screen px-6 py-10 bg-slate-950 text-white">
    <div class="max-w-7xl mx-auto">
      <div class="mb-10">
        <h1 class="text-3xl md:text-4xl font-bold mb-3">
          {{ t('recommendations.title') }}
        </h1>
        <p class="text-slate-400 max-w-2xl">
          {{ t('recommendations.subtitle') }}
        </p>
      </div>

      <div
        v-if="moviesStore.movies.filter(movie => movie.tmdbId != null).length < 3"
        class="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300"
      >
        {{ t('recommendations.emptyMinimum') }}
      </div>

      <div
        v-else-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="n in 12"
          :key="n"
          class="rounded-2xl overflow-hidden border border-white/10 bg-white/5 animate-pulse"
        >
          <div class="h-[360px] bg-slate-800"></div>
          <div class="p-4 space-y-3">
            <div class="h-5 bg-slate-800 rounded"></div>
            <div class="h-4 bg-slate-800 rounded w-2/3"></div>
            <div class="h-16 bg-slate-800 rounded"></div>
          </div>
        </div>
      </div>

      <div
        v-else-if="error"
        class="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300"
      >
        {{ error }}
      </div>

      <div
        v-else-if="recommendations.length === 0"
        class="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300"
      >
        {{ t('recommendations.noResults') }}
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <article
          v-for="movie in recommendations"
          :key="movie.id"
          class="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
        >
          <img
            :src="getPosterUrl(movie.poster_path)"
            :alt="movie.title"
            class="w-full md:h-[360px] object-cover"
          />

          <div class="p-4">
            <h2 class="text-lg font-bold line-clamp-1 mb-1">
              {{ movie.title }}
            </h2>

            <p class="text-sm text-slate-400 mb-3">
              {{ movie.release_date?.slice(0, 4) || 'N/A' }}
            </p>

            <p
              :class="[
                'text-sm text-slate-300 mb-2',
                expandedOverviewIds.has(movie.id) ? '' : 'line-clamp-3',
              ]"
            >
              {{ movie.overview || t('recommendations.noOverview') }}
            </p>
            <button
              v-if="movie.overview && movie.overview.length > 150"
              type="button"
              class="text-xs text-primary hover:underline mb-3"
              @click="toggleOverview(movie.id)"
            >
              {{ expandedOverviewIds.has(movie.id) ? t('recommendations.seeLess') : t('recommendations.seeMore') }}
            </button>
            <div class="flex items-center justify-between gap-2">
                <button
                type="button"
                class="w-full rounded-xl px-4 py-2 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                :class="isInMovies(movie.id)
                  ? 'bg-slate-600 text-slate-300 cursor-default'
                  : 'bg-slate-700 text-white hover:bg-slate-600'"
                :disabled="seedingId === movie.id || isInMovies(movie.id)"
                @click="seedToMovies(movie)"
                >
                {{ seedingId === movie.id ? '...' : isInMovies(movie.id) ? t('recommendations.seeded') : t('recommendations.addToShell') }}
                </button>
                <button
                type="button"
                class="w-full rounded-xl px-4 py-2 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
                :class="watchlistStore.isInWatchlist(movie.id)
                  ? 'bg-slate-600 text-slate-300 cursor-default'
                  : 'bg-slate-700 text-white hover:bg-slate-600'"
                :disabled="savingId === movie.id || watchlistStore.isInWatchlist(movie.id)"
                @click="saveToWatchlist(movie)"
                >
                {{ savingId === movie.id ? '...' : watchlistStore.isInWatchlist(movie.id) ? t('watchlist.saved') : t('recommendations.addToWatchlist') }}
                </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>