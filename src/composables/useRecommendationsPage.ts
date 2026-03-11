import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMoviesStore } from '@/stores/movies'
import { useWatchlistStore } from '@/stores/watchlist'
import { getMovieFullData } from '@/lib/tmdb'
import { useRecommendations } from '@/composables/useRecommendations'

const INITIAL_LOAD_DELAY_MS = 1800

export function useRecommendationsPage() {
  const { t } = useI18n()
  const moviesStore = useMoviesStore()
  const watchlistStore = useWatchlistStore()

  const isLoading = ref(true)
  const savingId = ref<number | null>(null)
  const seedingId = ref<number | null>(null)
  const expandedOverviewIds = ref<Set<number>>(new Set())

  const {
    recommendations,
    loading,
    error,
    getRecommendations,
    getPosterUrl,
    removeAndReplaceMovie,
  } = useRecommendations()

  const hasMinimumFavorites = computed(
    () =>
      moviesStore.movies.filter((m) => m.favorite && m.tmdbId != null).length < 3
  )

  function isInMovies(tmdbId: number) {
    return moviesStore.movies.some((m) => m.tmdbId === tmdbId)
  }

  function isInWatchlist(tmdbId: number) {
    return watchlistStore.isInWatchlist(tmdbId)
  }

  async function seedToMovies(movie: {
    id: number
    poster_path: string | null
  }) {
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
        favorite: false,
      })
      await removeAndReplaceMovie(movie.id)
    } catch {
      // Error ya se maneja en el store
    } finally {
      seedingId.value = null
    }
  }

  async function saveToWatchlist(movie: {
    id: number
    title: string
    poster_path: string | null
    overview: string
    release_date: string
    vote_average: number
  }) {
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
    try {
      await new Promise((resolve) => setTimeout(resolve, INITIAL_LOAD_DELAY_MS))
    } finally {
      isLoading.value = false
    }
  })

  onMounted(async () => {
    await moviesStore.loadMovies()
    await watchlistStore.loadWatchlist()
    getRecommendations()
  })

  return {
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
  }
}
