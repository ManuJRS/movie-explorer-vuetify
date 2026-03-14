<script setup lang="ts">
import { onMounted, ref, nextTick, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useI18n } from 'vue-i18n'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeMockup from '@/components/home/HomeMockup.vue'
import HomeCards from '@/components/home/HomeCards.vue'
import CardVideo from '@/components/home/CardVideo.vue'
import ExplicationProject from '@/components/home/ExplicationProject.vue'
import PageLoader from '@/components/ui/PageLoader.vue'
import FeaturesCard from '@/components/home/FeaturesCard.vue'

const { t } = useI18n()
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const isLoading = ref(true)

const mobileFeatures = computed(() => [
  {
    icon: 'favorite',
    title: t('homeFeatures.card1Item1Title'),
    description: t('homeFeatures.card1Item1Description'),
  },
])

const mobileFeaturesCardTwo = computed(() => [
  {
    icon: 'movie',
    title: t('homeFeatures.card2Item1Title'),
    description: t('homeFeatures.card2Item1Description'),
  },
])

const mobileFeaturesCardThree = computed(() => [
  {
    icon: 'date_range',
    title: t('homeFeatures.card3Item1Title'),
    description: t('homeFeatures.card3Item1Description'),
  },
  {
    icon: 'theater_comedy',
    title: t('homeFeatures.card3Item2Title'),
    description: t('homeFeatures.card3Item2Description'),
  },
  {
    icon: 'video_camera_front',
    title: t('homeFeatures.card3Item3Title'),
    description: t('homeFeatures.card3Item3Description'),
  },
])

onMounted(async () => {
  try {
    await authStore.init()
    await nextTick()
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <PageLoader v-if="isLoading" />
  <main>
    <template v-if="!user">
      <HomeHero />
      <HomeMockup />
      <HomeCards />
      <CardVideo
        :items="mobileFeatures"
        :title="t('homeFeatures.card1Title')"
        media-position="right"
        media-type="video"
        video-src="https://res.cloudinary.com/dronteu5m/video/upload/q_auto:good,w_480,c_limit/v1773495589/recomended-movies-mobile_usqbhe.mp4"
        poster-src="https://res.cloudinary.com/dronteu5m/image/upload/f_auto,q_80,w_1200,c_limit/v1773497580/recomended-movies-poster_rjrr1w"
        :description="t('homeFeatures.card1Description')"
      />
      <CardVideo
        :items="mobileFeaturesCardTwo"
        :title="t('homeFeatures.card2Title')"
        media-position="left"
        media-type="video"
        video-src="https://res.cloudinary.com/dronteu5m/video/upload/q_auto:good,w_480,c_limit/v1773498555/watch-trailer_lwryus.mp4"
        poster-src="https://res.cloudinary.com/dronteu5m/image/upload/f_auto,q_80,w_1200,c_limit/v1773496859/watch-trailer-poster_rosgjf"
        :description="t('homeFeatures.card2Description')"
      />
      <CardVideo
        :items="mobileFeaturesCardThree"
        :title="t('homeFeatures.card3Title')"
        media-position="right"
        media-type="video"
        video-src="https://res.cloudinary.com/dronteu5m/video/upload/q_auto:good,w_480,c_limit/v1773495584/your-favorite-movies-mobile_veqquy.mp4"
        poster-src="https://res.cloudinary.com/dronteu5m/image/upload/f_auto,q_80,w_1200,c_limit/v1773498844/favorites-movies-poster_aehshb"
        :description="t('homeFeatures.card3Description')"
      />
      <ExplicationProject />
      <FeaturesCard />
    </template>
  </main>
</template>