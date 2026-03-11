<!-- src/views/UpdatePasswordView.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useI18n } from 'vue-i18n'
import InteractiveHoverButton from '@/components/shared/InteractiveHoverButton.vue'

const { t } = useI18n() 
const router = useRouter()

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const ready = ref(false)

const message = ref('')
const errorMsg = ref('')

onMounted(async () => {
  const hash = window.location.hash
  if (hash) {
    const params = new URLSearchParams(hash.replace(/^#/, ''))
    const access_token = params.get('access_token')
    const refresh_token = params.get('refresh_token')
    if (access_token && refresh_token) {
      const { error } = await supabase.auth.setSession({ access_token, refresh_token })
      if (error) {
        errorMsg.value = error.message ?? 'No se pudo restaurar la sesión. Usa el enlace más reciente del correo.'
        ready.value = true
        return
      }
      // Limpiar el hash de la URL por seguridad
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }

  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    errorMsg.value = 'No hay sesión activa. Abre el enlace que te enviamos por correo para restablecer tu contraseña.'
  }
  ready.value = true
})

const handleUpdatePassword = async () => {
  message.value = ''
  errorMsg.value = ''

  if (password.value.length < 8) {
    errorMsg.value = 'The password must be at least 8 characters long.'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match.'
    return
  }

  loading.value = true
  try {
    const { error } = await supabase.auth.updateUser({ password: password.value })
    if (error) throw error

    message.value = 'Password updated. Now sign in.'
    await supabase.auth.signOut()
    setTimeout(() => router.push('/login'), 900)
  } catch (err: any) {
    errorMsg.value =
      err?.message ??
      'Could not update the password. Make sure you opened the most recent link from the email.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="bg-background-dark text-slate-100 min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6"
  >
    <main class="z-10 w-full max-w-[480px]">
      <div class="glass p-8 md:p-10 rounded-2xl relative overflow-hidden">
        <div
          class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          aria-hidden="true"
        />
        <header class="mb-8 text-center">
          <h2 class="text-3xl font-bold mb-2 text-white">{{ t('updatePasswordPage.title') }}</h2>
          <p class="text-slate-400">{{ t('updatePasswordPage.description') }}</p>
        </header>

        <p v-if="!ready" class="text-sm text-slate-400 text-center">{{ t('updatePasswordPage.loading') }}</p>

        <form v-else class="space-y-5" @submit.prevent="handleUpdatePassword">
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">{{ t('updatePasswordPage.newPassword') }}</label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-3.5 text-slate-500 text-xl group-focus-within:text-primary transition-colors pointer-events-none"
                aria-hidden="true"
              >
                lock
              </span>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-12 py-3.5 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                @click="showPassword = !showPassword"
              >
                <span class="material-symbols-outlined text-xl">
                  {{ showPassword ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">{{ t('updatePasswordPage.confirmPassword') }}</label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-3.5 text-slate-500 text-xl group-focus-within:text-primary transition-colors pointer-events-none"
                aria-hidden="true"
              >
                lock
              </span>
              <input
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-12 py-3.5 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                :aria-label="showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <span class="material-symbols-outlined text-xl">
                  {{ showConfirmPassword ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
          </div>

          <p v-if="message" class="text-sm text-emerald-400">{{ message }}</p>
          <p v-if="errorMsg" class="text-sm text-red-400">{{ errorMsg }}</p>
          <!-- <button
            type="submit"
            class="w-full mt-6 hover:cursor-pointer bg-blue-600 hover:shadow-[0_0_20px_rgba(17,82,212,0.4)] text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            :disabled="loading"
          >
            <span>{{ loading ? t('updatePasswordPage.loading') : t('updatePasswordPage.updatePassword') }}</span>
            <span
              v-if="!loading"
              class="material-symbols-outlined group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            >
              arrow_forward
            </span>
          </button> -->
          <InteractiveHoverButton
            type="submit"
            :disabled="loading"
            class="w-full mt-6 hover:cursor-pointer text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            :text="loading ? t('updatePasswordPage.loading') : t('updatePasswordPage.updatePassword')"
            variant="common"
          />
        </form>
      </div>
    </main>
  </div>
</template>