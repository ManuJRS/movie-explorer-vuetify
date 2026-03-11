<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import InteractiveHoverButton from '@/components/shared/InteractiveHoverButton.vue'
import PageLoader from '@/components/ui/PageLoader.vue'

const isLoading = ref(true)

onMounted(async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1800))
  } finally {
    isLoading.value = false
  }
})
const router = useRouter()
const auth = useAuthStore()
const mode = ref<'login' | 'register'>('login')
const { t } = useI18n()

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  wantsEmailNotifications: false,
})

const errorMsg = ref<string | null>(null)

function getAuthErrorKey(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login') || m.includes('invalid credentials')) return 'invalidCredentials'
  if (m.includes('email not confirmed')) return 'emailNotConfirmed'
  if (m.includes('already registered') || m.includes('already exists')) return 'userAlreadyRegistered'
  if (m.includes('at least 6') || m.includes('valid password') || m.includes('password should')) return 'weakPassword'
  if (m.includes('invalid email') || m.includes('valid email') || m.includes('invalid format')) return 'invalidEmail'
  return 'generic'
}

const translatedAuthError = computed(() => {
  if (!auth.error) return null
  const key = getAuthErrorKey(auth.error)
  return t(`loginPage.errors.${key}`)
})

async function submit() {
  errorMsg.value = null

  try {
    if (mode.value === 'register') {
      if (form.password !== form.confirmPassword) {
        errorMsg.value = t('loginPage.errors.passwordsDoNotMatch')
        return
      }

      await auth.signUp({
        email: form.email,
        password: form.password,
        username: form.username,
        wantsEmailNotifications: form.wantsEmailNotifications,
      })
      router.push({ name: 'confirm-email' })
    } else {
      await auth.signIn({
        email: form.email,
        password: form.password,
      })
      router.push({ name: 'movies' })
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    const key = getAuthErrorKey(message)
    errorMsg.value = t(`loginPage.errors.${key}`)
  }
}
</script>
<template>
  <PageLoader v-if="isLoading" />
  <div
    class="bg-background-dark text-slate-100 min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6"
  >
    <main class="z-10 w-full max-w-[480px]">
      <div class="mt-20 glass p-8 md:p-10 rounded-2xl relative overflow-hidden">
        <div
          class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          aria-hidden="true"
        />
        <header class="mb-8 text-center">
          <h2 class="text-3xl font-bold mb-2 text-white">
            {{ mode === 'login' ? t('loginPage.title') : t('loginPage.titleRegister') }}
          </h2>
          <p class="text-slate-400">
            {{ mode === 'login' ? t('loginPage.description') : t('loginPage.descriptionRegister') }}
          </p>
        </header>

        <form class="space-y-5" @submit.prevent="submit">
          <div v-if="mode === 'register'" class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">{{ t('loginPage.username') }}</label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-3.5 text-slate-500 text-xl group-focus-within:text-primary transition-colors"
                aria-hidden="true"
              >
                person
              </span>
              <input
                v-model="form.username"
                type="text"
                class="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-slate-600"
                :placeholder="t('loginPage.usernamePlaceholder')"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">{{ t('loginPage.email') }}</label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-3.5 text-slate-500 text-xl group-focus-within:text-primary transition-colors"
                aria-hidden="true"
              >
                mail
              </span>
              <input
                v-model="form.email"
                type="email"
                class="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-slate-600"
                :placeholder="t('loginPage.emailPlaceholder')"
                required
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">{{ t('loginPage.password') }}</label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-3.5 text-slate-500 text-xl group-focus-within:text-primary transition-colors"
                aria-hidden="true"
              >
                lock
              </span>
              <input
                v-model="form.password"
                type="password"
                class="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div v-if="mode === 'register'" class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">{{ t('loginPage.confirmPassword') }}</label>
            <div class="relative group">
              <span
                class="material-symbols-outlined absolute left-4 top-3.5 text-slate-500 text-xl group-focus-within:text-primary transition-colors"
                aria-hidden="true"
              >
                lock
              </span>
              <input
                v-model="form.confirmPassword"
                type="password"
                class="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3.5 text-white focus:border-primary/50 focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all placeholder:text-slate-600"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <label
            v-if="mode === 'register'"
            class="flex items-center gap-2 text-sm text-slate-400 cursor-pointer"
          >
            <input
              v-model="form.wantsEmailNotifications"
              type="checkbox"
              class="rounded border-white/20 bg-white/5 text-primary focus:ring-primary/20"
            />
             {{ t('loginPage.ReceiveEmail') }}
          </label>

          <p v-if="errorMsg" class="text-sm text-red-400">{{ errorMsg }}</p>
          <p v-else-if="translatedAuthError" class="text-sm text-red-400">{{ translatedAuthError }}</p>

          <!-- <button
            type="submit"
            class="w-full mt-6 hover:cursor-pointer bg-blue-600 hover:shadow-[0_0_20px_rgba(17,82,212,0.4)] text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            :disabled="auth.loading"
          >
            <span>{{ auth.loading ? 'Loading...' : (mode === 'login' ? t('loginPage.btnLogin') : t('loginPage.btnCreateAccount')) }}</span>
            <span
              v-if="!auth.loading"
              class="material-symbols-outlined group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            >
              arrow_forward
            </span>
          </button> -->

          <InteractiveHoverButton
            type="submit"
            :disabled="auth.loading"
            class="w-full mt-6 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            variant="common"
            :text="auth.loading ? 'Loading...' : (mode === 'login' ? t('loginPage.btnLogin') : t('loginPage.btnCreateAccount'))"
          />
          <router-link to="/forgot-password" class="text-xs underline text-center block mt-4">
              {{ t('loginPage.btnForgotPassword') }}
          </router-link>
        </form>

        <footer class="mt-8 pt-8 border-t border-white/5 text-center">
          <p class="text-slate-400 text-sm">
            {{ mode === 'login' ? t('loginPage.textRegister') : t('loginPage.alreadyHaveAccount') }}
            <button
              type="button"
              class="hover:cursor-pointer text-primary font-semibold hover:text-blue-400 transition-colors ml-1 focus:outline-none focus:underline"
              @click="mode = mode === 'login' ? 'register' : 'login'"
            >
              {{ mode === 'login' ? t('loginPage.btnRegister') : t('loginPage.btnLogin') }}
            </button>
          </p>
        </footer>
      </div>

      <p class="mt-8 text-center text-slate-500 text-xs px-4 leading-relaxed">
        {{ t('policyPage.textTerms') }} 
        <a href="#" class="underline hover:text-slate-300 transition-colors">{{ t('policyPage.textTermsLink') }}</a>
        {{ t('policyPage.textPrivacy') }}
        <a href="#" class="underline hover:text-slate-300 transition-colors">{{ t('policyPage.textPrivacyLink') }}</a>.
      </p>
    </main>
  </div>
</template>
