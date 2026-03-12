<script setup lang="ts">
import { computed, ref } from 'vue'
import PageLoader from '@/components/ui/PageLoader.vue'
import MovieCard from '@/components/favorites/MovieCard.vue'
import { useRecommendationsPage } from '@/composables/useRecommendationsPage'
import MovieDetailModal from '@/components/shared/MovieDetailModal.vue'
import { getMovieFullData } from '@/lib/tmdb'
import type { TMDbMovie } from '@/composables/useRecommendations'

const showMovieDetailModal = ref(false)
const loadingDetail = ref(false)
const selectedMovieForModal = ref<{
  title: string
  year: string
  image: string
  platform: string
  synopsis: string
  runtime?: number | null
  rating?: number
  genres?: string[]
  directors?: string[]
  mainActors?: string[]
  writers?: string[]
} | null>(null)

const {
  t,
  isLoading,
  savingId,
  seedingId,
  recommendations,
  loading,
  error,
  getRecommendations,
  getPosterUrl,
  hasMinimumFavorites,
  isInMovies,
  isInWatchlist,
  seedToMovies,
  saveToWatchlist,
  expandedOverviewIds,
  toggleOverview,
} = useRecommendationsPage()

async function openRecommendationDetail(movie: TMDbMovie | import('@/types/movie').Movie) {
  const rec = movie as TMDbMovie
  if (!('poster_path' in rec)) return
  loadingDetail.value = true
  try {
    const full = await getMovieFullData(rec.id)
    selectedMovieForModal.value = {
      title: full.title,
      year: full.year,
      image: full.image,
      platform: '',
      synopsis: full.synopsis,
      runtime: full.runtime,
      rating: full.rating,
      genres: full.genres,
      directors: full.directors,
      mainActors: full.mainActors,
      writers: full.writers,
    }
    showMovieDetailModal.value = true
  } catch {
    // Error al cargar detalle; se podría mostrar un toast
  } finally {
    loadingDetail.value = false
  }
}

function onModalOpenChange(open: boolean) {
  if (!open) selectedMovieForModal.value = null
}

const recommendationLabels = computed(() => ({
  addToShell: t('recommendations.addToShell'),
  seeded: t('recommendations.seeded'),
  addToWatchlist: t('recommendations.addToWatchlist'),
  saved: t('watchlist.saved'),
  noOverview: t('recommendations.noOverview'),
  seeMore: t('recommendations.seeMore'),
  seeLess: t('recommendations.seeLess'),
}))
</script>

<template>
  <PageLoader v-if="isLoading" />
  <section class="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="mb-10">
        <div class="flex items-center gap-3 mb-3">
          <h1 class="text-3xl md:text-4xl font-bold">
            {{ t('recommendations.title') }}
          </h1>
          <button
            type="button"
            class="rounded-full p-2 text-slate-400 hover:text-white hover:cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            :aria-label="t('recommendations.refresh')"
            :disabled="loading"
            @click="getRecommendations()"
          >
            <span
              class="material-symbols-outlined text-2xl block"
              :class="{ 'animate-spin': loading }"
            >
              refresh
            </span>
          </button>
        </div>
        <p class="text-slate-400 max-w-2xl">
          {{ t('recommendations.subtitle') }}
        </p>
      </div>

      <div
        v-if="hasMinimumFavorites"
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
        class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2"
      >
        <MovieCard
          v-for="movie in recommendations"
          :key="movie.id"
          variant="recommendation"
          full-width
          :recommendation="movie"
          :get-poster-url="getPosterUrl"
          :expanded-overview-ids="expandedOverviewIds"
          :seeding-id="seedingId"
          :saving-id="savingId"
          :recommendation-labels="recommendationLabels"
          :is-in-movies="isInMovies"
          :is-in-watchlist="isInWatchlist"
          @toggle-overview="toggleOverview"
          @open-detail="openRecommendationDetail"
          @seed-to-movies="seedToMovies"
          @save-to-watchlist="saveToWatchlist"
        />
        <MovieDetailModal
          v-model:open="showMovieDetailModal"
          :movie="selectedMovieForModal ?? undefined"
          :show-edit-button="false"
          @update:open="onModalOpenChange"
        />
      </div>
  </section>
</template>
