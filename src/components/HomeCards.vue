<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section class="py-12 md:py-24 max-w-7xl mx-auto px-6">
    <div class="text-center mb-8">
      <h2 class="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
        {{t('homeCards.title')}}
      </h2>
      <div class="h-1.5 w-24 bg-primary mx-auto rounded-full" aria-hidden="true" />
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <article
        class="glass p-8 md:p-10 rounded-2xl border border-black/10 dark:border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300 group"
      >
        <div
          class="bg-primary/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
          aria-hidden="true"
        >
          <span class="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
        </div>
        <h3 class="text-xl font-bold mb-3 text-slate-900 dark:text-white">{{t('homeCards.createAccount')}}</h3>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
          {{t('homeCards.createAccountDescription')}}
        </p>
      </article>
      <article
        class="glass p-8 md:p-10 rounded-2xl border border-black/10 dark:border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300 group"
      >
        <div
          class="bg-primary/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
          aria-hidden="true"
        >
          <span class="material-symbols-outlined text-primary text-3xl">movie</span>
        </div>
        <h3 class="text-xl font-bold mb-3 text-slate-900 dark:text-white">{{t('homeCards.saveMovies')}}</h3>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
          {{t('homeCards.saveMoviesDescription')}}
        </p>
      </article>
      <article
        class="glass p-8 md:p-10 rounded-2xl border border-black/10 dark:border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300 group"
      >
        <div
          class="bg-primary/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
          aria-hidden="true"
        >
          <span class="material-symbols-outlined text-primary text-3xl">cloud_sync</span>
        </div>
        <h3 class="text-xl font-bold mb-3 text-slate-900 dark:text-white">{{t('homeCards.AccesYourCollection')}}</h3>
        <p class="text-slate-600 dark:text-slate-400 leading-relaxed text-sm md:text-base">
          {{t('homeCards.AccesYourCollectionDescription')}}
        </p>
      </article>
    </div>
  </section>
</template>