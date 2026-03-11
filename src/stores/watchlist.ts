import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import type { WatchlistItem, DbWatchlistItem } from '@/types/watchlist'

function dbToUi(m: DbWatchlistItem): WatchlistItem {
  return {
    id: m.id,
    tmdbId: m.tmdb_id,
    title: m.title,
    posterPath: m.poster_path,
    overview: m.overview,
    releaseDate: m.release_date,
    voteAverage: m.vote_average ?? 0,
    createdAt: m.created_at,
  }
}

export const useWatchlistStore = defineStore('watchlist', () => {
  const items = ref<WatchlistItem[]>([])

  async function loadWatchlist() {
    const auth = useAuthStore()
    if (!auth.user) {
      items.value = []
      return
    }

    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      items.value = (data ?? []).map((m: DbWatchlistItem) => dbToUi(m))
    } catch (error) {
      console.error('Error loading watchlist:', error)
    }
  }

  async function addToWatchlist(movie: {
    id: number
    title: string
    poster_path: string | null
    overview: string
    release_date: string
    vote_average: number
  }) {
    const auth = useAuthStore()
    if (!auth.user) throw new Error('Debes iniciar sesión para agregar a pendientes')

    const existing = items.value.find((item) => item.tmdbId === movie.id)
    if (existing) return

    try {
      const payload = {
        user_id: auth.user.id,
        tmdb_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        overview: movie.overview || null,
        release_date: movie.release_date || null,
        vote_average: movie.vote_average ?? 0,
      }

      const { data, error } = await supabase
        .from('watchlist')
        .insert(payload)
        .select('*')
        .single()

      if (error) throw error

      items.value = [dbToUi(data as DbWatchlistItem), ...items.value]
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      throw error
    }
  }

  async function removeFromWatchlist(id: string) {
    try {
      const { error } = await supabase.from('watchlist').delete().eq('id', id)
      if (error) throw error

      items.value = items.value.filter((item) => item.id !== id)
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      throw error
    }
  }

  function isInWatchlist(tmdbId: number) {
    return items.value.some((item) => item.tmdbId === tmdbId)
  }

  return {
    items,
    loadWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  }
})
