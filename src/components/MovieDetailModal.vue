<script setup>
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
    }
});

const emit = defineEmits(['update:open', 'save']);

function close() {
    emit('update:open', false);
}

function save() {
    emit('save');
    emit('update:open', false);
}
</script>

<template>
    <Teleport to="body">
        <div
            v-if="open"
            class="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-40 flex items-center justify-center p-6"
            @click.self="close"
        >
            <div
                class="relative w-full max-w-5xl bg-background-light dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row h-full max-h-[800px]"
            >
                <button
                    type="button"
                    @click="close"
                    class="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                >
                    <span class="material-symbols-outlined">close</span>
                </button>
                <div
                    class="w-full md:w-2/5 h-64 md:h-auto relative bg-slate-200 dark:bg-slate-800 flex items-center justify-center border-r border-slate-200 dark:border-slate-800"
                >
                    <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                    <div
                        class="w-full h-full bg-cover bg-center absolute inset-0"
                        :style="movie?.image ? { backgroundImage: `url(${movie.image})` } : {}"
                    ></div>
                    <div class="absolute bottom-6 left-6 right-6 z-20"></div>
                </div>
                <div class="w-full md:w-3/5 p-8 overflow-y-auto flex flex-col">
                    <div class="mb-8">
                        <div class="flex items-center gap-3 mb-2">
                            <h1 class="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                                {{ movie?.title || '—' }}
                            </h1>
                            <span
                                v-if="movie?.year"
                                class="px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-sm font-semibold"
                            >
                                {{ movie.year }}
                            </span>
                        </div>
                        <div class="flex flex-wrap gap-2 mt-4">
                            <span
                                v-if="movie?.platform"
                                class="px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-medium uppercase tracking-wide"
                            >
                                {{ movie.platform }}
                            </span>
                        </div>
                    </div>
                    <div class="mb-8">
                        <h2 class="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] mb-3">
                            Synopsis
                        </h2>
                        <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                            {{ movie?.synopsis || 'No Synopsis added' }}
                        </p>
                    </div>
                    <div
                        class="mt-auto flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800"
                    >
                        <div></div>
                        <div class="flex flex-wrap gap-2 sm:gap-3">
                            <button
                                type="button"
                                @click="close"
                                class="hover:cursor-pointer px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg border border-primary text-primary hover:bg-primary/5 text-xs sm:text-sm font-bold transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
