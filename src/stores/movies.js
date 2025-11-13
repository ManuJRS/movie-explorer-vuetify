import { defineStore } from "pinia";
import { ref } from "vue";

const STORAGE_KEY = "movies";
export const useMoviesStore = defineStore("movies", () => {
const movies = ref([]);

async function loadMovies() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            movies.value = JSON.parse(stored);
            return
    }    
    const response = await fetch("../data/movie.json");

        if (!response.ok) {
            throw new Error("Error al cargar movie.json");
        }
        const data = await response.json();
        movies.value = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(movies.value));
    } catch (error) {
        console.error("Error loading movies:", error);
    }
}
function addMovie(movie) {
    movies.value.push(movie);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies.value));
}

function resetMovies() {
    movies.value = [];
    localStorage.removeItem(STORAGE_KEY);
}
return{
    movies,
    loadMovies,
    addMovie,
    resetMovies
}
})