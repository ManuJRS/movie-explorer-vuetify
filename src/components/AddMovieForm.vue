<script setup>
import { ref, computed } from 'vue';
import { useMoviesStore } from '../stores/movies';
import { getMovieFullData } from '../lib/tmdb';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
import CustomSelect from './CustomSelect.vue';
import MoviePosterSearch from './MoviePosterSearch.vue';
import InteractiveHoverButton from './InteractiveHoverButton.vue';
const moviesStore = useMoviesStore();
const title = ref('');
const year = ref('');
const image = ref('');
const platform = ref('');
const synopsis = ref('');
const selectedMovieFullData = ref(null);
const errors = ref({ title: '', year: '', image: '' });

const platformOptions = [
    { value: 'netflix', label: 'Netflix' },
    { value: 'amazon', label: 'Amazon' },
    { value: 'hbo', label: 'HBO' },
    { value: 'disney', label: 'Disney' },
    { value: 'hulu', label: 'Hulu' },
    { value: 'paramount', label: 'Paramount' },
    { value: 'apple', label: 'Apple' },
    { value: 'vudu', label: 'Vudu' },
    { value: 'google', label: 'Google' }
];

const required = (value) => !!value || t('errors.required');
const isYear = (value) =>
    (value && value > 1800 && value < 2100) || t('errors.invalidYear');

const isFormValid = computed(() => {
    const titleValid = !!title.value;
    const yearValid = !!year.value && year.value > 1800 && year.value < 2100;
    const imageValid = !!image.value;
    return titleValid && yearValid && imageValid;
});

async function handleSelectMovie(movie) {
    title.value = movie.title;
    year.value = movie.year || '';
    image.value = movie.posterUrl || '';

    try {
        const fullData = await getMovieFullData(movie.id);
        synopsis.value = fullData.synopsis || '';
        selectedMovieFullData.value = fullData;
        errors.value = { title: '', year: '', image: '' };
    } catch {
        selectedMovieFullData.value = null;
        errors.value = { title: '', year: '', image: '' };
    }
}

function validateField(field, value) {
    if (field === 'title') {
        const result = required(value);
        errors.value.title = typeof result === 'string' ? result : '';
    } else if (field === 'year') {
        const result = required(value);
        if (typeof result === 'string') {
            errors.value.year = result;
        } else {
            const yearResult = isYear(value);
            errors.value.year = typeof yearResult === 'string' ? yearResult : '';
        }
    } else if (field === 'image') {
        const result = required(value);
        errors.value.image = typeof result === 'string' ? result : '';
    }
}

function handleSubmit() {
    const titleResult = required(title.value);
    const yearResult = required(year.value);
    const yearValidResult = isYear(year.value);
    const imageResult = required(image.value);

    errors.value = {
        title: typeof titleResult === 'string' ? titleResult : '',
        year: typeof yearResult === 'string' ? yearResult : (typeof yearValidResult === 'string' ? yearValidResult : ''),
        image: typeof imageResult === 'string' ? imageResult : ''
    };

    if (!errors.value.title && !errors.value.year && !errors.value.image) {
        const baseMovie = {
            id: Date.now(),
            title: title.value,
            year: Number(year.value),
            image: image.value,
            platform: platform.value || null,
            synopsis: synopsis.value || null
        };

        if (selectedMovieFullData.value) {
            moviesStore.addMovie({
                ...baseMovie,
                genres: selectedMovieFullData.value.genres || [],
                runtime: selectedMovieFullData.value.runtime,
                rating: selectedMovieFullData.value.rating,
                directors: selectedMovieFullData.value.directors || [],
                mainActors: selectedMovieFullData.value.mainActors || [],
                writers: selectedMovieFullData.value.writers || []
            });
        } else {
            moviesStore.addMovie(baseMovie);
        }

        title.value = '';
        year.value = '';
        image.value = '';
        platform.value = '';
        synopsis.value = '';
        selectedMovieFullData.value = null;
        errors.value = { title: '', year: '', image: '', platform: '' };
    }
}
</script>

