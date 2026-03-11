<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
defineProps<{
  actors?: string[]
}>()

function avatarUrl(name: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=96&background=6366f1&color=fff`
}
</script>

<template>
        <section class="space-y-6 pt-8">
            <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary">group</span>
                    {{ t('insightsPage.ActorsTitle') }}
                </h3>
            </div>
            <div class="flex gap-6 overflow-x-auto pb-4 hide-scrollbar">
                <div
                    v-for="actor in actors"
                    :key="actor"
                    class="flex flex-col items-center gap-3 min-w-[100px] group cursor-pointer"
                >
                    <div
                        class="size-24 rounded-full overflow-hidden ring-4 ring-transparent group-hover:ring-primary transition-all duration-300"
                    >
                        <img
                            class="w-full h-full object-cover"
                            :alt="`Portrait of ${actor}`"
                            :src="avatarUrl(actor)"
                        />
                    </div>
                    <span class="text-sm font-semibold group-hover:text-primary transition-colors text-center line-clamp-2">
                        {{ actor.split(' ').length > 2 ? actor.split(' ')[0] + ' ' + actor.split(' ').slice(-1)[0] : actor }}
                    </span>
                </div>
                <div v-if="!actors?.length" class="text-slate-500 text-sm py-8">
                    No actors data yet. Add movies from TMDB search to see your favorite actors.
                </div>
            </div>
        </section>
</template>