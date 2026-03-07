import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface SignUpInput {
  email: string
  password: string
  username?: string
  wantsEmailNotifications?: boolean
}

interface SignInInput {
  email: string
  password: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null,
    _sessionRestored: false,
  }),
  actions: {
    async init() {
      if (this._sessionRestored) return
      const { data } = await supabase.auth.getSession()
      this.user = data.session?.user ?? null
      this._sessionRestored = true

      supabase.auth.onAuthStateChange((_event, session) => {
        this.user = session?.user ?? null
      })
    },

    async signUp({ email, password, username, wantsEmailNotifications }: SignUpInput) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
              wants_email_notifications: wantsEmailNotifications ?? false,
            },
          },
        })
        if (error) throw error
        this.user = data.user
        return data
      } catch (e) {
        this.error = e instanceof Error ? e.message : String(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async signIn({ email, password }: SignInInput) {
      this.loading = true
      this.error = null
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        this.user = data.user
        return data
      } catch (e) {
        this.error = e instanceof Error ? e.message : String(e)
        throw e
      } finally {
        this.loading = false
      }
    },

    async signOut() {
      await supabase.auth.signOut()
      this.user = null
    },
  },
})
