export interface WatchlistItem {
  id: string
  tmdbId: number
  title: string
  posterPath: string | null
  overview: string | null
  releaseDate: string | null
  voteAverage: number
  createdAt: string
}

export type DbWatchlistItem = {
  id: string
  user_id: string
  tmdb_id: number
  title: string
  poster_path: string | null
  overview: string | null
  release_date: string | null
  vote_average: number
  created_at: string
}
