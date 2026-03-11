import type { Movie, MovieMetadata } from '@/types/movie'

type DbMovie = {
  id: string
  user_id: string
  title: string
  year: number
  poster_url: string | null
  platform: string | null
  synopsis: string | null
  favorite: boolean | null
  tmdb_id: number | null
  metadata: MovieMetadata | null
  created_at: string
}

export function mapDbMovieToMovie(dbMovie: DbMovie): Movie {
  return {
    id: dbMovie.id,
    title: dbMovie.title,
    year: String(dbMovie.year),
    image: dbMovie.poster_url ?? '',
    platform: dbMovie.platform ?? '',
    synopsis: dbMovie.synopsis ?? '',
    favorite: dbMovie.favorite ?? false,
    ...(dbMovie.tmdb_id != null && { tmdbId: dbMovie.tmdb_id }),
    ...(dbMovie.metadata && { metadata: dbMovie.metadata }),
  }
}