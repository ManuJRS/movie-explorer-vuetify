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
    <div class="w-full sm:w-1/2 lg:w-1/3 p-2">
        <div
            class="group relative glass rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 border border-black/10 dark:border-white/10"
        >
            <div class="relative h-[400px] overflow-hidden">
                <span v-if="movie.platform" class="absolute top-2 right-2 z-10 inline-flex items-center px-3 py-1 text-xs font-medium bg-black/60 text-white rounded-full tracking-wider">
                    {{ movie.platform }}
                </span>
                <img
                    :src="movie.image"
                    :alt="movie.title"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                    class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4"
                >
                    <button
                        type="button"
                        class="hover:cursor-pointer h-12 w-12 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <span class="material-symbols-outlined text-white">info</span>
                    </button>
                </div>
            </div>
            <div class="p-4 flex items-center justify-between">
                <div class="overflow-hidden min-w-0 flex-1">
                    <h3 class="font-bold text-lg truncate pr-2 text-slate-900 dark:text-white">
                        {{ movie.title }}
                    </h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400">{{ movie.year }}</p>
                </div>
                <button
                    type="button"
                    @click="deleteItem"
                    class="flex-shrink-0 p-2 text-slate-400 hover:text-rose-500 rounded-lg transition-all hover:cursor-pointer"
                >
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        </div>
    </div>
</template>
