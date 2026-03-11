<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMoviesStore } from '@/stores/movies'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import MovieCard from '@/components/favorites/MovieCard.vue'
import type { TMDbMovie } from '@/composables/useRecommendations'
import type { Movie } from '@/types/movie'

const moviesStore = useMoviesStore()
const authStore = useAuthStore()
const { movies } = storeToRefs(moviesStore)
const { t } = useI18n()

const favoriteMovies = computed(() =>
  movies.value.filter((m) => m.favorite === true)
)
const loading = ref(false)

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
    <div
      v-if="!authStore.user"
      class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400"
    >
      {{ t('loginPage.description') }}
    </div>

    <div v-else-if="loading" class="text-slate-400">
      {{ t('favorites.loading') }}
    </div>

    <div
      v-else-if="favoriteMovies.length"
      class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2"
    >
      <MovieCard
        v-for="movie in favoriteMovies"
        :key="movie.id"
        :movie="movie"
        full-width
        @open-detail="openMovieDetail"
      />
    </div>

    <div
      v-else
      class="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400"
    >
      {{ t('favorites.empty') }}
    </div>
</template>