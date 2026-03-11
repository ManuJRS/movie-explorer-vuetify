export interface Movie {
  id: string
  title: string
  year: string
  image: string
  platform: string
  synopsis: string
  tmdbId?: number
  genres?: string[]
  runtime?: number | null
  rating?: number
  directors?: string[]
  mainActors?: string[]
  writers?: string[]
  metadata?: MovieMetadata
  favorite: boolean
}

export interface MovieMetadata {
  genres?: string[]
  director?: string
  actors?: string[]
  writers?: string[]
  voteAverage?: number
}

export type DbMovie = {
  id: string
  user_id: string
  title: string
  year: number
  poster_url: string | null
  platform: string | null
  synopsis: string | null
  tmdb_details?: {
    tmdb_id?: number
    genres?: string[]
    runtime?: number | null
    rating?: number
    directors?: string[]
    mainActors?: string[]
    writers?: string[]
  } | null
  created_at: string
  favorite: boolean
}
