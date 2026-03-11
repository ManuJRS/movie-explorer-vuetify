<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useMoviesStore } from '@/stores/movies';
import CustomSelect from '@/components/shared/CustomSelect.vue';
import PageLoader from '@/components/ui/PageLoader.vue'
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const isLoading = ref(true)

onMounted(async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1800))
  } finally {
    isLoading.value = false
  }
})
type FormErrors = { title: string; year: string; image: string; platform?: string };

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const moviesStore = useMoviesStore();
const title = ref('');
const year = ref('');
const image = ref('');
const platform = ref('');
const synopsis = ref('');
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
    { value: 'google', label: 'Google' }
];

const required = (value: string | number): true | string =>
    !!value || 'This field is required';
const isYear = (value: string | number): true | string =>
    (value && Number(value) > 1800 && Number(value) < 2100) || 'Ingrese un año válido';

const isFormValid = computed(() => {
    const titleValid = !!title.value;
    const yearValid = !!year.value && Number(year.value) > 1800 && Number(year.value) < 2100;
    const imageValid = !!image.value;
    return titleValid && yearValid && imageValid;
});

function validateField(field: 'title' | 'year' | 'image', value: string | number) {
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

async function handleSubmit() {
  const titleResult = required(title.value)
  const yearResult = required(year.value)
  const yearValidResult = isYear(year.value)
  const imageResult = required(image.value)

  errors.value = {
    title: typeof titleResult === 'string' ? titleResult : '',
    year:
      typeof yearResult === 'string'
        ? yearResult
        : (typeof yearValidResult === 'string' ? yearValidResult : ''),
    image: typeof imageResult === 'string' ? imageResult : '',
  }

  if (!errors.value.title && !errors.value.year && !errors.value.image) {
    try {
      await 
      console.log('IMAGE FIELD:', image.value)
      moviesStore.addMovie({
        title: title.value.trim(),
        year: year.value,
        image: image.value, 
        platform: platform.value || '',
        synopsis: synopsis.value || '',
      })

      // reset form
      title.value = ''
      year.value = ''
      image.value = ''
      platform.value = ''
      synopsis.value = ''
      errors.value = { title: '', year: '', image: '', platform: '' }
    } catch (e) {
      console.error(e)
    }
  }
}
</script>

<template>
    <PageLoader v-if="isLoading" />
    <div class="glass p-4 sm:p-6 md:p-8 rounded-xl border border-black/10 dark:border-white/10 mt-24 sm:mt-28 px-4 sm:px-6 mx-auto max-w-2xl w-[90%] sm:w-full">
        <h2 class="text-xl sm:text-2xl font-bold mb-2 text-slate-900 dark:text-white">{{ t('settingsPage.titlePreview') }}</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-6 sm:mb-8">
            {{ t('settingsPage.description') }}
        </p>
        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-4 sm:mb-3">
            <h3 class="text-sm sm:text-base font-bold tracking-wider text-slate-400 shrink-0">{{ t('settingsPage.ProfileName') }}:</h3>
            <h4 class="text-base sm:text-lg tracking-wider text-slate-900 dark:text-white break-words min-w-0">{{ user?.user_metadata?.username || user?.user_metadata?.name || '—' }}</h4>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-4 sm:mb-3">
            <h3 class="text-sm sm:text-base font-bold tracking-wider text-slate-400 shrink-0">{{ t('settingsPage.ProfileEmail') }}:</h3>
            <h4 class="text-base sm:text-lg tracking-wider text-slate-900 dark:text-white break-all min-w-0">{{ user?.email ?? '—' }}</h4>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <h3 class="text-sm sm:text-base font-bold tracking-wider text-slate-400 shrink-0">{{ t('settingsPage.Password') }}:</h3>
            <router-link to="/update-password" class="text-blue-500 hover:text-blue-600 underline sm:no-underline font-semibold text-base sm:text-lg">{{ t('settingsPage.UpdatePassword') }}</router-link>
        </div>
        <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 align-center justify-center mt-4">
            <router-link to="/movies" class="text-gray-500 hover:text-blue-600 underline sm:no-underline font-semibold text-base sm:text-lg flex items-center justify-center"><span class="material-symbols-outlined mr-2">arrow_back</span>{{ t('settingsPage.BackToMovies') }}</router-link>
        </div>
    </div>
</template>
