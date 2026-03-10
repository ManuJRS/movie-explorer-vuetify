<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import InteractiveHoverButton from '@/components/InteractiveHoverButton.vue'
</script>

<template>
  <header class="relative min-h-[60vh] flex items-center justify-center pt-20 overflow-hidden">
    <div class="absolute inset-0 z-0">
      <video
        autoplay
        muted
        loop  
        class="w-full h-full object-cover object-bottom opacity-60 scale-105 blur-xs"
        type="video/mp4"
      >
        <source src="https://res.cloudinary.com/dronteu5m/video/upload/v1773004245/Dise%C3%B1o_sin_t%C3%ADtulo_5_wah75m.mp4" type="video/mp4">
      </video>
      <div
        class="absolute inset-0 bg-gradient-to-b via-background-dark/10 to-background-dark"
      />
    </div>
    <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
      <div class="glass-darker-hero md:p-12 p-6 rounded-3xl border border-white/10 inline-block w-full">
        <h2 class="text-3xl md:text-7xl font-extrabold mb-6 tracking-tight text-gradient">
          {{t('homePage.title')}}
        </h2>
        <p class="text-sm md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          {{t('homePage.description')}}
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 ">
          <a href="https://sym-mpv.netlify.app/" target="_blank" class="hover:scale-105 transition-all duration-300  rounded-xl hover:bg-white/10"> 
        <InteractiveHoverButton class="w-full sm:w-auto glass hover:cursor-pointer text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2" text="Demo" IconType="play" />
          </a>
        </div>
      </div>
    </div>
  </header>
</template>
