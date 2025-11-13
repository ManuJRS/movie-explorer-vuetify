<script setup>
import { ref } from 'vue';
import { useMoviesStore } from '../stores/movies';
const isFormValid = ref(false);
const moviesStore = useMoviesStore()
const title = ref('');
const year = ref('');
const image = ref('');
const form = ref(null);
const required = (value) => !!value || 'Este campo es requerido';
const isYear = (value) => 
     (value && value > 1800 && value < 2100) || 'Ingrese un año valido';

async function handleSubmit() {
    const Valid = await form.value.validate();
    if (!Valid) return;

    moviesStore.addMovie({
        id: Date.now(),
        title: title.value,
        year: Number(year.value),
        image: image.value
    });

console.log('Películas en el store:', moviesStore.movies)
    title.value = '';
    year.value = '';
    image.value = '';
    form.value.reset();
    form.value.resetValidation();
}
</script>

<template>
    <v-card>
        <v-card-title>Aqui puedes agregar tus peliculas</v-card-title>
        <v-card-text>
            <v-form
            v-model="isFormValid"
            ref="form"
            @submit.prevent="handleSubmit">
                <v-text-field 
                v-model="title" 
                label="Titulo de la pelicula"
               :rules="[required]"
                required
                ></v-text-field>
                <v-text-field 
                v-model="year" 
                label="Año de lanzamiento"
                :rules="[required,isYear]"
                required
                ></v-text-field>
                <v-text-field 
                v-model="image" 
                label="URL de la imagen"
                :rules="[required]"
                required
                ></v-text-field>
                <v-btn
                class="mt-5" 
                :disabled="!isFormValid"
                color="primary" 
                type="submit"
                block
                >Agregar Pelicula</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>