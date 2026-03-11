<script setup lang="ts">
import { computed } from 'vue'
import { useMoviesStore } from '@/stores/movies'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const moviesStore = useMoviesStore()

const props = defineProps<{
  /** Si se pasa, se usa este número en lugar de moviesStore.movies.length (ej. en Favoritas) */
  count?: number
  /** Etiqueta opcional (ej. "Favoritas" en FavoritesPage) */
  label?: string
}>()

const displayCount = computed(() =>
  props.count !== undefined ? props.count : moviesStore.movies.length
)
const displayLabel = computed(() =>
  props.label ?? t('layoutPage.moviesCounter')
)
</script>

<template>
  <div class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
    <div class="flex items-center gap-2">
      <span class="material-symbols-outlined">movie</span>
      <span>{{ displayLabel }} ({{ displayCount }})</span>
    </div>
  </div>
</template>