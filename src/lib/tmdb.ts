const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

export interface TmdbMovieResult {
  id: number
  title: string
  release_date: string
  poster_path: string | null
}

export interface MoviePosterResult {
  id: number
  title: string
  year: string
  posterUrl: string | null
}

export const searchMoviesByTitle = async (query: string): Promise<MoviePosterResult[]> => {
  if (!query.trim()) return []

  const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Error searching movies')
  }

  const data = await response.json()

  return (data.results || []).slice(0, 6).map((movie: TmdbMovieResult) => ({
    id: movie.id,
    title: movie.title,
    year: movie.release_date ? movie.release_date.slice(0, 4) : '',
    posterUrl: movie.poster_path
      ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`
      : null,
  }))
}