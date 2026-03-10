// src/composables/useRecommendations.ts
import { ref } from 'vue'
import { useMoviesStore } from '@/stores/movies'
import { useWatchlistStore } from '@/stores/watchlist'

export interface TMDbMovie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  genre_ids: number[]
}

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL
const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL

export function useRecommendations() {
  const moviesStore = useMoviesStore()
  const watchlistStore = useWatchlistStore()

  const recommendations = ref<TMDbMovie[]>([])
  const loading = ref(false)
  const error = ref('')

  async function fetchFromTMDb(endpoint: string) {
    const res = await fetch(`${TMDB_BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}`)

    if (!res.ok) {
      throw new Error('Error fetching TMDb data')
    }

    return res.json()
  }

  function removeDuplicates(movies: TMDbMovie[]) {
    const map = new Map<number, TMDbMovie>()

    for (const movie of movies) {
      if (!map.has(movie.id)) {
        map.set(movie.id, movie)
      }
    }

    return Array.from(map.values())
  }

  function filterAlreadySeen(movies: TMDbMovie[]) {
    const seenTmdbIds = new Set(
      moviesStore.movies
        .map((movie) => movie.tmdbId)
        .filter((id): id is number => typeof id === 'number')
    )

    return movies.filter((movie) => !seenTmdbIds.has(movie.id))
  }

  function filterNotInWatchlist(movies: TMDbMovie[]) {
    const watchlistIds = new Set(watchlistStore.items.map((item) => item.tmdbId))
    return movies.filter((movie) => !watchlistIds.has(movie.id))
  }

  function filterNotInCurrent(movies: TMDbMovie[], excludeIds: Set<number>) {
    return movies.filter((movie) => !excludeIds.has(movie.id))
  }

  function filterValidPosters(movies: TMDbMovie[]) {
    return movies.filter((movie) => movie.poster_path)
  }

  async function getRecommendations() {
    loading.value = true
    error.value = ''
    recommendations.value = []

    try {
      const savedMoviesWithTmdbId = moviesStore.movies.filter(
        (movie): movie is typeof movie & { tmdbId: number } =>
          typeof movie.tmdbId === 'number'
      )

      if (savedMoviesWithTmdbId.length < 3) {
        recommendations.value = []
        return
      }

      // Tomamos hasta 5 películas guardadas (con TMDB ID) para generar recomendaciones
      const seedMovies = savedMoviesWithTmdbId.slice(0, 5)

      const results = await Promise.all(
        seedMovies.flatMap((movie) => [
          fetchFromTMDb(`/movie/${movie.tmdbId}/recommendations?language=en-US&page=1`),
          fetchFromTMDb(`/movie/${movie.tmdbId}/similar?language=en-US&page=1`),
        ])
      )

      const mergedMovies: TMDbMovie[] = results.flatMap((result) => result.results || [])

      const cleanedMovies = removeDuplicates(
        filterNotInWatchlist(
          filterAlreadySeen(
            filterValidPosters(mergedMovies)
          )
        )
      )

      recommendations.value = cleanedMovies.slice(0, 12)
    } catch (err) {
      console.error(err)
      error.value = 'Could not load recommendations.'
    } finally {
      loading.value = false
    }
  }

  function getPosterUrl(path: string | null) {
    if (!path) return ''
    return `${TMDB_IMAGE_BASE_URL}${path}`
  }

  async function removeAndReplaceMovie(tmdbId: number) {
    const currentIds = new Set(recommendations.value.map((m) => m.id))
    const excludeIds = new Set([...currentIds])
    excludeIds.delete(tmdbId)

    recommendations.value = recommendations.value.filter((m) => m.id !== tmdbId)

    function findReplacement(movies: TMDbMovie[]) {
      return removeDuplicates(
        filterNotInCurrent(
          filterNotInWatchlist(
            filterAlreadySeen(filterValidPosters(movies))
          ),
          excludeIds
        )
      )[0]
    }

    try {
      const savedMoviesWithTmdbId = moviesStore.movies.filter(
        (movie): movie is typeof movie & { tmdbId: number } =>
          typeof movie.tmdbId === 'number'
      )
      if (savedMoviesWithTmdbId.length < 3) return

      const seedMovies = savedMoviesWithTmdbId.slice(0, 5)
      const [page1Results, page2Results] = await Promise.all([
        Promise.all(
          seedMovies.flatMap((movie) => [
            fetchFromTMDb(`/movie/${movie.tmdbId}/recommendations?language=en-US&page=1`),
            fetchFromTMDb(`/movie/${movie.tmdbId}/similar?language=en-US&page=1`),
          ])
        ),
        Promise.all(
          seedMovies.flatMap((movie) => [
            fetchFromTMDb(`/movie/${movie.tmdbId}/recommendations?language=en-US&page=2`),
            fetchFromTMDb(`/movie/${movie.tmdbId}/similar?language=en-US&page=2`),
          ])
        ),
      ])

      const merged1 = page1Results.flatMap((r: { results?: TMDbMovie[] }) => r.results || [])
      const merged2 = page2Results.flatMap((r: { results?: TMDbMovie[] }) => r.results || [])
      const replacement = findReplacement(merged2) ?? findReplacement(merged1)

      if (replacement) {
        recommendations.value.push(replacement)
      }
    } catch (err) {
      console.error('Error fetching replacement:', err)
    }
  }

  return {
    recommendations,
    loading,
    error,
    getRecommendations,
    getPosterUrl,
    removeAndReplaceMovie,
  }
}