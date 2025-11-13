<script setup>
import MovieCard from './components/MovieCard.vue';

const testMovie = {
  id: 1,
  title: 'Inception',
  year: 2010,
  image: 'https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_.jpg',
}
</script>

<template>
  <v-container>
    <v-row>
      <MovieCard :movie="testMovie"
      />
    </v-row>
 </v-container>
</template>