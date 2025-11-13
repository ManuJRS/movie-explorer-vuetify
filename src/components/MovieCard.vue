<script setup>
defineProps({
    movie: {
        type: Object,
        required: true
    }
});
</script>

<template>
    <v-col cols="12" sm="6" md="6" lg="4">
        <v-card class="ma-1 pb-2" :class="movie-card">
            <v-img :src="movie.image" height="320px" cover></v-img>
            <v-card-title>{{ movie.title }}</v-card-title>
            <v-card-subtitle>{{ movie.year }}</v-card-subtitle>
        </v-card>
    </v-col>
</template>

<style scoped>
.movie-card {
    max-width: 500px !important;
}
</style>