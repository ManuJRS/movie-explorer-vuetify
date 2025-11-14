<script setup>
import { useMoviesStore } from '../stores/movies';
const moviesStore = useMoviesStore();
const props = defineProps({
    movie: {
        type: Object,
        required: true
    }
});
function deleteItem() {
    moviesStore.deleteMovie(props.movie.id);
}
</script>

<template>
    <v-col cols="12" sm="6" md="6" lg="4">
        <v-card class="ma-1 pb-2" :class="movie-card">
            <v-img :src="movie.image" class="movie-img" cover></v-img>
            <v-card-title class="movie-title">{{ movie.title }}</v-card-title>
            <v-card-subtitle>{{ movie.year }}</v-card-subtitle>
            <v-card-acction>
                <v-btn
                class="ml-2 mt-1"
                color="red"
                variant="tonal"
                @click="deleteItem"
                >
                    Eliminar
                </v-btn>
            </v-card-acction>
        </v-card>
    </v-col>
</template>

<style scoped>
.movie-img {
    height: 520px;
}

.movie-card {
    max-width: 100%;
    margin: 0 auto;
}

.movie-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

@media (min-width: 600px) {
  .movie-img {
    height: 650px;
  }

  .movie-card {
    max-width: 340px;
  }
}

@media (min-width: 1200px) {
  .movie-img {
    height: 320px; 
  }

  .movie-card {
    max-width: 450px;
  }
}

@media (min-width: 1600px) {
  .movie-img {
    height: 400px;
  }

  .movie-card {
    max-width: 500px;
  }
}


</style>