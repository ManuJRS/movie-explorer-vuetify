<script setup>
import { ref } from 'vue';
import AddMovieForm from '../components/AddMovieForm.vue';
import MovieCard from '../components/MovieCard.vue';
import MovieCardPlaceholder from '../components/MovieCardPlaceholder.vue';
import MovieDetailModal from '../components/MovieDetailModal.vue';
import { useMoviesStore } from '../stores/movies';
import WarningAdviser from '../components/WarningAdviser.vue';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
const moviesStore = useMoviesStore();
const { movies } = storeToRefs(moviesStore);

const showMovieDetailModal = ref(false);
const selectedMovie = ref(null);

function openMovieDetail(movie) {
    selectedMovie.value = movie;
    showMovieDetailModal.value = true;
}

onMounted(() => {
    moviesStore.loadMovies();
});
</script>

<template>
    <main class="mt-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row flex-wrap gap-6">
            <div class="w-full md:w-1/3 lg:max-w-md">
                <AddMovieForm />
            </div>
            <div class="flex-1 min-w-0">
                <WarningAdviser variant="info" :title="t('warningAdviser.title')">
                    <p>{{ t('warningAdviser.description') }}</p>
                </WarningAdviser>
                <div class="flex flex-wrap">
                    <MovieCardPlaceholder v-if="!moviesStore.movies.length" />
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
            :movie="selectedMovie"
        />
    </main>
</template>
