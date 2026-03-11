import { getMovieFullData } from '@/lib/tmdb'
import type { Movie } from '@/types/movie'
import { BuildPayload } from '@/types/BuildPayload'

export const buildMoviePayload = async ({
  selectedMovieId,
  title,
  year,
  image,
  platform,
  synopsis,
}: BuildPayload): Promise<Omit<Movie, 'id' | 'favorite'>> => {
  if (!selectedMovieId) {
    return {
      title: title.trim(),
      year,
      image,
      platform: platform || '',
      synopsis: synopsis || '',
    }
  }

  const fullMovieData = await getMovieFullData(selectedMovieId)

  return {
    tmdbId: selectedMovieId,
    title: fullMovieData.title,
    year: fullMovieData.year,
    image: fullMovieData.image || image,
    platform: platform || '',
    synopsis: synopsis || fullMovieData.synopsis,
    genres: fullMovieData.genres,
    runtime: fullMovieData.runtime,
    rating: fullMovieData.rating,
    directors: fullMovieData.directors,
    mainActors: fullMovieData.mainActors,
    writers: fullMovieData.writers,
  }
}