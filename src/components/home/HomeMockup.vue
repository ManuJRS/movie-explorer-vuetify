<script setup lang="ts">
import InteractiveHoverButton from '@/components/shared/InteractiveHoverButton.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <section class="py-12 md:py-24 relative overflow-hidden">
    <div class="max-w-6xl mx-auto px-6">
      <div class="relative group">
        
        <div class="absolute -top-12 -left-12 w-64 h-64 bg-primary/20 rounded-full blur-[100px] -z-10" />
        <div class="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -z-10" />
        <div
          class="glass p-4 rounded-2xl overflow-hidden shadow-2xl glow border border-white/20 transform hover:-translate-y-2 transition-all duration-500"
        >
          <div class="rounded-lg overflow-hidden relative">
            <div class="bg-background-dark/80 backdrop-blur-md p-6">
              <div class="flex gap-6 mb-8 flex-col md:flex-row">
                <div class="md:w-1/3 space-y-4">
                  <h2 class="text-2xl font-bold mb-2">{{t('form.title')}}</h2>
                  <p class="text-slate-500 dark:text-slate-400 text-sm mb-8">
                      {{t('form.description')}}
                  </p>
                  <label for="title" class="text-xs font-bold uppercase tracking-wider text-slate-400">{{t('form.movieTitle')}}</label>
                  <div class="h-10 w-full bg-white/5 rounded border border-white/10" />
                  <label for="image" class="text-xs font-bold uppercase tracking-wider text-slate-400">{{t('form.poster')}}</label>
                  <div class="h-10 w-full bg-white/5 rounded border border-white/10" />
                  <button
                    class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                    <span class="material-symbols-outlined text-base">edit</span>
                    <span>{{t('form.synopsis')}}</span>
                  </button>

                <InteractiveHoverButton
                  type="submit"
                  class="w-full mt-4 text-white font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  variant="common"
                  :text="t('form.submit')"
                />

                </div>
                <div class="md:w-2/3 grid grid-cols-3 gap-4">
                  <div
                    class="aspect-[2/3] bg-white/5 rounded-lg border border-white/10 relative overflow-hidden"
                  >
                    <img
                      alt="Preview"
                      class="w-full h-full object-cover opacity-60"
                      src="https://imgs.search.brave.com/qNtbcFQk80F4ELxi4HPi5mgp7gBxZOOWapflEoNXSr8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2VlLzQw/L2U0L2VlNDBlNDU0/NGIyN2JjMWMxZGYx/NzlhMjAyYmJjNjNi/LmpwZw"
                    />
                  </div>
                  <div
                    class="aspect-[2/3] bg-white/5 rounded-lg border border-white/10 relative overflow-hidden"
                  >
                    <img
                      alt="Preview"
                      class="w-full h-full object-cover opacity-60"
                      src="https://imgs.search.brave.com/XwuZOI_eYW1QGuRvdk5h0-YVFgfHbffrJGuJ89GQkDU/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2Y3L2Y2/LzFhL2Y3ZjYxYWJk/MmY0MmJiZjlmMjk0/NGZmYTgwZjFmNDFh/LmpwZw"
                    />
                  </div>
                  <div
                    class="aspect-[2/3] bg-white/5 rounded-lg border border-white/10 relative overflow-hidden"
                  >
                    <img
                      alt="Preview"
                      class="w-full h-full object-cover opacity-60"
                      src="https://imgs.search.brave.com/8A-ue9gWUi88rldo3wogczGLAc18k2Sn0mXLUxR_VSw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NzFDa0VobVFrcUwu/anBn"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
