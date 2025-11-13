<script setup>
import MovieCard from './components/MovieCard.vue';
import AddMovieForm from './components/AddMovieForm.vue';

const testMovie = {
  id: 1,
  title: 'The fitght club',
  year: 2010,
  image: 'https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_.jpg',
}
</script>

<template>
<v-app>
  <v-main>
    <v-container class="mt-5">
      <v-row>
        <MovieCard :movie="testMovie" />
        <AddMovieForm />
      </v-row>
    </v-container>
  </v-main>
</v-app>
</template>