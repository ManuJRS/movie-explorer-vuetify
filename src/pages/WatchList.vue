<script setup lang="ts">
import { onMounted } from 'vue'
import { useWatchlistStore } from '@/stores/watchlist'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const watchlistStore = useWatchlistStore()
const authStore = useAuthStore()

const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL

function getPosterUrl(path: string | null) {
  if (!path) return ''
  return `${TMDB_IMAGE_BASE_URL}${path}`
}

onMounted(async () => {
  await watchlistStore.loadWatchlist()
})
</script>

<template>
  <section class="min-h-screen px-6 py-10 text-white">
    <div class="max-w-7xl mx-auto">
      <div class="mb-10">
        <h1 class="text-3xl md:text-4xl font-bold mb-3">
          {{ t('watchlist.title') }}
        </h1>
        <p class="text-slate-400 max-w-2xl">
          {{ t('watchlist.description') }}
        </p>
      </div>

      <div
        v-if="!authStore.user"
        class="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300"
      >
        {{ t('loginPage.description') }}
      </div>

      <div
        v-else-if="watchlistStore.items.length === 0"
        class="rounded-2xl border border-white/10 bg-white/5 p-6 text-slate-300"
      >
        {{ t('watchlist.empty') }}
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <article
          v-for="item in watchlistStore.items"
          :key="item.id"
          class="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
        >
          <img
            :src="getPosterUrl(item.posterPath)"
            :alt="item.title"
            class="w-full md:h-[360px] object-cover"
          />

          <div class="p-4">
            <h2 class="text-lg font-bold line-clamp-1 mb-1">
              {{ item.title }}
            </h2>

            <p class="text-sm text-slate-400 mb-3">
              {{ item.releaseDate?.slice(0, 4) || 'N/A' }}
            </p>

            <p
              v-if="item.overview"
              class="text-sm text-slate-300 mb-3 line-clamp-3"
            >
              {{ item.overview }}
            </p>
            <div class="flex items-center justify-between gap-2">

                <button
                type="button"
                class="hover:cursor-pointer w-full rounded-xl px-4 py-2 bg-slate-700 text-white font-semibold hover:bg-slate-600 transition"
                @click="watchlistStore.removeFromWatchlist(item.id)"
                >
                {{ t('recommendations.addToShell') }}
                </button>
                <button
                type="button"
                class="hover:cursor-pointer w-full rounded-xl px-4 py-2 bg-slate-700 text-white font-semibold hover:bg-slate-600 transition"
                @click="watchlistStore.removeFromWatchlist(item.id)"
                >
                {{ t('watchlist.remove') }}
                </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>
