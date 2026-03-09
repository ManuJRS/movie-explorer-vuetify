<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { useI18n } from 'vue-i18n'
import InteractiveHoverButton from '@/components/InteractiveHoverButton.vue'
import PageLoader from '@/components/ui/PageLoader.vue'

const isLoading = ref(true)

onMounted(async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1800))
  } finally {
    isLoading.value = false
  }
})
const email = ref('')
const loading = ref(false)
const message = ref('')
const errorMsg = ref('')
const { t } = useI18n()

const handleSendRecovery = async () => {
  loading.value = true
  message.value = ''
  errorMsg.value = ''

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) throw error

    message.value =
      'Listo. Si ese correo existe, te llegará un enlace para restablecer tu contraseña.'
  } catch (err: any) {
    errorMsg.value = err?.message ?? 'Ocurrió un error enviando el correo.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <PageLoader v-if="isLoading" />
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
          <h2 class="text-3xl font-bold mb-2 text-white">{{ t('forgetPasswordPage.title') }}</h2>
          <p class="text-slate-400">
            {{ t('forgetPasswordPage.description') }}
          </p>
        </header>

        <form class="space-y-5" @submit.prevent="handleSendRecovery">
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Email</label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-3.5 text-slate-500 text-xl group-focus-within:text-primary transition-colors"
                aria-hidden="true"
              >
                mail
              </span>
              <input
                v-model="email"
                type="email"
                class="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-slate-600"
                :placeholder="t('loginPage.emailPlaceholder')"
                required
              />
            </div>
          </div>

          <p v-if="message" class="text-sm text-emerald-400">{{ message }}</p>
          <p v-if="errorMsg" class="text-sm text-red-400">{{ errorMsg }}</p>

          <!-- <button
            type="submit"
            class="w-full mt-6 hover:cursor-pointer bg-blue-600 hover:shadow-[0_0_20px_rgba(17,82,212,0.4)] text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            :disabled="loading || !email"
          >
            <span>{{ loading ? t('forgetPasswordPage.sending') : t('forgetPasswordPage.btnSendLink') }}</span>
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
            :disabled="loading || !email"
            class="w-full mt-6 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            variant="common"
            :text="loading ? t('forgetPasswordPage.sending') : t('forgetPasswordPage.btnSendLink')"
          />
        </form>
      </div>
    </main>
  </div>
</template>