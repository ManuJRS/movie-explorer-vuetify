import { defineStore } from "pinia";
import { ref } from "vue";

export const useMoviesStore = defineStore("movies", () => {
    const movies = ref([]);

    async function loadMovies() {
        const rest = await fetch("https://api.example.com/movies");
        movies.value = await rest.json();
    }

    function addMovie(movie) {
        movies.value.push(movie);
    }

    return { movies, loadMovies, addMovie };
})