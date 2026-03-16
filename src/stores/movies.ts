import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDemoMoviesSeed } from '@/data/demoSeed'
import type { Movie } from '@/types/movie'

const DEMO_MOVIES_KEY = 'movie-explorer-demo-movies'
const DEMO_MOVIES_JSON_URL = '/data/demo-movies.json'

function normalizeMovie(raw: Record<string, unknown>): Movie {
  return {
    id: String(raw.id ?? ''),
    title: String(raw.title ?? ''),
    year: String(raw.year ?? ''),
    image: String(raw.image ?? ''),
    platform: String(raw.platform ?? ''),
    synopsis: String(raw.synopsis ?? ''),
    tmdbId: typeof raw.tmdbId === 'number' ? raw.tmdbId : undefined,
    genres: Array.isArray(raw.genres) ? raw.genres.map(String) : undefined,
    runtime: typeof raw.runtime === 'number' ? raw.runtime : null,
    rating: typeof raw.rating === 'number' ? raw.rating : undefined,
    directors: Array.isArray(raw.directors) ? raw.directors.map(String) : undefined,
    mainActors: Array.isArray(raw.mainActors) ? raw.mainActors.map(String) : undefined,
    writers: Array.isArray(raw.writers) ? raw.writers.map(String) : undefined,
    favorite: Boolean(raw.favorite),
  }
}

async function fetchDemoMoviesFromJson(): Promise<Movie[]> {
  const res = await fetch(DEMO_MOVIES_JSON_URL, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Failed to load demo movies: ${res.status}`)
  const data = await res.json()
  if (!Array.isArray(data)) return []
  return data.map((item: Record<string, unknown>) => normalizeMovie(item))
}

export const useMoviesStore = defineStore('movies', () => {
  const movies = ref<Movie[]>([])

  function persistDemoMovies() {
    try {
      localStorage.setItem(DEMO_MOVIES_KEY, JSON.stringify(movies.value))
    } catch (e) {
      console.error('Error persisting demo movies:', e)
    }
  }

  async function loadMovies() {
    try {
      const raw = localStorage.getItem(DEMO_MOVIES_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Movie[]
        movies.value = Array.isArray(parsed) ? parsed : []
      } else {
        movies.value = await fetchDemoMoviesFromJson()
        persistDemoMovies()
      }
    } catch (e) {
      console.error('Error loading demo movies:', e)
      movies.value = getDemoMoviesSeed()
      persistDemoMovies()
    }
  }

  async function addMovie(movie: Omit<Movie, 'id'>) {
    const newMovie: Movie = {
      ...movie,
      id: `demo-${crypto.randomUUID()}`,
      favorite: movie.favorite ?? false,
    }
    movies.value = [newMovie, ...movies.value]
    persistDemoMovies()
  }

  async function updateMovie(movie: Movie) {
    const idx = movies.value.findIndex(m => m.id === movie.id)
    if (idx !== -1) {
      movies.value = [...movies.value.slice(0, idx), movie, ...movies.value.slice(idx + 1)]
      persistDemoMovies()
    }
  }

  async function deleteMovie(id: string) {
    movies.value = movies.value.filter(movie => movie.id !== id)
    persistDemoMovies()
  }

  function resetMovies() {
    movies.value = []
    try {
      localStorage.removeItem(DEMO_MOVIES_KEY)
    } catch {
      // ignore
    }
  }

  /** Borra los datos locales y vuelve a cargar desde public/data/demo-movies.json. Útil para ver cambios en el JSON. */
  async function resetToDemoFromJson() {
    try {
      localStorage.removeItem(DEMO_MOVIES_KEY)
      movies.value = await fetchDemoMoviesFromJson()
      persistDemoMovies()
    } catch (e) {
      console.error('Error resetting to demo JSON:', e)
      movies.value = getDemoMoviesSeed()
      persistDemoMovies()
    }
  }

  async function toggleFavorite(movieId: string, currentValue: boolean) {
    const movie = movies.value.find(m => m.id === movieId)
    if (movie) {
      movie.favorite = !currentValue
      persistDemoMovies()
    }
  }

  return {
    movies,
    loadMovies,
    addMovie,
    toggleFavorite,
    updateMovie,
    deleteMovie,
    resetMovies,
    resetToDemoFromJson,
  }
})
