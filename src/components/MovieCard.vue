<script setup>
defineProps({
    movie: {
        type: Object,
        required: true
    }
});
</script>

<template>
    <v-col cols="12" sm="6" md="4" lg="3">
        <v-card class="ma-4" max-width="300">
            <v-img :src="movie.image" height="300px"></v-img>
            <v-card-title>{{ movie.title }}</v-card-title>
            <v-card-subtitle>{{ movie.year }}</v-card-subtitle>
        </v-card>
    </v-col>
</template>