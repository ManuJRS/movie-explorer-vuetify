<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AddMovieForm from '@/components/movies/AddMovieForm.vue'
import MovieCard from '@/components/favorites/MovieCard.vue'
import MovieDetailModal from '@/components/shared/MovieDetailModal.vue'
import MoviesCounter from '@/components/shared/MoviesCounter.vue'
import FloatingActionMenu from '@/components/movies/FloatingActionMenu.vue'
import Paginator from '@/components/shared/Paginator.vue'
import TitleIntro from '@/components/movies/TitleIntro.vue'
import PageLoader from '@/components/ui/PageLoader.vue'
import { useMoviesPage } from '@/composables/useMoviesPage'
import { useMoviesStore } from '@/stores/movies'
import { getMovieFullData } from '@/lib/tmdb'
import { useI18n } from 'vue-i18n'
import type { Movie } from '@/types/movie'
import type { TMDbMovie } from '@/composables/useRecommendations'

const { t } = useI18n()
const {
  user,
  isMobile,
  isLoading,
  showMovieDetailModal,
  selectedMovie,
  addMovieFormRef,
  searchQuery,
  currentPage,
  totalPages,
  paginatedMovies,
  openMovieDetail,
  openAddMovieModal,
} = useMoviesPage()

const moviesStore = useMoviesStore()
const loadingDetail = ref(false)
const resettingFromJson = ref(false)

async function restoreDefaultMovies() {
  resettingFromJson.value = true
  try {
    await moviesStore.resetToDemoFromJson()
  } finally {
    resettingFromJson.value = false
  }
}

async function openDetail(movie: Movie | TMDbMovie) {
  const movieWithTmdb = movie as Movie
  if (typeof movieWithTmdb.tmdbId === 'number') {
    loadingDetail.value = true
    try {
      const full = await getMovieFullData(movieWithTmdb.tmdbId)
      selectedMovie.value = {
        ...movieWithTmdb,
        watchProviders: full.watchProviders,
        trailerEmbedUrl: full.trailerEmbedUrl,
      }
      showMovieDetailModal.value = true
    } catch {
      openMovieDetail(movie)
    } finally {
      loadingDetail.value = false
    }
  } else {
    openMovieDetail(movie)
  }
}

onMounted(async () => {
  try {
    await moviesStore.loadMovies()
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <PageLoader v-if="isLoading" />

  <main class="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div v-if="!user && moviesStore.movies.length === 0" class="max-w-md mx-auto text-center py-16">
      <p class="text-slate-600 dark:text-slate-300 mb-4">Log in to save and manage your movies.</p>
      <router-link
        to="/login"
        class="inline-block px-6 py-3 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold"
      >
        Go to Login
      </router-link>
    </div>

    <div v-else class="flex flex-col min-w-0 md:flex-row flex-wrap gap-6">
      <div class="w-full md:w-1/3 lg:max-w-md">
        <AddMovieForm ref="addMovieFormRef" />
      </div>

      <div class="flex-1 min-w-0 flex flex-col gap-4 relative z-10">
        <div class="justify-center items-center w-full">
          <TitleIntro v-model:search="searchQuery" />

          <div class="flex items-center md:justify-between w-full flex-wrap gap-2">
            <div class="flex items-center gap-4">
            </div>

            <div class="flex items-center gap-3">
              <MoviesCounter />
              <button
                type="button"
                class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-50"
                :disabled="resettingFromJson"
                @click="restoreDefaultMovies"
              >
              <span class="material-symbols-outlined">restore_page</span>
                {{ resettingFromJson ? t('demo.restoring') : t('demo.restoreDefaultList') }}
              </button>
            </div>
          </div>
        </div>
       
        <div class="flex flex-wrap">
          <MovieCard
            v-for="movie in paginatedMovies"
            :key="movie.id"
            :movie="movie"
            @open-detail="openDetail"
          />
        </div>
        <Paginator
          v-if="totalPages > 1"
          :total-pages="totalPages"
          v-model:current-page="currentPage"
        />
      </div>
    </div>

    <FloatingActionMenu
      v-if="isMobile"
      :options="[{ label: 'Add Movie', onClick: openAddMovieModal }]"
    />

    <MovieDetailModal
      v-model:open="showMovieDetailModal"
      :movie="selectedMovie ?? undefined"
    />
  </main>
</template>
