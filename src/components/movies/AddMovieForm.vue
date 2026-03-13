<script setup lang="ts">
import { ref, computed } from 'vue'
import SynopsisModal from '@/components/movies/SynopsisModal.vue'
import InteractiveHoverButton from '@/components/shared/InteractiveHoverButton.vue'
import MoviePosterSearch from '@/components/movies/MoviePosterSearch.vue'
import { useWindowWidth } from '@/composables/useWindowWidth'
import { useAddMovieForm } from '@/composables/useAddMovieForm'
import { useI18n } from 'vue-i18n'

// composables
const windowWidth = useWindowWidth()
const { t } = useI18n()

const {
  title,
  year,
  image,
  platform,
  synopsis,
  selectedMovieId,
  errors,
  isFormValid,
  handleSubmit,
  resetForm,
  handleSelectMovie,
  validateField,
} = useAddMovieForm(t)

// local state
const showMobileFormModal = ref(false)
const showSynopsisModal = ref(false)

// computed
const isMobile = computed(() => windowWidth.value < 640)

// handlers
function openMobileFormModal() {
  showMobileFormModal.value = true
}

function closeMobileFormModal() {
  showMobileFormModal.value = false
}

function openSynopsisModal() {
  showSynopsisModal.value = true
}

const submitForm = async () => {
  const success = await handleSubmit()

  if (success) {
    showMobileFormModal.value = false
  }
}

// expose
defineExpose({
  openMobileFormModal,
})
</script>

<template>
  <div
    v-if="!isMobile"
    class="glass p-8 rounded-xl sticky top-28 border border-black/10 dark:border-white/10"
  >
    <div class="flex items-center gap-2">
      <h2 class="text-2xl font-bold mb-2">{{ t('form.title') }}</h2>
      <router-link to="/info">
        <span class="material-symbols-outlined text-sm text-blue-500 mb-2 hover:cursor-pointer hover:text-blue-600 transition-all duration-300">
          info
        </span>
      </router-link>
    </div>

    <p class="text-slate-500 dark:text-slate-400 text-sm mb-8">
      {{ t('form.description') }}
    </p>

    <form @submit.prevent="submitForm" class="space-y-5">
      <MoviePosterSearch @select-movie="handleSelectMovie" />

      <div class="space-y-2">
        <label for="title" class="text-xs font-bold uppercase tracking-wider text-slate-400">
          {{ t('form.movieTitle') }}
        </label>
        <div class="relative">
          <input
            id="title"
            v-model="title"
            type="text"
            disabled
            :class="[
              'w-full rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition-all placeholder:text-slate-600',
              errors?.title
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
            :class="errors?.title ? 'text-rose-500' : 'text-emerald-500'"
          >
            {{ errors?.title ? 'warning' : 'check_circle' }}
          </span>
        </div>
        <p v-if="errors?.title" class="text-xs text-rose-500 font-medium">{{ t('form.warning') }}</p>
        <p v-else-if="title" class="text-xs text-emerald-500 font-medium">{{ t('form.looksGood') }}</p>
      </div>

      <div class="space-y-2">
        <label for="image" class="text-xs font-bold uppercase tracking-wider text-slate-400">
          {{ t('form.poster') }}
        </label>

        <div class="relative">
          <input
            id="image"
            v-model="image"
            type="url"
            disabled
            :class="[
              'w-full rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition-all placeholder:text-slate-600',
              errors?.image
                ? 'bg-white/5 border border-rose-500/50 focus:ring-rose-500/20'
                : image
                  ? 'bg-white/5 border border-emerald-500/50 focus:ring-emerald-500/20'
                  : 'bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary focus:ring-primary/20'
            ]"
            placeholder="https://image-url.com/poster.jpg"
            @blur="validateField('image', image)"
          />
          <span
            v-if="image"
            class="material-symbols-outlined absolute right-3 top-3"
            :class="errors?.image ? 'text-rose-500' : 'text-emerald-500'"
          >
            {{ errors?.image ? 'warning' : 'check_circle' }}
          </span>
        </div>
        <p v-if="errors?.image" class="text-xs text-rose-500 font-medium">{{ errors?.image }}</p>
        <p v-else-if="image" class="text-xs text-emerald-500 font-medium">{{ t('form.looksGood') }}</p>
      </div>

      <div class="space-y-2">
        <label for="year" class="text-xs font-bold uppercase tracking-wider text-slate-400">
          {{ t('form.year') }}
        </label>
        <div class="relative">
          <input
            id="year"
            v-model="year"
            type="number"
            disabled
            :class="[
              'w-full rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition-all placeholder:text-slate-600',
              errors?.year
                ? 'bg-white/5 border border-rose-500/50 focus:ring-rose-500/20'
                : year
                  ? 'bg-white/5 border border-emerald-500/50 focus:ring-emerald-500/20'
                  : 'bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary focus:ring-primary/20'
            ]"
            placeholder="2024"
            @blur="validateField('year', year)"
          />
          <span
            v-if="year && !errors?.year"
            class="material-symbols-outlined absolute right-3 top-3 text-emerald-500"
          >
            check_circle
          </span>
          <span
            v-else-if="errors?.year"
            class="material-symbols-outlined absolute right-3 top-3 text-rose-500"
          >
            warning
          </span>
        </div>
        <p v-if="errors?.year" class="text-xs text-rose-500 font-medium">{{ errors?.year }}</p>
        <p v-else-if="year && !errors?.year" class="text-xs text-emerald-500 font-medium">{{ t('form.looksGood') }}</p>
      </div>
