<script setup lang="ts">
import { useMoviesStore } from '@/stores/movies';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const moviesStore = useMoviesStore();
</script>

<template>
    <div class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <div class="flex items-center gap-2">
            <span class="material-symbols-outlined">movie</span>
            <span>{{ t('layoutPage.moviesCounter') }} ({{ moviesStore.movies.length }})</span>
        </div>
    </div>
</template>