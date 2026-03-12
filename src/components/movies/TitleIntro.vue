<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

withDefaults(
  defineProps<{
    search?: string
  }>(),
  { search: '' }
)

const emit = defineEmits<{
  (e: 'update:search', value: string): void
}>()

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  emit('update:search', target?.value ?? '')
}
</script>

<template>
  <div class="flex flex-col gap-4 w-full mb-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-2xl md:text-3xl font-bold mb-2 text-center">
        {{ t('titleIntro.heading') }}
      </h2>
      <p class="text-slate-400 mb-4 text-center">
        {{ t('titleIntro.description') }}
      </p>
    </div>

    <div class="relative w-full max-w-md mx-auto">
      <span
        class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
        aria-hidden="true"
      >
        search
      </span>
      <input
        type="search"
        :value="search"
        :placeholder="t('titleIntro.searchPlaceholder')"
        class="w-full rounded-xl border border-white/10 bg-black/30 dark:bg-slate-800/50 py-3 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
        autocomplete="off"
        @input="onInput"
      />
      <button
        v-if="search"
        type="button"
        class="absolute pt-3 right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
        aria-label="Clear search"
        @click="emit('update:search', '')"
      >
        <span class="material-symbols-outlined text-lg">close</span>
      </button>
    </div>
  </div>
</template>