<script setup>
import Navbar from './components/Navbar.vue';

const testMovie = {
  id: 1,
  title: 'The fitght club',
  year: 2010,
  image: 'https://m.media-amazon.com/images/I/51v5ZpFyaFL._AC_.jpg',
}
</script>

<template>
<v-app>
  <Navbar />
  <v-main>
      <v-container class="py-10">
        <h1   :color="isDark ? 'primary' : 'grey-lighten-4'"
  :text-color="isDark ? 'white' : 'black'">Probando Navbar</h1>
        <p   :color="isDark ? 'primary' : 'grey-lighten-4'"
  :text-color="isDark ? 'white' : 'black'">Aquí irá el resto del contenido.</p>
      </v-container>
  </v-main>
</v-app>
</template>