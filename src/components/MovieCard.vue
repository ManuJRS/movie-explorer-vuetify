<script setup lang="ts">
import { ref } from 'vue';
import { useMoviesStore } from '@/stores/movies';
import DelateMovieModal from '@/components/DelateMovieModal.vue';
import Tooltip from '@/components/Tooltip.vue';

const moviesStore = useMoviesStore();
const props = defineProps({
    movie: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['openDetail']);

const showDeleteModal = ref(false);

function openDetail() {
    emit('openDetail', props.movie);
}

function openDeleteModal() {
    showDeleteModal.value = true;
}

function confirmDelete() {
    moviesStore.deleteMovie(props.movie.id);
}
</script>

<template>
    <div class="w-1/2 min-w-0 max-w-[280px] p-2 sm:w-1/2 lg:w-1/2 md:w-full md:min-w-0 md:p-2 sm:w-1/2 lg:w-1/3">
        <div
            class="group relative glass rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300 border border-black/10 dark:border-white/10"
        >
            <div
                class="relative h-[200px] sm:h-[260px] lg:h-[320px] overflow-hidden cursor-pointer"
                @click="openDetail"
            >
                <span v-if="movie.platform" class="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium bg-black/60 text-white rounded-full tracking-wider">
                    {{ movie.platform }}
                </span>
                <img
                    :src="movie.image || 'https://via.placeholder.com/300x450?text=No+Poster'"
                    :alt="movie.title"
                    class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div
                    class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 sm:gap-4"
                >
                    <button
                        type="button"
                        @click.stop="openDetail"
                        class="hover:cursor-pointer h-10 w-10 sm:h-12 sm:w-12 rounded-full glass flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <span class="material-symbols-outlined text-white">info</span>
                    </button>
                </div>
            </div>
            <div class="p-2.5 sm:p-3 flex items-center justify-between gap-2">
                <div class="overflow-hidden min-w-0 flex-1">
                    <Tooltip :text="movie.title">
                        <h3 class="font-bold text-sm sm:text-base truncate pr-2 text-slate-900 dark:text-white">
                            {{ movie.title }}
                        </h3>
                    </Tooltip>
                    <p class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{{ movie.year }}</p>
                </div>
                <button
                    type="button"
                    @click="openDeleteModal"
                    class="flex-shrink-0 p-1 sm:p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-all hover:cursor-pointer"
                >
                    <span class="material-symbols-outlined text-lg">delete</span>
                </button>
            </div>
        </div>
    </div>

    <DelateMovieModal
        v-model:open="showDeleteModal"
        :movie="movie"
        @confirm="confirmDelete"
    />
</template>
