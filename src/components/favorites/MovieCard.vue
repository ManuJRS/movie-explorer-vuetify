<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMoviesStore } from '@/stores/movies'
import DelateMovieModal from '@/components/shared/DelateMovieModal.vue'
import Tooltip from '@/components/movies/Tooltip.vue'
import type { Movie } from '@/types/movie'
import type { TMDbMovie } from '@/composables/useRecommendations'

export interface RecommendationCardLabels {
  addToShell: string
  seeded: string
  addToWatchlist: string
  saved: string
  noOverview: string
  seeMore: string
  seeLess: string
}

const moviesStore = useMoviesStore()
const props = withDefaults(
  defineProps<{
    variant?: 'library' | 'recommendation'
    movie?: Movie
    fullWidth?: boolean
    recommendation?: TMDbMovie
    getPosterUrl?: (path: string | null) => string
    expandedOverviewIds?: Set<number>
    isInMovies?: (id: number) => boolean
    isInWatchlist?: (id: number) => boolean
    seedingId?: number | null
    savingId?: number | null
    recommendationLabels?: RecommendationCardLabels
  }>(),
  { fullWidth: false, variant: 'library' }
)

const isLibrary = computed(() => props.variant === 'library')
const isRecommendation = computed(() => props.variant === 'recommendation')

const isFavorite = computed(() => (props.movie ? props.movie.favorite : false))

const handleToggleFavorite = async () => {
  if (props.movie) await moviesStore.toggleFavorite(props.movie.id, props.movie.favorite)
}

const emit = defineEmits<{
  openDetail: [movie: Movie | TMDbMovie]
  toggleOverview: [id: number]
  seedToMovies: [movie: TMDbMovie]
  saveToWatchlist: [movie: TMDbMovie]
}>()

const showDeleteModal = ref(false)

function openDetail() {
  if (props.movie) emit('openDetail', props.movie)
}

function openDeleteModal() {
  showDeleteModal.value = true
}

function confirmDelete() {
  if (props.movie) moviesStore.deleteMovie(props.movie.id)
}

function onToggleOverview(id: number) {
  emit('toggleOverview', id)
}

function onSeed(m: TMDbMovie) {
  emit('seedToMovies', m)
}

function onSave(m: TMDbMovie) {
  emit('saveToWatchlist', m)
}

function isOverviewExpanded(id: number) {
  return props.expandedOverviewIds?.has(id) ?? false
}

function onOpenRecommendationDetail() {
  if (props.recommendation) emit('openDetail', props.recommendation)
}
</script>

