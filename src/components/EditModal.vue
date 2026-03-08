<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Movie } from '@/stores/movies'
import CustomSelect from '@/components/CustomSelect.vue'
import { useI18n } from 'vue-i18n';
import InteractiveHoverButton from '@/components/InteractiveHoverButton.vue';

const { t } = useI18n();
type FormErrors = { title: string; year: string; image: string; platform?: string };

const props = defineProps<{
  open: boolean
  movie: { id?: string; title?: string; year?: string; image?: string; platform?: string; synopsis?: string } | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [movie: Movie]
}>()

const title = ref('')
const year = ref('')
const image = ref('')
const platform = ref('')
const synopsis = ref('')
const errors = ref<FormErrors>({ title: '', year: '', image: '' });


const platformOptions = [
  { value: 'netflix', label: 'Netflix' },
  { value: 'amazon', label: 'Amazon' },
  { value: 'hbo', label: 'HBO' },
  { value: 'disney', label: 'Disney' },
  { value: 'hulu', label: 'Hulu' },
  { value: 'paramount', label: 'Paramount' },
  { value: 'apple', label: 'Apple' },
  { value: 'vudu', label: 'Vudu' },
  { value: 'google', label: 'Google' },
]

watch(
  () => [props.open, props.movie] as const,
  ([open, movie]) => {
    if (open && movie) {
      title.value = movie.title ?? ''
      year.value = movie.year ?? ''
      image.value = movie.image ?? ''
      platform.value = movie.platform ?? ''
      synopsis.value = movie.synopsis ?? ''
    }
  },
  { immediate: true }
)

function close() {
  emit('update:open', false)
}

function discard() {
  close()
}

const required = (value: string | number): true | string =>
  !!value || t('form.warning')
const isYear = (value: string | number): true | string =>
  (value && Number(value) > 1800 && Number(value) < 2100) || t('form.warningYear')

const isFormValid = computed(() => {
  const titleValid = !!title.value.trim()
  const yearNum = Number(year.value)
  const yearValid = !!year.value && yearNum > 1800 && yearNum < 2100
  const imageValid = !!image.value.trim()
  return titleValid && yearValid && imageValid
})

function validateField(field: 'title' | 'year' | 'image', value: string | number) {
  if (field === 'title') {
    const result = required(value)
    errors.value.title = typeof result === 'string' ? result : ''
  } else if (field === 'year') {
    const result = required(value)
    if (typeof result === 'string') {
      errors.value.year = result
    } else {
      const yearResult = isYear(value)
      errors.value.year = typeof yearResult === 'string' ? yearResult : ''
    }
  } else if (field === 'image') {
    const result = required(value)
    errors.value.image = typeof result === 'string' ? result : ''
  }
}

function onSubmit() {
  const id = props.movie?.id
  if (!id) return

  const titleResult = required(title.value)
  const yearResult = required(year.value)
  const yearValidResult = isYear(year.value)
  const imageResult = required(image.value)

  errors.value = {
    title: typeof titleResult === 'string' ? titleResult : '',
    year:
      typeof yearResult === 'string'
        ? yearResult
        : typeof yearValidResult === 'string'
          ? yearValidResult
          : '',
    image: typeof imageResult === 'string' ? imageResult : '',
  }

  if (errors.value.title || errors.value.year || errors.value.image) return

  const movie = props.movie as Movie
  const updated: Movie = {
    id,
    title: title.value.trim(),
    year: String(year.value),
    image: image.value.trim(),
    platform: platform.value || '',
    synopsis: synopsis.value || '',
    ...(movie?.genres && { genres: movie.genres }),
    ...(movie?.runtime != null && { runtime: movie.runtime }),
    ...(movie?.rating != null && { rating: movie.rating }),
    ...(movie?.directors?.length && { directors: movie.directors }),
    ...(movie?.mainActors?.length && { mainActors: movie.mainActors }),
    ...(movie?.writers?.length && { writers: movie.writers }),
  }
  emit('save', updated)
  emit('update:open', false)
}

</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background-dark/80 backdrop-blur-sm overflow-y-auto"
      @click.self="close"
    >
      <div class="bg-background-light dark:bg-background-dark/90 dark:border-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold text-white">{{ t('modalModify.title') }}</h2>
            <p class="text-slate-500 text-sm mt-1">{{ t('modalModify.description') }}</p>
          </div>
          <button
            type="button"
            class="p-2 rounded-full text-slate-400 hover:cursor-pointer hover:text-red-500 transition-colors"
            :aria-label="t('modalDetails.botoClose')"
            @click="close"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form class="space-y-6" @submit.prevent="onSubmit">
          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-400">{{ t('form.movieTitle') }}</label>
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
              :placeholder="t('form.titlePlaceholder')"
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
            <p v-else-if="title" class="text-xs text-emerald-500 font-medium">{{ t('form.looksGood') }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label for="year" class="text-xs font-bold uppercase tracking-wider text-slate-400">{{ t('form.year') }}</label>
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
                  :placeholder="t('form.yearPlaceholder')"
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
              <p v-else-if="year && !errors.year" class="text-xs text-emerald-500 font-medium">{{ t('form.looksGood') }}</p>
            </div>
            <div class="space-y-2">
              <label class="text-xs font-bold uppercase tracking-widest text-slate-400">{{ t('form.platform') }}</label>
              <CustomSelect v-model="platform" :placeholder="t('form.ChosePlatform')" :options="platformOptions" />
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-400">{{ t('form.synopsis') }}</label>
            <textarea
              v-model="synopsis"
              class="w-full p-4 rounded-lg bg-white/5 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary/20 focus:outline-none resize-y"
              :placeholder="t('modalSynopsis.description')"
            />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold uppercase tracking-widest text-slate-400">{{ t('form.poster') }}</label>
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
                :placeholder="t('form.posterPlaceholder')"
                @blur="validateField('image', image)"
              />
              <span
                  v-if="image"
                  class="material-symbols-outlined absolute right-3 top-3"
                  :class="errors.image ? 'text-rose-500' : 'text-emerald-500'"
                    > {{ errors.image ? 'warning' : 'check_circle' }} </span>
            </div>
            <p v-if="errors.image" class="text-xs text-rose-500 font-medium">{{ errors.image }}</p>
            <p v-else-if="image" class="text-xs text-emerald-500 font-medium">{{ t('form.looksGood') }}</p>
          </div>

          <div class="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-end gap-3">
            <div class="flex items-center justify-end gap-2">
              <InteractiveHoverButton
                type="button"
                @click="discard"
                class="hover:cursor-pointer rounded-lg text-white font-bold transition-all"
                variant="cancel"
                :text="t('modalModify.btnCancel')"
              />
              <InteractiveHoverButton
                type="submit"
                :disabled="!isFormValid"
                class="hover:cursor-pointer rounded-lg text-white font-bold transition-all"
                variant="save"
                :text="t('modalModify.btnSave')"
              />
            </div>
            <!-- <button
              type="button"
              class="px-6 py-3 hover:cursor-pointer px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg border border-primary text-primary hover:bg-primary/5 text-xs sm:text-sm font-bold transition-all"
              @click="discard"
            >
              {{ t('modalModify.btnCancel') }}
            </button> -->
            <!-- <button
              type="submit"
              class="hover:cursor-pointer px-8 bg-blue-600 hover:shadow-[0_0_20px_rgba(17,82,212,0.4)] text-white font-bold md:py-4 py-2 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              :disabled="!isFormValid"
            >
              <span>{{ t('modalModify.btnSave') }}</span>
              <span class="material-symbols-outlined text-xl">check</span>
            </button> -->
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
