<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useWatchlistStore } from '@/stores/watchlist'
import { useAuthStore } from '@/stores/auth'
import { useMoviesStore } from '@/stores/movies'
import { useI18n } from 'vue-i18n'
import Paginator from '@/components/shared/Paginator.vue'
import MovieCard from '@/components/favorites/MovieCard.vue'
import MovieDetailModal from '@/components/shared/MovieDetailModal.vue'
import { getMovieFullData } from '@/lib/tmdb'
import PageLoader from '@/components/ui/PageLoader.vue'

const isLoading = ref(true)

const { t } = useI18n()
const watchlistStore = useWatchlistStore()
const authStore = useAuthStore()
const moviesStore = useMoviesStore()

const ITEMS_PER_PAGE = 12
const currentPage = ref(1)
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

const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL

const totalPages = computed(() =>
  Math.max(1, Math.ceil(watchlistStore.items.length / ITEMS_PER_PAGE))
)

const paginatedItems = computed(() => {
  const items = watchlistStore.items
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return items.slice(start, start + ITEMS_PER_PAGE)
})

const watchlistLabels = computed(() => ({
  remove: t('watchlist.remove'),
  addToShell: t('recommendations.addToShell'),
  noOverview: t('recommendations.noOverview'),
}))

function getPosterUrl(path: string | null) {
  if (!path) return ''
  return `${TMDB_IMAGE_BASE_URL}${path}`
}

async function openWatchlistDetail(tmdbId: number) {
  loadingDetail.value = true
  try {
    const full = await getMovieFullData(tmdbId)
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
    // Error al cargar detalle
  } finally {
    loadingDetail.value = false
  }
}

function onModalOpenChange(open: boolean) {
  if (!open) selectedMovieForModal.value = null
}

function onOpenDetailFromCard(movie: import('@/composables/useRecommendations').TMDbMovie | import('@/types/movie').Movie) {
  const tmdbId = 'poster_path' in movie ? movie.id : (movie as { tmdbId?: number }).tmdbId
  if (typeof tmdbId === 'number') openWatchlistDetail(tmdbId)
}

async function addToLibrary(item: import('@/types/watchlist').WatchlistItem) {
  try {
    const fullData = await getMovieFullData(item.tmdbId)
    await moviesStore.addMovie({
      tmdbId: fullData.tmdbId,
      title: fullData.title,
      year: fullData.year,
      image: fullData.image || getPosterUrl(item.posterPath),
      platform: '',
      synopsis: fullData.synopsis,
      genres: fullData.genres,
      runtime: fullData.runtime,
      rating: fullData.rating,
      directors: fullData.directors,
      mainActors: fullData.mainActors,
      writers: fullData.writers,
      favorite: false,
    })
    await watchlistStore.removeFromWatchlist(item.id)
  } catch {
    // Error manejado en el store
  }
}

onMounted(async () => {
  try {
    await watchlistStore.loadWatchlist()
  } finally {
    isLoading.value = false
  }
})

watch(totalPages, (total) => {
  if (currentPage.value > total) currentPage.value = 1
})
</script>

<template>
  <PageLoader v-if="isLoading" />
  <section class="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="max-w-7xl mx-auto">
      <div class="mb-10">
        <h1 class="text-2xl md:text-3xl font-bold mb-3">
          {{ t('watchlist.title') }}
        </h1>
        <p class="text-slate-400 max-w-2xl">
          {{ t('watchlist.description') }}
        </p>
      </div>

      <div
        v-if="!authStore.user"
        class="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300"
      >
        {{ t('loginPage.description') }}
      </div>

      <div
        v-else-if="watchlistStore.items.length === 0"
        class="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300"
      >
        {{ t('watchlist.empty') }}
      </div>

      <div
        v-else
        class="space-y-6"
      >
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <MovieCard
            v-for="item in paginatedItems"
            :key="item.id"
            variant="watchlist"
            full-width
            :watchlist-item="item"
            :get-poster-url="getPosterUrl"
            :watchlist-labels="watchlistLabels"
            @remove-from-watchlist="watchlistStore.removeFromWatchlist"
            @add-to-library="addToLibrary"
            @open-detail="onOpenDetailFromCard"
          />
        </div>
        <MovieDetailModal
          v-model:open="showMovieDetailModal"
          :movie="selectedMovieForModal ?? undefined"
          :show-edit-button="false"
          @update:open="onModalOpenChange"
        />

        <Paginator
          v-if="totalPages > 1"
          v-model:current-page="currentPage"
          :total-pages="totalPages"
          class="mt-8"
        />
      </div>
    </div>
  </section>
</template>
