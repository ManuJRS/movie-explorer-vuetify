import { defineStore } from 'pinia'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { SignUpInput, SignInInput } from '@/types/auth'

// Promesa compartida para evitar múltiples inits simultáneos (race condition).
let initPromise: Promise<void> | null = null
// Referencia al unsubscribe del listener para evitar múltiples listeners y memory leaks.
let authUnsubscribe: (() => void) | undefined

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
      if (initPromise) return initPromise

      initPromise = (async () => {
        try {
          const { data: sessionData } = await supabase.auth.getSession()
          this.user = sessionData.session?.user ?? null
          const changeResult = supabase.auth.onAuthStateChange((_event, session) => {
            this.user = session?.user ?? null
          })
          const sub = (changeResult as { data?: { subscription?: { unsubscribe: () => void } } })?.data?.subscription
          authUnsubscribe = typeof sub?.unsubscribe === 'function' ? sub.unsubscribe : undefined
        } catch {
          this.user = null
        }
        this._sessionRestored = true
      })()

      await initPromise
    },

    /** Sincroniza el estado del store con la sesión actual de Supabase (p. ej. tras setSession en otra vista). */
    async syncSession() {
      const { data } = await supabase.auth.getSession()
      this.user = data.session?.user ?? null
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
