import { defineStore } from 'pinia';
import { ref } from 'vue';

const STORAGE_KEY = 'movies';

export interface Movie {
    id: string;
    title: string;
    year: string;
    image: string;
    platform: string;
    synopsis: string;
}

export const useMoviesStore = defineStore('movies', () => {
    const movies = ref<Movie[]>([]);

    function deleteMovie(id: string) {
        movies.value = movies.value.filter((movie) => movie.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(movies.value));
    }

    async function loadMovies() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                movies.value = JSON.parse(stored) as Movie[];
                return;
            }
            const response = await fetch('../data/movie.json');

            if (!response.ok) {
                throw new Error('Error al cargar movie.json');
            }
            const data = (await response.json()) as Movie[];
            movies.value = data;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(movies.value));
        } catch (error) {
            console.error('Error loading movies:', error);
        }
    }

    function addMovie(movie: Movie) {
        movies.value.push(movie);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(movies.value));
    }

    function resetMovies() {
        movies.value = [];
        localStorage.removeItem(STORAGE_KEY);
    }

    return {
        movies,
        loadMovies,
        addMovie,
        resetMovies,
        deleteMovie,
    };
});
