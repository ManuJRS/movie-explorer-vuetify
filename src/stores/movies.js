import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMoviesStore = defineStore('movies', () => {
  const movies = ref([])

  async function loadMovies() {
    try {
      const response = await fetch('../data/movie.json')

      if (!response.ok) {
        throw new Error('Error al cargar movie.json')
      }

      const data = await response.json()
      movies.value = data
    } catch (error) {
      console.error('Error cargando películas:', error)
    }
  }

  function addMovie(movie) {
    movies.value.push(movie)
  }

  return { movies, loadMovies, addMovie }
})