<template>
    <div class="glass p-8 rounded-xl sticky top-28 border border-black/10 dark:border-white/10">
        <h2 class="text-2xl font-bold mb-2">{{ t('addMovieForm.title') }}</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-8">
            {{ t('addMovieForm.description') }}
        </p>
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <MoviePosterSearch @select-movie="handleSelectMovie" />
            <div class="space-y-2">
                <label for="title" class="text-xs font-bold uppercase tracking-wider text-slate-400">{{ t('addMovieForm.movieTitleLabel') }}</label>
                <div class="relative">
                    <input
                        id="title"
                        v-model="title"
                        type="text"
                        :class="[
                            'w-full rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition-all placeholder:text-slate-600',
                            errors.title
                                ? 'bg-white/5 border border-rose-500/50 focus:ring-rose-500/20'
                                : title
                                    ? 'bg-white/5 border border-emerald-500/50 focus:ring-emerald-500/20'
                                    : 'bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary focus:ring-primary/20'
                        ]"
                        :placeholder="t('addMovieForm.movieTitleplaceholder')"
                        @blur="validateField('title', title)"
                    />
                    <span
                        v-if="title"
                        class="material-symbols-outlined absolute right-3 top-3"
                        :class="errors.title ? 'text-rose-500' : 'text-emerald-500'"
                    >
                        {{ errors.title ? 'warning' : 'check_circle' }}
                    </span>
                </div>
                <p v-if="errors.title" class="text-xs text-rose-500 font-medium">{{ errors.title }}</p>
                <p v-else-if="title" class="text-xs text-emerald-500 font-medium">Looks good!</p>
            </div>

            <div class="space-y-2">
                <label for="image" class="text-xs font-bold uppercase tracking-wider text-slate-400">{{ t('addMovieForm.posterLabel') }}</label>
                <div class="relative">
                    <input
                        id="image"
                        v-model="image"
                        type="url"
                        :class="[
                            'w-full rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition-all placeholder:text-slate-600',
                            errors.image
                                ? 'bg-white/5 border border-rose-500/50 focus:ring-rose-500/20'
                                : image
                                    ? 'bg-white/5 border border-emerald-500/50 focus:ring-emerald-500/20'
                                    : 'bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary focus:ring-primary/20'
                        ]"
                        :placeholder="t('addMovieForm.posterPlaceholder')"
                        @blur="validateField('image', image)"
                    />
                    <span
                        v-if="image"
                        class="material-symbols-outlined absolute right-3 top-3"
                        :class="errors.image ? 'text-rose-500' : 'text-emerald-500'"
                    >
                        {{ errors.image ? 'warning' : 'check_circle' }}
                    </span>
                </div>
                <p v-if="errors.image" class="text-xs text-rose-500 font-medium">{{ errors.image }}</p>
                <p v-else-if="image" class="text-xs text-emerald-500 font-medium">Looks good!</p>
            </div>

            <div class="space-y-2">
                <label for="year" class="text-xs font-bold uppercase tracking-wider text-slate-400">{{ t('addMovieForm.yearLabel') }}</label>
                <div class="relative">
                    <input
                        id="year"
                        v-model="year"
                        type="number"
                        :class="[
                            'w-full rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition-all placeholder:text-slate-600',
                            errors.year
                                ? 'bg-white/5 border border-rose-500/50 focus:ring-rose-500/20'
                                : year
                                    ? 'bg-white/5 border border-emerald-500/50 focus:ring-emerald-500/20'
                                    : 'bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary focus:ring-primary/20'
                        ]"
                        placeholder="2024"
                        @blur="validateField('year', year)"
                    />
                    <span
                        v-if="year && !errors.year"
                        class="material-symbols-outlined absolute right-3 top-3 text-emerald-500"
                    >
                        check_circle
                    </span>
                    <span
                        v-else-if="errors.year"
                        class="material-symbols-outlined absolute right-3 top-3 text-rose-500"
                    >
                        warning
                    </span>
                </div>
                <p v-if="errors.year" class="text-xs text-rose-500 font-medium">{{ errors.year }}</p>
                <p v-else-if="year && !errors.year" class="text-xs text-emerald-500 font-medium">Looks good!</p>
            </div>
            <!-- <div class="space-y-2">
                <label v-if="platform" class="text-xs font-bold uppercase tracking-wider text-slate-400">Plataforma</label>
                <CustomSelect
                    v-model="platform"
                    placeholder="Selecciona una plataforma"
                    :options="platformOptions"
                />
            </div> -->
            <InteractiveHoverButton
                type="submit"
                variant="common"
                text="Add to shelf"
                :disabled="!isFormValid"
                class="w-full mt-4 flex py-4 items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
            >
                <span>Add to shelf</span>
                <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </InteractiveHoverButton>
        </form>
    </div>
</template>
