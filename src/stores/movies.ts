import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'

export interface Movie {
  id: string
  title: string
  year: string
  image: string
  platform: string
  synopsis: string
}

type DbMovie = {
  id: string
  user_id: string
  title: string
  year: number
  poster_url: string | null
  platform: string | null
  synopsis: string | null
  created_at: string
}

function dbToUi(m: DbMovie): Movie {
  return {
    id: m.id,
    title: m.title,
    year: String(m.year),
    image: m.poster_url ?? '',
    platform: m.platform ?? '',
    synopsis: m.synopsis ?? '',
  }
}

export const useMoviesStore = defineStore('movies', () => {
  const movies = ref<Movie[]>([])

  async function loadMovies() {
    const auth = useAuthStore()
    if (!auth.user) {
      movies.value = []
      return
    }
  
    try {
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false })
  
      if (error) throw error
  
      movies.value = (data ?? []).map((m: any) => ({
        id: m.id,
        title: m.title,
        year: String(m.year),
        image: m.poster_url ?? '',
        platform: m.platform ?? '',
        synopsis: m.synopsis ?? '',
      }))
    } catch (error) {
      console.error('Error loading movies:', error)
    }
  }

  async function addMovie(movie: Omit<Movie, 'id'>) {
    const auth = useAuthStore()
    if (!auth.user) throw new Error('Not authenticated')
        console.log('PAYLOAD MOVIE:', movie)
    try {
      const { data, error } = await supabase
        .from('movies') 
        .insert({
          user_id: auth.user.id,
          title: movie.title.trim(),
          year: Number(movie.year),
          poster_url: movie.image?.trim() || null,
          platform: movie.platform || null,
          synopsis: movie.synopsis || null,
        })
        .select('*')
        .single()
  
      if (error) throw error
  
      movies.value.unshift({
        id: data.id,
        title: data.title,
        year: String(data.year),
        image: data.poster_url ?? '',
        platform: data.platform ?? '',
        synopsis: data.synopsis ?? '',
      })
    } catch (error) {
      console.error('Error adding movie:', error)
      throw error
    }
  }

  async function updateMovie(movie: Movie) {
    try {
      const { error } = await supabase
        .from('movies')
        .update({
          title: movie.title.trim(),
          year: Number(movie.year),
          poster_url: movie.image?.trim() || null,
          platform: movie.platform || null,
          synopsis: movie.synopsis || null,
        })
        .eq('id', movie.id)

      if (error) throw error

      const idx = movies.value.findIndex(m => m.id === movie.id)
      if (idx !== -1) {
        movies.value = [...movies.value.slice(0, idx), movie, ...movies.value.slice(idx + 1)]
      }
    } catch (error) {
      console.error('Error updating movie:', error)
      throw error
    }
  }

  async function deleteMovie(id: string) {
    try {
      const { error } = await supabase.from('movies').delete().eq('id', id)
      if (error) throw error

      movies.value = movies.value.filter(movie => movie.id !== id)
    } catch (error) {
      console.error('Error deleting movie:', error)
      throw error
    }
  }

  function resetMovies() {
    movies.value = []
  }

  return {
    movies,
    loadMovies,
    addMovie,
    updateMovie,
    deleteMovie,
    resetMovies,
  }
})