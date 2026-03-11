<script setup lang="ts">
import AddMovieForm from '@/components/movies/AddMovieForm.vue'
import MovieCard from '@/components/favorites/MovieCard.vue'
import MovieDetailModal from '@/components/shared/MovieDetailModal.vue'
import MoviesCounter from '@/components/shared/MoviesCounter.vue'
import FloatingActionMenu from '@/components/movies/FloatingActionMenu.vue'
import Paginator from '@/components/shared/Paginator.vue'
import TitleIntro from '@/components/movies/TitleIntro.vue'
import PageLoader from '@/components/ui/PageLoader.vue'
import { useMoviesPage } from '@/composables/useMoviesPage'

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
</script>

<template>
  <PageLoader v-if="isLoading" />

  <main class="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <div v-if="!user" class="max-w-md mx-auto text-center py-16">
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

          <div class="flex items-center md:justify-between w-full">
            <div class="flex items-center gap-4">
            </div>

            <MoviesCounter />
          </div>
        </div>
       
        <div class="flex flex-wrap">
          <MovieCard
            v-for="movie in paginatedMovies"
            :key="movie.id"
            :movie="movie"
            @open-detail="openMovieDetail"
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
