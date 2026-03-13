<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useMoviesStore } from '@/stores/movies'
import { useAuthStore } from '@/stores/auth'
import { useRecommendations } from '@/composables/useRecommendations'
import MovieDetailModal from '@/components/shared/MovieDetailModal.vue'
import MoviesCounter from '@/components/shared/MoviesCounter.vue'
import BaseTabs from '@/components/ui/BaseTabs.vue'
import FavoriteComponent from '@/components/favorites/FavoriteComponent.vue'
import StadsFavs from '@/components/favorites/StadsFavs.vue'
import type { Movie } from '@/types/movie'
import { useI18n } from 'vue-i18n'
import { buildFavoriteProfile } from '@/lib/recommendations'
import PageLoader from '@/components/ui/PageLoader.vue'
import { getMovieFullData } from '@/lib/tmdb'

const { t } = useI18n()
const moviesStore = useMoviesStore()
const authStore = useAuthStore()
const { movies } = storeToRefs(moviesStore)
const { getRecommendations } = useRecommendations()

const loading = ref(true)
const loadingDetail = ref(false)
const showMovieDetailModal = ref(false)
const selectedMovie = ref<Movie | null>(null)

const favoriteMovies = computed(() =>
  movies.value.filter((m) => m.favorite === true)
)

const selectedTab = ref('Favorites')
const tabOptions = computed(() => [
  { value: 'Favorites', label: t('favorites.tabFavorites') },
  { value: 'statistics', label: t('favorites.tabStatistics') },
])

async function openMovieDetail(movie: Movie) {
  if (movie.tmdbId) {
    loadingDetail.value = true
    try {
      const full = await getMovieFullData(movie.tmdbId)
      selectedMovie.value = {
        ...movie,
        watchProviders: full.watchProviders,
        trailerEmbedUrl: full.trailerEmbedUrl,
      }
      showMovieDetailModal.value = true
    } catch {
      selectedMovie.value = movie
      showMovieDetailModal.value = true
    } finally {
      loadingDetail.value = false
    }
  } else {
    selectedMovie.value = movie
    showMovieDetailModal.value = true
  }
}

onMounted(async () => {
  try {
    if (!movies.value.length) {
      await moviesStore.loadMovies()
    }
    const favorites = movies.value.filter((m) => m.favorite === true)
    if (favorites.length) {
      const profile = buildFavoriteProfile(favorites)
      console.group('[Favoritas] Perfil de gusto')
      console.log('Películas favoritas:', favorites.length)
      console.log('Perfil (géneros, directores, actores, guionistas):', profile)
      console.groupEnd()
    }
    await getRecommendations()
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <PageLoader v-if="loading" />
  <main class="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <div class="mb-8 text-left">
      <h1 class="text-2xl md:text-3xl font-bold text-white">
        {{ t('favorites.title') }}
      </h1>
      <p class="text-slate-400 mt-2">
        {{ t('favorites.description') }}
      </p>
    </div>
    <div class="flex justify-between items-center mb-8">
      <BaseTabs
          v-model="selectedTab"
          :options="tabOptions"
      />
      <div v-if="selectedTab === 'Favorites'" class="flex justify-end text-right">
          <MoviesCounter
          class="text-right"
          :count="favoriteMovies.length"
          :label="t('favorites.counterLabel')"
        />
      </div>
    </div>
    <FavoriteComponent
      v-if="selectedTab === 'Favorites'"
      @open-detail="openMovieDetail"
    />
    <StadsFavs v-else-if="selectedTab === 'statistics'" />
    <MovieDetailModal
      v-model:open="showMovieDetailModal"
      :movie="selectedMovie ?? undefined"
    />
  </main>
</template>
