<script setup lang="ts">
import { ref, watch } from 'vue'
import { searchMoviesByTitle, type MoviePosterResult } from '@/lib/tmdb'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'select-movie', movie: MoviePosterResult): void
}>()

const search = ref('')
const results = ref<MoviePosterResult[]>([])
const loading = ref(false)
const error = ref('')
const showResults = ref(false)

let debounceTimeout: ReturnType<typeof setTimeout> | null = null

watch(search, (newValue) => {
  error.value = ''

  if (debounceTimeout) clearTimeout(debounceTimeout)

  if (!newValue.trim()) {
    results.value = []
    showResults.value = false
    return
  }

  debounceTimeout = setTimeout(async () => {
    try {
      loading.value = true
      const movies = await searchMoviesByTitle(newValue)
      results.value = movies
      showResults.value = true
    } catch (err) {
      error.value = 'Could not load movie posters'
      results.value = []
    } finally {
      loading.value = false
    }
  }, 500)
})

const handleSelectMovie = (movie: MoviePosterResult) => {
  emit('select-movie', movie)
  search.value = `${movie.title}${movie.year ? ` (${movie.year})` : ''}`
  showResults.value = false
}
</script>

<template>
  <div class="relative w-full">
    <label class="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
      {{ t('moviePosterSearch.title') }}
    </label>

    <input
      v-model="search"
      type="text"
      :placeholder="t('moviePosterSearch.placeholder')"
      class="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none"
    />

    <div
      v-if="loading"
      class="mt-2 text-xs text-slate-400"
    >
      {{ t('moviePosterSearch.searching') }}
    </div>

    <div
      v-if="error"
      class="mt-2 text-xs text-red-400"
    >
      {{ error }}
    </div>

    <div
      v-if="showResults && results.length"
      class="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-white/10 bg-zinc-900 shadow-xl"
    >
      <button
        v-for="movie in results"
        :key="movie.id"
        type="button"
        @click="handleSelectMovie(movie)"
        class="flex w-full items-center gap-3 border-b border-white/5 px-3 py-3 text-left transition hover:bg-white/5"
      >
        <img
          v-if="movie.posterUrl"
          :src="movie.posterUrl"
          :alt="movie.title"
          class="h-16 w-12 rounded object-cover"
        />

        <div
          v-else
          class="flex h-16 w-12 items-center justify-center rounded bg-white/5 text-[10px] text-slate-400"
        >
          {{ t('moviePosterSearch.noImage') }}
        </div>

        <div>
          <p class="text-sm font-semibold text-white">
            {{ movie.title }}
          </p>
          <p class="text-xs text-slate-400">
            {{ movie.year || t('moviePosterSearch.unknownYear') }}
          </p>
        </div>
      </button>
    </div>
  </div>
</template>