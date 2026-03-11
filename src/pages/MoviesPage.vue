<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import i18n from '@/i18n'


import AddMovieForm from '@/components/AddMovieForm.vue'
import MovieCard from '@/components/MovieCard.vue'
import MovieDetailModal from '@/components/MovieDetailModal.vue'
import MoviesCounter from '@/components/MoviesCounter.vue'
import FloatingActionMenu from '@/components/FloatingActionMenu.vue'
import { useWindowWidth } from '@/composables/useWindowWidth'
import Paginator from '@/components/Paginator.vue'
import TitleIntro from '@/components/TitleIntro.vue'
import PageLoader from '@/components/ui/PageLoader.vue'

const windowWidth = useWindowWidth()
const isMobile = computed(() => windowWidth.value < 640)
import { useMoviesStore } from '@/stores/movies'
import type { Movie } from '@/types/movie'
import { useAuthStore } from '@/stores/auth'

const isLoading = ref(true)

onMounted(async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1800))
  } finally {
    isLoading.value = false
  }
})

const moviesStore = useMoviesStore()
const authStore = useAuthStore()
const { t } = i18n.global
const { user } = storeToRefs(authStore)

const showMovieDetailModal = ref(false)
const selectedMovie = ref<Movie | null>(null)
const addMovieFormRef = ref<InstanceType<typeof AddMovieForm> | null>(null)
const searchQuery = ref('')
const currentPage = ref(1)

const ITEMS_PER_PAGE = 12

const filteredMovies = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return moviesStore.movies
  return moviesStore.movies.filter((m) =>
    String(m.title ?? '').toLowerCase().includes(q)
  )
})

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredMovies.value.length / ITEMS_PER_PAGE))
)

const paginatedMovies = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  return filteredMovies.value.slice(start, start + ITEMS_PER_PAGE)
})

watch(searchQuery, () => {
  currentPage.value = 1
})
watch(filteredMovies, () => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
})

function openMovieDetail(movie: Movie) {
  selectedMovie.value = movie
  showMovieDetailModal.value = true
}

function openAddMovieModal() {
  const form = addMovieFormRef.value
  if (form && 'openMobileFormModal' in form) form.openMobileFormModal()
}

watch(user, async (u) => {
  if (u) await moviesStore.loadMovies()
  else moviesStore.resetMovies()
}, { immediate: true })

onMounted(async () => {
  if (user.value) await moviesStore.loadMovies()
})
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