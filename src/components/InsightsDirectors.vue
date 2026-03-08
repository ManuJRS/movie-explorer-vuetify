<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps<{
  directors?: string[]
}>()

function avatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=64&background=6366f1&color=fff`
}
</script>

<template>
    <section class="space-y-6 pt-16">
                <h3 class="text-xl font-bold flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">movie_edit</span>
                    {{ t('insightsPage.DirectorsTitle') }}
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div
                        v-for="director in directors"
                        :key="director"
                        class="glass p-4 rounded-2xl flex flex-col items-center text-center gap-3 hover:bg-primary/5 transition-colors"
                    >
                        <div class="size-16 rounded-full overflow-hidden">
                            <img
                                class="w-full h-full object-cover"
                                :alt="`Portrait of ${director}`"
                                :src="avatarUrl(director)"
                            />
                        </div>
                        <span class="text-xs font-bold leading-tight line-clamp-2">{{ director }}</span>
                    </div>
                    <div v-if="!directors?.length" class="col-span-2 sm:col-span-3 text-slate-500 text-sm py-8 text-center">
                        No directors data yet. Add movies from TMDB search to see your top directors.
                    </div>
                </div>                
    </section>
</template>