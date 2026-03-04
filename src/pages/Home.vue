<script setup lang="ts">
import { ref, onMounted } from 'vue';
import AddMovieForm from '@/components/AddMovieForm.vue';
import MovieCard from '@/components/MovieCard.vue';
import MovieDetailModal from '@/components/MovieDetailModal.vue';
import { useMoviesStore, type Movie } from '@/stores/movies';
import { storeToRefs } from 'pinia';

const moviesStore = useMoviesStore();
const { movies } = storeToRefs(moviesStore);

const showMovieDetailModal = ref(false);
const selectedMovie = ref<Movie | null>(null);

function openMovieDetail(movie: Movie) {
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
