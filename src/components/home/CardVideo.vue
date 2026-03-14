<script setup lang="ts">
type FeatureItem = {
  icon: string
  title: string
  description: string
}

interface Props {
  title: string
  description: string
  items: FeatureItem[]
  mediaPosition?: 'left' | 'right'
  videoSrc?: string
  posterSrc?: string
  imageSrc?: string
  imageAlt?: string
  mediaType?: 'video' | 'image'
}

withDefaults(defineProps<Props>(), {
  mediaPosition: 'right',
  videoSrc: '',
  posterSrc: '',
  imageSrc: '',
  imageAlt: 'Feature media',
  mediaType: 'video',
})
</script>

<template>
  <section class="py-24 px-6 overflow-hidden">
    <div
      class="max-w-7xl mx-auto flex flex-col items-center gap-16"
      :class="mediaPosition === 'left' ? 'lg:flex-row-reverse' : 'lg:flex-row'"
    >
      <!-- Content -->
      <div class="lg:w-1/2 space-y-8">
        <h2 class="text-4xl md:text-5xl font-black tracking-tight" v-html="title"></h2>

        <p class="text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
          {{ description }}
        </p>

        <div class="space-y-6">
          <div
            v-for="item in items"
            :key="`${item.title}-${item.icon}`"
            class="flex items-start gap-4"
          >
            <div class="p-2 bg-primary/20 rounded-lg">
              <span class="material-symbols-outlined text-primary">
                {{ item.icon }}
              </span>
            </div>

            <div>
              <h4 class="font-bold text-lg">
                {{ item.title }}
              </h4>
              <p class="text-slate-500 dark:text-slate-400">
                {{ item.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Media -->
      <div class="lg:w-1/2 relative">
        <div
          class="relative mx-auto w-[280px] h-[580px] bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden"
        >
          <template v-if="mediaType === 'video' && videoSrc">
            <video
              autoplay
              loop
              muted
              playsinline
              preload="metadata"
              :poster="posterSrc ? posterSrc : ''"
              class="absolute inset-0 w-full h-full object-cover"
            >
              <source :src="videoSrc" type="video/mp4" />
            </video>
            <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10">
         </div>
         
          </template>

          

          <template v-else-if="mediaType === 'image' && imageSrc">
            <img
              :src="imageSrc"
              :alt="imageAlt"
              class="absolute inset-0 w-full h-full object-cover"
            />
          </template>


        </div>

        <div
          class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10"
        ></div>
      </div>
    </div>
  </section>
</template>