<!-- 
      <div class="pt-4 flex items-center justify-between">
        <button
          type="button"
          @click="openSynopsisModal"
          class="hover:cursor-pointer flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        >
          <span class="material-symbols-outlined text-base">edit</span>
          <span>{{ t('form.synopsis') }}</span>
        </button>
        <span
          v-if="synopsis"
          class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
        >
          {{ t('form.added') }}
        </span>
      </div> -->

      <InteractiveHoverButton
        type="submit"
        :disabled="!isFormValid"
        class="w-full mt-4 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
        variant="common"
        :text="t('form.submit')"
      />
    </form>

    <SynopsisModal v-model="synopsis" v-model:open="showSynopsisModal" />
  </div>

  <div v-else class="w-full top-2">

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showMobileFormModal"
          class="fixed inset-0 z-50 bg-background-dark/80 backdrop-blur-sm flex items-end"
          @click.self="closeMobileFormModal"
        >
          <Transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="translate-y-full"
            enter-to-class="translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="translate-y-0"
            leave-to-class="translate-y-full"
          >
            <div
              v-if="showMobileFormModal"
              class="w-full max-h-[100vh] overflow-hidden rounded-t-2xl border border-black/10 dark:border-white/10 bg-background-light dark:bg-slate-900 shadow-2xl"
            >
              <div class="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-background-light/95 dark:bg-slate-900/95 backdrop-blur-sm">
                <div class="flex items-center justify-between px-4 py-4">
                  <div>
                    <h2 class="text-lg font-bold">{{ t('form.title') }}</h2>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {{ t('form.description') }}
                    </p>
                  </div>

                  <button
                    type="button"
                    @click="closeMobileFormModal"
                    class="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 hover:cursor-pointer"
                    aria-label="Close modal"
                  >
                    <span class="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>

              <div class="overflow-y-auto px-4 py-5 pb-28">
                <form @submit.prevent="submitForm" class="space-y-5">
                  <MoviePosterSearch @select-movie="handleSelectMovie" />

                  <div class="space-y-2">
                    <label for="title-mobile" class="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {{ t('form.movieTitle') }}
                    </label>
                    <div class="relative">
                      <input
                        id="title-mobile"
                        v-model="title"
                        type="text"
                        disabled
                        :class="[
                          'w-full rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition-all placeholder:text-slate-600',
                          errors?.title
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
                        :class="errors?.title ? 'text-rose-500' : 'text-emerald-500'"
                      >
                        {{ errors?.title ? 'warning' : 'check_circle' }}
                      </span>
                    </div>
                    <p v-if="errors?.title" class="text-xs text-rose-500 font-medium">{{ t('form.warning') }}</p>
                    <p v-else-if="title" class="text-xs text-emerald-500 font-medium">{{ t('form.looksGood') }}</p>
                  </div>

                  <div class="space-y-2">
                    <label for="image-mobile" class="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {{ t('form.poster') }}
                    </label>

                    <div class="relative">
                      <input
                        id="image-mobile"
                        v-model="image"
                        type="url"
                        disabled
                        :class="[
                          'w-full rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition-all placeholder:text-slate-600',
                          errors?.image
                            ? 'bg-white/5 border border-rose-500/50 focus:ring-rose-500/20'
                            : image
                              ? 'bg-white/5 border border-emerald-500/50 focus:ring-emerald-500/20'
                              : 'bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary focus:ring-primary/20'
                        ]"
                        placeholder="https://image-url.com/poster.jpg"
                        @blur="validateField('image', image)"
                      />
                      <span
                        v-if="image"
                        class="material-symbols-outlined absolute right-3 top-3"
                        :class="errors?.image ? 'text-rose-500' : 'text-emerald-500'"
                      >
                        {{ errors?.image ? 'warning' : 'check_circle' }}
                      </span>
                    </div>
                    <p v-if="errors?.image" class="text-xs text-rose-500 font-medium">{{ errors?.image }}</p>
                    <p v-else-if="image" class="text-xs text-emerald-500 font-medium">{{ t('form.looksGood') }}</p>
                  </div>

                  <div class="space-y-2">
                    <label for="year-mobile" class="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {{ t('form.year') }}
                    </label>
                    <div class="relative">
                      <input
                        id="year-mobile"
                        v-model="year"
                        type="number"
                        disabled
                        :class="[
                          'w-full rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition-all placeholder:text-slate-600',
                          errors?.year
                            ? 'bg-white/5 border border-rose-500/50 focus:ring-rose-500/20'
                            : year
                              ? 'bg-white/5 border border-emerald-500/50 focus:ring-emerald-500/20'
                              : 'bg-white/5 border border-black/10 dark:border-white/10 focus:border-primary focus:ring-primary/20'
                        ]"
                        placeholder="2024"
                        @blur="validateField('year', year)"
                      />
                      <span
                        v-if="year && !errors?.year"
                        class="material-symbols-outlined absolute right-3 top-3 text-emerald-500"
                      >
                        check_circle
                      </span>
                      <span
                        v-else-if="errors?.year"
                        class="material-symbols-outlined absolute right-3 top-3 text-rose-500"
                      >
                        warning
                      </span>
                    </div>
                    <p v-if="errors?.year" class="text-xs text-rose-500 font-medium">{{ errors?.year }}</p>
                    <p v-else-if="year && !errors?.year" class="text-xs text-emerald-500 font-medium">{{ t('form.looksGood') }}</p>
                  </div>

                  <div class="pt-2 flex items-center justify-between">
                    <button
                      type="button"
                      @click="openSynopsisModal"
                      class="hover:cursor-pointer flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <span class="material-symbols-outlined text-base">edit</span>
                      <span>{{ t('form.synopsis') }}</span>
                    </button>

                    <span
                      v-if="synopsis"
                      class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    >
                      {{ t('form.added') }}
                    </span>
                  </div>

                  <div class="sticky bottom-0 left-0 right-0 bg-background-light dark:bg-slate-900 pt-4">
                    <InteractiveHoverButton
                      type="submit"
                      :disabled="!isFormValid"
                      class="w-full text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                      variant="common"
                      :text="t('form.submit')"
                    />
                  </div>
                </form>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <SynopsisModal v-model="synopsis" v-model:open="showSynopsisModal" />
  </div>
</template>
