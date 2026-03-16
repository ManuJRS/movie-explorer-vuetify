<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMoviesStore } from '@/stores/movies'
import { useI18n } from 'vue-i18n'
import MovieCard from '@/components/favorites/MovieCard.vue'
import Paginator from '@/components/shared/Paginator.vue'
import type { TMDbMovie } from '@/composables/useRecommendations'
import type { Movie } from '@/types/movie'

const ITEMS_PER_PAGE = 12

const moviesStore = useMoviesStore()
const { movies } = storeToRefs(moviesStore)
const { t } = useI18n()

const favoriteMovies = computed(() =>
  movies.value.filter((m) => m.favorite === true)
)

const currentPage = ref(1)
const totalPages = computed(() =>
  Math.max(1, Math.ceil(favoriteMovies.value.length / ITEMS_PER_PAGE))
)
const paginatedFavorites = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return favoriteMovies.value.slice(start, start + ITEMS_PER_PAGE)
})

const loading = ref(false)

watch(totalPages, (total) => {
  if (currentPage.value > total) currentPage.value = 1
})

const emit = defineEmits<{
  (e: 'open-detail', movie: Movie): void
}>()

onMounted(async () => {
  loading.value = true
  try {
    if (!movies.value.length) {
      await moviesStore.loadMovies()
    }
  } finally {
    loading.value = false
  }
})

function openMovieDetail(movie: Movie | TMDbMovie) {
  emit('open-detail', movie as Movie)
}
</script>

<template>
    <div v-if="loading" class="text-slate-400">
      {{ t('favorites.loading') }}
    </div>

    <div
      v-else-if="favoriteMovies.length"
      class="space-y-6"
    >
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        <MovieCard
          v-for="movie in paginatedFavorites"
          :key="movie.id"
          :movie="movie"
          full-width
          @open-detail="openMovieDetail"
        />
      </div>
      <Paginator
        v-if="totalPages > 1"
        v-model:current-page="currentPage"
        :total-pages="totalPages"
        class="mt-8"
      />
    </div>

    <div
      v-else
      class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400"
    >
      {{ t('favorites.empty') }}
    </div>
</template>