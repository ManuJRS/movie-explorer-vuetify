<script setup>
import { ref } from 'vue';
import { useMoviesStore } from '../stores/movies';
const moviesStore = useMoviesStore()
const title = ref('');
const year = ref('');
const image = ref('');

function handleSubmit() {
    moviesStore.addMovie({
        id: Date.now(),
        title: title.value,
        year: year.value,
        image: image.value
    });
console.log('Películas en el store:', moviesStore.movies)
    title.value = '';
    year.value = '';
    image.value = '';
}
</script>

<template>
    <v-card>
        <v-card-title>Aqui puedes agregar tus peliculas</v-card-title>
        <v-card-text>
            <v-form @submit.prevent="handleSubmit">
                <v-text-field v-model="title" label="Titulo de la pelicula" required></v-text-field>
                <v-text-field v-model="year" label="Año de lanzamiento" required></v-text-field>
                <v-text-field v-model="image" label="URL de la imagen" required></v-text-field>
                <v-btn color="primary" type="submit">Agregar Pelicula</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>