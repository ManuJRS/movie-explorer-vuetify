<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import i18n from '@/i18n'


import AddMovieForm from '@/components/AddMovieForm.vue'
import MovieCard from '@/components/MovieCard.vue'
import MovieDetailModal from '@/components/MovieDetailModal.vue'
import MoviesCounter from '@/components/MoviesCounter.vue'
import { useMoviesStore, type Movie } from '@/stores/movies'
import { useAuthStore } from '@/stores/auth'

const moviesStore = useMoviesStore()
const authStore = useAuthStore()
const { t } = i18n.global
const { user } = storeToRefs(authStore)

const showMovieDetailModal = ref(false)
const selectedMovie = ref<Movie | null>(null)

function openMovieDetail(movie: Movie) {
  selectedMovie.value = movie
  showMovieDetailModal.value = true
}

// Carga movies solo si hay user
watch(user, async (u) => {
  if (u) await moviesStore.loadMovies()
  else moviesStore.resetMovies()
}, { immediate: true })

onMounted(async () => {
  // por si ya hay sesión cuando montas
  if (user.value) await moviesStore.loadMovies()
})
</script>

<template>
  <main class="mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <!-- Si NO hay user: redirigir a login -->
    <div v-if="!user" class="max-w-md mx-auto text-center py-16">
      <p class="text-slate-600 dark:text-slate-300 mb-4">Log in to save and manage your movies.</p>
      <router-link
        to="/login"
        class="inline-block px-6 py-3 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-semibold"
      >
        Go to Login
      </router-link>
    </div>

    <!-- Si SÍ hay user: mostrar dashboard -->
    <div v-else class="flex flex-col md:flex-row flex-wrap gap-6">
      <div class="w-full md:w-1/3 lg:max-w-md">
        <AddMovieForm />
      </div>

      <div class="flex-1 min-w-0 flex flex-col gap-4 relative z-10">
        <div class="flex items-center justify-between">
          <router-link
                    v-if="user"
                    :to="{ name: 'user-settings' }"
                    class=" text-sm rounded-lg hover:cursor-pointer dark:text-slate-400 text-white transition inline-flex hover:scale-105 transition-all duration-300 elf-start gap-2"
                    aria-label="Ajustes"
                >
                    <span class="material-symbols-outlined hover:text-white rounded-full">settings</span>
                    <span>{{ t('settingsPage.titlePreview') }}</span>
                </router-link>
                <MoviesCounter class="md:self-end self-start pl-4 md:pl-0" />

        </div>
       
        <div class="flex flex-wrap">
          <MovieCard
            v-for="movie in moviesStore.movies"
            :key="movie.id"
            :movie="movie"
            @open-detail="openMovieDetail"
          />
        </div>
      </div>
    </div>

    <MovieDetailModal
      v-model:open="showMovieDetailModal"
      :movie="selectedMovie ?? undefined"
    />
  </main>
</template>