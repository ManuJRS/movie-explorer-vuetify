const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL
const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL

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

/** Proveedor de watch/providers (flatrate, rent, buy) por país. */
export interface TmdbWatchProvider {
  logo_path: string | null
  provider_id: number
  provider_name: string
  display_priority?: number
}

/** Video en la respuesta de TMDb (append_to_response=videos). */
export interface TmdbVideoResult {
  key: string
  site: string
  type: string
  official?: boolean
  name?: string
}

/** Respuesta anidada de videos al usar append_to_response. */
export interface MovieVideosResponse {
  results?: TmdbVideoResult[]
}

/** Respuesta anidada de watch/providers al usar append_to_response. */
export interface MovieWatchProvidersResponse {
  results?: {
    MX?: {
      link?: string
      flatrate?: TmdbWatchProvider[]
      rent?: TmdbWatchProvider[]
      buy?: TmdbWatchProvider[]
    }
    US?: {
      link?: string
      flatrate?: TmdbWatchProvider[]
      rent?: TmdbWatchProvider[]
      buy?: TmdbWatchProvider[]
    }
  }
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
  'watch/providers'?: MovieWatchProvidersResponse
  videos?: MovieVideosResponse
}

/** Plataformas de visionado por país (nombres únicos). */
export interface WatchProvidersByCountry {
  mx: string[]
  us: string[]
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
  /** Plataformas donde ver (MX y US) desde TMDb watch/providers. */
  watchProviders?: WatchProvidersByCountry
  /** URL de embed del trailer en YouTube (si cumple condiciones). Por ahora no se muestra en el modal. */
  trailerEmbedUrl?: string | null
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

function parseWatchProviders(
  raw: MovieDetailsResponse['watch/providers']
): WatchProvidersByCountry | undefined {
  const results = raw?.results
  if (!results) return undefined

  const toNames = (list: TmdbWatchProvider[] | undefined): string[] => {
    if (!list?.length) return []
    const seen = new Set<number>()
    return list
      .filter((p) => {
        if (seen.has(p.provider_id)) return false
        seen.add(p.provider_id)
        return true
      })
      .map((p) => p.provider_name)
  }

  const mxList = [
    ...(results.MX?.flatrate ?? []),
    ...(results.MX?.rent ?? []),
    ...(results.MX?.buy ?? []),
  ]
  const usList = [
    ...(results.US?.flatrate ?? []),
    ...(results.US?.rent ?? []),
    ...(results.US?.buy ?? []),
  ]

  const mx = toNames(mxList)
  const us = toNames(usList)
  if (mx.length === 0 && us.length === 0) return undefined

  return { mx, us }
}

function parseTrailerEmbedUrl(videos: MovieVideosResponse | undefined): string | null {
  const results = videos?.results ?? []
  const trailer =
    results.find(
      (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official
    ) ??
    results.find((v) => v.site === 'YouTube' && v.type === 'Trailer')
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null
}

export const getMovieFullData = async (movieId: number): Promise<MovieFullData> => {
  const url = `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US&append_to_response=credits,watch/providers,videos`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Error fetching movie details')
  }

  const data: MovieDetailsResponse = await response.json()

  const watchProviders = parseWatchProviders(data['watch/providers'])
  const trailerEmbedUrl = parseTrailerEmbedUrl(data.videos)

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
    watchProviders,
    trailerEmbedUrl,
  }
}