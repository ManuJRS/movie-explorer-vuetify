<script setup>
import { ref } from 'vue';
import AddMovieForm from '../components/AddMovieForm.vue';
import MovieCard from '../components/MovieCard.vue';
import MovieDetailModal from '../components/MovieDetailModal.vue';
import { useMoviesStore } from '../stores/movies';
import WarningAdviser from '../components/WarningAdviser.vue';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

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
                <WarningAdviser variant="info" title="Demo Notice (v1.0.3)">
                    <p>This is a demo version. Data is stored only in your session, so clearing your cache will erase saved movies. The app is currently available in English only, and saved movies cannot be edited.</p>
                    <br>
                    <p>All these features—multi-language support, user accounts to keep your data, and editing saved movies—are available for free in version 2.0.4 after registration.</p>
                </WarningAdviser>
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
            :movie="selectedMovie"
        />
    </main>
</template>
