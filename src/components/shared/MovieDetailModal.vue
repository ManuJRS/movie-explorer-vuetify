<script setup lang="ts">
import { ref } from 'vue';
import { useMoviesStore } from '@/stores/movies'
import type { Movie } from '@/types/movie'
import EditModal from '@/components/movies/EditModal.vue';
import { useI18n } from 'vue-i18n';
import InteractiveHoverButton from '@/components/shared/InteractiveHoverButton.vue';

const { t } = useI18n();

defineProps({
    open: {
        type: Boolean,
        default: false
    },
    movie: {
        type: Object,
        default: () => ({
            title: '',
            year: '',
            image: '',
            platform: '',
            synopsis: ''
        })
    },
    /** Si false, no se muestra el botón de editar (p. ej. en detalle de recomendación). */
    showEditButton: {
        type: Boolean,
        default: true
    }
});

const emit = defineEmits(['update:open', 'save']);

const moviesStore = useMoviesStore();
const showEditModal = ref(false);

function close() {
    emit('update:open', false);
}

function save() {
    emit('save');
    emit('update:open', false);
}

function openEditModal() {
    showEditModal.value = true;
    emit('update:open', false);
}

async function onEditSave(updatedMovie: Movie) {
    await moviesStore.updateMovie(updatedMovie);
}
</script>

<template>
    <Teleport to="body">
        <div
            v-if="open"
            class="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-40 flex items-center justify-center p-0 md:p-6 mt-32 md:mt-0"
            @click.self="close"
        >
            <div
                class="relative w-full h-full min-h-screen md:min-h-0 md:h-auto md:max-w-5xl md:max-h-[800px] bg-background-light dark:bg-slate-900 rounded-none md:rounded-xl overflow-hidden shadow-2xl border-0 md:border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row"
            >
                <button
                    type="button"
                    @click="close"
                    class="absolute top-4 right-4 z-50 p-2 rounded-full hover:cursor-pointer text-slate-500 transition-colors"
                >
                    <span class="material-symbols-outlined">close</span>
                </button>
                <div
                    class="w-full md:w-2/5 min-h-[60vh] md:min-h-0 md:h-auto relative bg-slate-200 dark:bg-slate-800 flex items-center justify-center border-r border-slate-200 dark:border-slate-800 rounded-none md:rounded-l-xl overflow-hidden"
                >
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                    <div
                        class="w-full h-full bg-cover md:bg-center bg-top absolute inset-0"
                        :style="movie?.image ? { backgroundImage: `url(${movie.image})` } : {}"
                    ></div>
                    <div class="absolute bottom-6 left-6 right-6 z-20"></div>
                </div>
                <div class="w-full md:w-3/5 p-6 md:p-8 overflow-y-auto flex flex-col flex-1 min-h-0 md:rounded-none md:rounded-r-xl px-4 md:px-8">
                    <div class="mb-2 md:mb-8">
                        <div class="flex items-center gap-3 mb-2 items-start md:items-center">
                            <button
                                v-if="showEditButton"
                                type="button"
                                @click="openEditModal"
                                class="hover:cursor-pointer p-2 rounded-full hover:text-blue-500 transition-colors"
                                aria-label="Editar película"
                            >
                                <span class="material-symbols-outlined">edit</span>
                            </button>
                            <h1 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                                {{ movie?.title || '—' }}
                            </h1>
                            <span
                                v-if="movie?.year"
                                class="px-2 py-1 mt-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs md:text-sm font-semibold"
                            >
                                {{ movie.year }}
                            </span>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-2 md:mt-4">
                            <span
                                v-if="movie?.platform"
                                class="px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium uppercase tracking-wide"
                            >
                                {{ movie.platform }}
                            </span>
                            <span
                                v-for="genre in movie?.genres"
                                :key="genre"
                                class="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-medium"
                            >
                                {{ genre }}
                            </span>
                        </div>
                        <div v-if="movie?.runtime || movie?.rating" class="flex flex-wrap gap-3 mt-2 text-sm text-slate-500 dark:text-slate-400">
                            <span v-if="movie?.runtime">{{ movie.runtime }} min</span>
                            <span v-if="movie?.rating">★ {{ movie.rating.toFixed(1) }}</span>
                        </div>
                        <div v-if="movie?.directors?.length" class="mt-2">
                            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{{ t('modalDetails.directors') }}</h3>
                            <p class="text-sm text-slate-600 dark:text-slate-300">{{ movie.directors.join(', ') }}</p>
                        </div>
                        <div v-if="movie?.mainActors?.length" class="mt-2">
                            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{{ t('modalDetails.cast') }}</h3>
                            <p class="text-sm text-slate-600 dark:text-slate-300">{{ movie.mainActors.join(', ') }}</p>
                        </div>
                        <div v-if="movie?.writers?.length" class="mt-2">
                            <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{{ t('modalDetails.writers') }}</h3>
                            <p class="text-sm text-slate-600 dark:text-slate-300">{{ movie.writers.join(', ') }}</p>
                        </div>
                    </div>
                    <div class="mb-8">
                        <h2 class="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] mb-2 md:mb-3">
                            {{ t('form.synopsis') }}
                        </h2>
                        <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-base overflow-y-auto max-h-48 md:max-h-full min-h-0">
                            {{ movie?.synopsis || 'No Synopsis added' }}
                        </p>
                    </div>
                    <div
                        class="mt-auto flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800"
                    >
                        <div></div>
                        <div class="flex flex-wrap gap-2 sm:gap-3">
                            <!-- <button
                                type="button"
                                @click="close"
                                class="hover:cursor-pointer px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg border border-primary text-primary hover:bg-primary/5 text-xs sm:text-sm font-bold transition-all"
                            >
                                {{ t('modalDetails.botoClose') }}
                            </button> -->

                            <InteractiveHoverButton
                              type="button"
                              @click="close"
                              class="hover:cursor-pointer rounded-lg text-white text-xs sm:text-sm font-bold transition-all"
                              variant="cancel"
                              :text="t('modalDetails.botoClose')"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>

    <EditModal
        v-if="showEditButton"
        v-model:open="showEditModal"
        :movie="movie"
        @save="onEditSave"
    />
</template>