<template>
  <div
    :class="[
      'min-w-0 p-2',
      fullWidth
        ? 'w-full max-w-none'
        : 'w-1/2 sm:w-1/2 lg:w-1/2 md:w-full md:min-w-0 sm:w-1/2 lg:w-1/3 max-w-[280px]',
    ]"
  >
    <!-- biblioteca -->
    <div
      v-if="isLibrary && movie"
      class="group relative glass rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 border border-black/10 dark:border-white/10"
    >
      <div class="absolute top-2 right-2 z-10 bg-black/40 backdrop-blur-sm rounded-full p-2">
        <button
          type="button"
          @click="handleToggleFavorite"
          class="group shrink-0 rounded-full md:p-2 p-2 transition hover:cursor-pointer"
          :aria-label="isFavorite ? 'Remove from favorites' : 'Add to favorites'"
        >
          <span class="relative flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-5 transition-all duration-300 group-active:scale-90 group-hover:text-pink-500"
              :class="isFavorite ? 'text-pink-500 fill-current' : 'text-white'"
            >
              <path d="m19 14-7 7-7-7a5 5 0 0 1 7-7l0 0a5 5 0 0 1 7 7z" />
            </svg>
          </span>
        </button>
      </div>
      <div
        class="relative h-[200px] sm:h-[260px] lg:h-[320px] overflow-hidden cursor-pointer"
        @click="openDetail"
      >
        <span
          v-if="movie.platform"
          class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium bg-black/60 text-white rounded-full tracking-wider"
        >
          {{ movie.platform }}
        </span>
        <img
          :src="movie.image || 'https://via.placeholder.com/300x450?text=No+Poster'"
          :alt="movie.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div
          class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 sm:gap-4"
        >
          <button
            type="button"
            @click.stop="openDetail"
            class="hover:cursor-pointer h-10 w-10 sm:h-12 sm:w-12 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <span class="material-symbols-outlined text-white">info</span>
          </button>
        </div>
      </div>
      <div class="p-2.5 sm:p-3 flex items-center justify-between gap-2">
        <div class="overflow-hidden min-w-0 flex-1">
          <Tooltip :text="movie.title ?? ''">
            <h3 class="font-bold text-sm sm:text-base truncate pr-2 text-slate-900 dark:text-white">
              {{ movie.title ?? 'Sin título' }}
            </h3>
          </Tooltip>
          <p class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{{ movie.year ?? '—' }}</p>
          <p
            v-if="movie.synopsis"
            class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2"
          >
            {{ movie.synopsis }}
          </p>
        </div>
        <button
          type="button"
          @click="openDeleteModal"
          class="flex-shrink-0 p-1 sm:p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-all hover:cursor-pointer"
        >
          <span class="material-symbols-outlined text-lg">delete</span>
        </button>
      </div>
    </div>

    <!-- Recomendación -->
    <div
      v-else-if="isRecommendation && recommendation && getPosterUrl && recommendationLabels"
      class="group relative glass rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 border border-black/10 dark:border-white/10"
    >
      <div
        class="relative h-[200px] sm:h-[260px] md:h-[360px] overflow-hidden cursor-pointer"
        @click="onOpenRecommendationDetail"
      >
        <img
          :src="getPosterUrl(recommendation.poster_path)"
          :alt="recommendation.title"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div
          class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 sm:gap-4"
        >
          <button
            type="button"
            @click.stop="onOpenRecommendationDetail"
            class="hover:cursor-pointer h-10 w-10 sm:h-12 sm:w-12 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <span class="material-symbols-outlined text-white">info</span>
          </button>
        </div>
      </div>

      <div class="p-2.5 sm:p-4">
        <h2 class="font-bold text-sm sm:text-base line-clamp-1 mb-1 text-slate-900 dark:text-white">
          {{ recommendation.title }}
        </h2>

        <p class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mb-2">
          {{ recommendation.release_date?.slice(0, 4) || 'N/A' }}
        </p>

        <p
          :class="[
            'text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mb-2',
            isOverviewExpanded(recommendation.id) ? '' : 'line-clamp-3',
          ]"
        >
          {{ recommendation.overview || recommendationLabels.noOverview }}
        </p>
        <button
          v-if="recommendation.overview && recommendation.overview.length > 100"
          type="button"
          class="text-xs text-primary hover:underline mb-3"
          @click="onToggleOverview(recommendation.id)"
        >
          {{ isOverviewExpanded(recommendation.id) ? recommendationLabels.seeLess : recommendationLabels.seeMore }}
        </button>
        <div class="flex flex-col sm:flex-row items-center justify-between gap-2">
          <button
            type="button"
            class="w-full rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed border border-black/10 dark:border-white/10 bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            :class="isInMovies?.(recommendation.id)
              ? 'text-slate-500 dark:text-slate-400 cursor-default'
              : 'text-slate-900 dark:text-white'"
            :disabled="seedingId === recommendation.id || isInMovies?.(recommendation.id)"
            @click="onSeed(recommendation)"
          >
            {{ seedingId === recommendation.id ? '...' : isInMovies?.(recommendation.id) ? recommendationLabels.seeded : recommendationLabels.addToShell }}
          </button>
          <button
            type="button"
            class="w-full rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed border border-black/10 dark:border-white/10 bg-white/5 hover:bg-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            :class="isInWatchlist?.(recommendation.id)
              ? 'text-slate-500 dark:text-slate-400 cursor-default'
              : 'text-slate-900 dark:text-white'"
            :disabled="savingId === recommendation.id || isInWatchlist?.(recommendation.id)"
            @click="onSave(recommendation)"
          >
            {{ savingId === recommendation.id ? '...' : isInWatchlist?.(recommendation.id) ? recommendationLabels.saved : recommendationLabels.addToWatchlist }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <DelateMovieModal
    v-if="movie"
    v-model:open="showDeleteModal"
    :movie="movie"
    @confirm="confirmDelete"
  />
</template>
