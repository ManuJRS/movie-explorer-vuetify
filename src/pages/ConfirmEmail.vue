<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const router = useRouter()

function goToMovies() {
  router.push({ name: 'movies' })
}

function goToLogin() {
  router.push({ name: 'login' })
}
</script>

<template>
  <div
    class="bg-background-dark text-slate-100 min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-6"
  >
    <main class="z-10 w-full max-w-[480px]">
      <div class="glass p-8 md:p-10 rounded-2xl relative overflow-hidden text-center border border-black/10 dark:border-white/10">
        <div
          class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          aria-hidden="true"
        />
        <div
          class="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6"
          aria-hidden="true"
        >
          <span class="material-symbols-outlined text-primary text-4xl">mail</span>
        </div>
        <h2 class="text-2xl font-bold mb-2 text-white">{{ t('confirmEmailPage.title') }}</h2>
        <p class="text-slate-400 mb-8">
          {{ t('confirmEmailPage.description') }}
        </p>
        <div class="space-y-3">
          <!-- <button
            type="button"
            class="w-full mt-6 hover:cursor-pointer bg-blue-600 hover:shadow-[0_0_20px_rgba(17,82,212,0.4)] text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            @click="goToMovies"
          >
            <span>Go to My Movies</span>
            <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button> -->
          <button
            type="button"
            class="w-full py-3 text-slate-400 hover:text-white transition-colors text-sm hover:cursor-pointer"
            @click="goToLogin"
          >
            {{ t('confirmEmailPage.btnBackToLogin') }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
