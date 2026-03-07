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

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  name: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
}

export interface MovieDetailsResponse {
  id: number
  title: string
  overview: string
  runtime: number | null
  vote_average: number
  release_date: string
  poster_path: string | null
  genres: Genre[]
  production_companies: ProductionCompany[]
  credits: {
    cast: CastMember[]
    crew: CrewMember[]
  }
}

export interface MovieFullData {
  tmdbId: number
  title: string
  year: string
  image: string
  synopsis: string
  runtime: number | null
  rating: number
  genres: string[]
  productionCompanies: string[]
  mainActors: string[]
  directors: string[]
  writers: string[]
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

export const getMovieFullData = async (movieId: number): Promise<MovieFullData> => {
  const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Error fetching movie details')
  }

  const data: MovieDetailsResponse = await response.json()

  const directors = data.credits.crew
    .filter((person) => person.job === 'Director')
    .map((person) => person.name)

  const writers = data.credits.crew
    .filter(
      (person) =>
        person.job === 'Writer' ||
        person.job === 'Screenplay' ||
        person.job === 'Story'
    )
    .map((person) => person.name)

  const mainActors = [...data.credits.cast]
    .sort((a, b) => a.order - b.order)
    .slice(0, 5)
    .map((actor) => actor.name)

  return {
    tmdbId: data.id,
    title: data.title,
    year: data.release_date ? data.release_date.slice(0, 4) : '',
    image: data.poster_path ? `${TMDB_IMAGE_BASE_URL}${data.poster_path}` : '',
    synopsis: data.overview || '',
    runtime: data.runtime,
    rating: data.vote_average,
    genres: data.genres.map((genre) => genre.name),
    productionCompanies: data.production_companies.map((company) => company.name),
    mainActors,
    directors,
    writers,
  }
}