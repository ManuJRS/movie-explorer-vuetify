import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import AddMovieForm from '@/components/movies/AddMovieForm.vue'
import { useWindowWidth } from '@/composables/useWindowWidth'
import type { TMDbMovie } from '@/composables/useRecommendations'
import { useMoviesStore } from '@/stores/movies'
import { useAuthStore } from '@/stores/auth'
import type { Movie } from '@/types/movie'

const ITEMS_PER_PAGE = 12
const INITIAL_LOAD_DELAY_MS = 1800

export function useMoviesPage() {
  const windowWidth = useWindowWidth()
  const moviesStore = useMoviesStore()
  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)

  const isMobile = computed(() => windowWidth.value < 640)
  const isLoading = ref(true)
  const showMovieDetailModal = ref(false)
  const selectedMovie = ref<Movie | null>(null)
  const addMovieFormRef = ref<InstanceType<typeof AddMovieForm> | null>(null)
  const searchQuery = ref('')
  const currentPage = ref(1)

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

  function openMovieDetail(movie: Movie | TMDbMovie) {
    selectedMovie.value = movie as Movie
    showMovieDetailModal.value = true
  }

  function openAddMovieModal() {
    const form = addMovieFormRef.value
    if (form && 'openMobileFormModal' in form) form.openMobileFormModal()
  }

  watch(searchQuery, () => {
    currentPage.value = 1
  })

  watch(filteredMovies, () => {
    if (currentPage.value > totalPages.value) currentPage.value = totalPages.value
  })

  watch(
    user,
    async (u) => {
      if (u) await moviesStore.loadMovies()
      else moviesStore.resetMovies()
    },
    { immediate: true }
  )

  onMounted(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, INITIAL_LOAD_DELAY_MS))
    } finally {
      isLoading.value = false
    }
  })

  onMounted(async () => {
    if (user.value) await moviesStore.loadMovies()
  })

  return {
    user,
    isMobile,
    isLoading,
    showMovieDetailModal,
    selectedMovie,
    addMovieFormRef,
    searchQuery,
    currentPage,
    filteredMovies,
    totalPages,
    paginatedMovies,
    openMovieDetail,
    openAddMovieModal,
  }
}
