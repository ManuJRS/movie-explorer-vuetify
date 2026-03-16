import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth'
import { getDemoWatchlistSeed } from '@/data/demoSeed'
import type { WatchlistItem, DbWatchlistItem } from '@/types/watchlist'

const DEMO_WATCHLIST_KEY = 'movie-explorer-demo-watchlist'

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

  function persistDemoWatchlist() {
    try {
      localStorage.setItem(DEMO_WATCHLIST_KEY, JSON.stringify(items.value))
    } catch (e) {
      console.error('Error persisting demo watchlist:', e)
    }
  }

  async function loadWatchlist() {
    const auth = useAuthStore()
    if (!auth.user) {
      try {
        const raw = localStorage.getItem(DEMO_WATCHLIST_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as WatchlistItem[]
          items.value = Array.isArray(parsed) ? parsed : []
        } else {
          items.value = getDemoWatchlistSeed()
          persistDemoWatchlist()
        }
      } catch {
        items.value = getDemoWatchlistSeed()
        persistDemoWatchlist()
      }
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
    if (!auth.user) {
      const existing = items.value.find((item) => item.tmdbId === movie.id)
      if (existing) return
      const newItem: WatchlistItem = {
        id: `demo-wl-${crypto.randomUUID()}`,
        tmdbId: movie.id,
        title: movie.title,
        posterPath: movie.poster_path,
        overview: movie.overview || null,
        releaseDate: movie.release_date || null,
        voteAverage: movie.vote_average ?? 0,
        createdAt: new Date().toISOString(),
      }
      items.value = [newItem, ...items.value]
      persistDemoWatchlist()
      return
    }

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
    const auth = useAuthStore()
    if (!auth.user) {
      items.value = items.value.filter((item) => item.id !== id)
      persistDemoWatchlist()
      return
    }
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

  /** Borra los datos locales y vuelve a cargar la watchlist por defecto (seed). */
  function resetToDemoSeed() {
    try {
      localStorage.removeItem(DEMO_WATCHLIST_KEY)
      items.value = getDemoWatchlistSeed()
      persistDemoWatchlist()
    } catch (e) {
      console.error('Error resetting watchlist:', e)
    }
  }

  return {
    items,
    loadWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    resetToDemoSeed,
  }
})
