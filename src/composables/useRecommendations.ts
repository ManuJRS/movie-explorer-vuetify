import { ref } from 'vue'
import { useMoviesStore } from '@/stores/movies'
import { useWatchlistStore } from '@/stores/watchlist'
import {
  getRecommendations as getScoredRecommendations,
  buildFavoriteProfile,
} from '@/lib/recommendations'
import type { CandidateMovie } from '@/lib/recommendations'

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
      if (!map.has(movie.id)) map.set(movie.id, movie)
    }
    return Array.from(map.values())
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

  async function getGenreIdToName(): Promise<Record<number, string>> {
    const data = await fetchFromTMDb('/genre/movie/list?language=en-US')
    const map: Record<number, string> = {}
    for (const g of data.genres || []) {
      map[g.id] = g.name
    }
    return map
  }

  function tmdbToCandidate(raw: TMDbMovie, genreMap: Record<number, string>): CandidateMovie {
    return {
      id: raw.id,
      title: raw.title,
      posterUrl: raw.poster_path ? `${TMDB_IMAGE_BASE_URL}${raw.poster_path}` : '',
      year: raw.release_date?.slice(0, 4) ?? '',
      overview: raw.overview ?? '',
      genres: (raw.genre_ids ?? []).map((id) => genreMap[id] ?? '').filter(Boolean),
      voteAverage: raw.vote_average,
    }
  }

  async function getRecommendations() {
    loading.value = true
    error.value = ''
    const currentIds = new Set(recommendations.value.map((m) => m.id))
    recommendations.value = []

    try {
      const favoriteWithTmdbId = moviesStore.movies.filter(
        (m): m is typeof m & { tmdbId: number } =>
          m.favorite === true && typeof m.tmdbId === 'number'
      )

      if (favoriteWithTmdbId.length < 3) {
        recommendations.value = []
        return
      }

      const seedMovies = favoriteWithTmdbId.slice(0, 5)
      const pages = [1, 2, 3]

      const [genreMap, ...results] = await Promise.all([
        getGenreIdToName(),
        ...seedMovies.flatMap((movie) =>
          pages.flatMap((page) => [
            fetchFromTMDb(`/movie/${movie.tmdbId}/recommendations?language=en-US&page=${page}`),
            fetchFromTMDb(`/movie/${movie.tmdbId}/similar?language=en-US&page=${page}`),
          ])
        ),
      ])

      const rawCandidates: TMDbMovie[] = results.flatMap((r: { results?: TMDbMovie[] }) => r.results || [])
      let withPoster = filterNotInWatchlist(filterValidPosters(removeDuplicates(rawCandidates)))
      if (currentIds.size > 0) {
        const withoutCurrent = withPoster.filter((m) => !currentIds.has(m.id))
        if (withoutCurrent.length >= 12) withPoster = withoutCurrent
      }

      const candidateMovies: CandidateMovie[] = withPoster.map((r) => tmdbToCandidate(r, genreMap))

      const favoriteMovies = moviesStore.movies.filter((m) => m.favorite === true)
      const profile = buildFavoriteProfile(favoriteMovies)
      const scored = getScoredRecommendations({
        allUserMovies: moviesStore.movies,
        candidateMovies,
        limit: 12,
      })

      console.group('[Recomendaciones] Puntuaciones basadas en favoritas')
      console.log('Perfil de gusto (favoritas):', profile)
      console.log(
        'Recomendaciones puntuadas:',
        scored.map((s) => ({
          id: s.id,
          title: s.title,
          recommendationScore: s.recommendationScore,
        }))
      )
      console.groupEnd()

      const byId = new Map(withPoster.map((m) => [m.id, m]))
      recommendations.value = scored
        .map((s) => byId.get(s.id))
        .filter((m): m is TMDbMovie => m != null)
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

    try {
      const favoriteWithTmdbId = moviesStore.movies.filter(
        (m): m is typeof m & { tmdbId: number } =>
          m.favorite === true && typeof m.tmdbId === 'number'
      )
      if (favoriteWithTmdbId.length < 3) return

      const seedMovies = favoriteWithTmdbId.slice(0, 5)
      const [genreMap, ...pageResults] = await Promise.all([
        getGenreIdToName(),
        ...seedMovies.flatMap((movie) => [
          fetchFromTMDb(`/movie/${movie.tmdbId}/recommendations?language=en-US&page=1`),
          fetchFromTMDb(`/movie/${movie.tmdbId}/similar?language=en-US&page=1`),
          fetchFromTMDb(`/movie/${movie.tmdbId}/recommendations?language=en-US&page=2`),
          fetchFromTMDb(`/movie/${movie.tmdbId}/similar?language=en-US&page=2`),
        ]),
      ])

      const rawCandidates: TMDbMovie[] = pageResults.flatMap((r: { results?: TMDbMovie[] }) => r.results || [])
      const withPoster = filterNotInWatchlist(filterValidPosters(removeDuplicates(rawCandidates)))
      const filtered = filterNotInCurrent(withPoster, excludeIds)

      const candidateMovies = filtered.map((r) => tmdbToCandidate(r, genreMap))
      const scored = getScoredRecommendations({
        allUserMovies: moviesStore.movies,
        candidateMovies,
        limit: 1,
      })

      const replacement = scored[0]
      if (replacement) {
        const raw = filtered.find((m) => m.id === replacement.id)
        if (raw) recommendations.value.push(raw)
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