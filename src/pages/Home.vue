<script setup>
import AddMovieForm from '../components/AddMovieForm.vue';
import MovieCard from '../components/MovieCard.vue';
import { useMoviesStore } from '../stores/movies';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
const moviesStore = useMoviesStore();
const { movies } = storeToRefs(moviesStore);
onMounted(() => {
    moviesStore.loadMovies();
});


</script>

<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="4">
            <AddMovieForm />
            </v-col>
            <v-col cols="12" md="8">
                <v-row>
                    <MovieCard
                        v-for="movie in moviesStore.movies"
                        :key="movie.id"
                        :movie="movie"
                        class="mb-4"
                    />
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>