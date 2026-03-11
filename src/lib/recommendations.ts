import type { Movie } from '@/types/movie'

export type CandidateMovie = {
  id: number
  title: string
  posterUrl: string
  year: string
  overview: string
  genres: string[]
  director?: string
  actors?: string[]
  writers?: string[]
  voteAverage?: number
}

export type UserTasteProfile = {
  genres: Record<string, number>
  directors: Record<string, number>
  actors: Record<string, number>
  writers: Record<string, number>
}

export function buildFavoriteProfile(favoriteMovies: Movie[]): UserTasteProfile {
  const profile: UserTasteProfile = {
    genres: {},
    directors: {},
    actors: {},
    writers: {},
  }

  for (const movie of favoriteMovies) {
    for (const genre of movie.genres ?? []) {
      profile.genres[genre] = (profile.genres[genre] || 0) + 5
    }

    for (const director of movie.directors ?? []) {
      profile.directors[director] = (profile.directors[director] || 0) + 6
    }

    for (const actor of movie.mainActors ?? []) {
      profile.actors[actor] = (profile.actors[actor] || 0) + 3
    }

    for (const writer of movie.writers ?? []) {
      profile.writers[writer] = (profile.writers[writer] || 0) + 3
    }
  }

  return profile
}

export function scoreCandidateMovie(
  candidate: CandidateMovie,
  profile: UserTasteProfile
) {
  let score = 0

  for (const genre of candidate.genres ?? []) {
    score += profile.genres[genre] || 0
  }

  if (candidate.director) {
    score += (profile.directors[candidate.director] || 0) * 2
  }

  for (const actor of candidate.actors ?? []) {
    score += profile.actors[actor] || 0
  }

  for (const writer of candidate.writers ?? []) {
    score += profile.writers[writer] || 0
  }

  if ((candidate.voteAverage ?? 0) >= 7.5) {
    score += 4
  }

  return score
}

export function getRecommendations(params: {
  allUserMovies: Movie[]
  candidateMovies: CandidateMovie[]
  limit?: number
}) {
  const { allUserMovies, candidateMovies, limit = 12 } = params

  const favoriteMovies = allUserMovies.filter(movie => movie.favorite)

  const profile = buildFavoriteProfile(favoriteMovies)

  const savedTmdbIds = new Set(
    allUserMovies
      .map(movie => movie.tmdbId)
      .filter((id): id is number => typeof id === 'number')
  )

  const scoredMovies = candidateMovies
    .filter(movie => !savedTmdbIds.has(movie.id))
    .map(movie => ({
      ...movie,
      recommendationScore: scoreCandidateMovie(movie, profile),
    }))
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit)

  return scoredMovies
}