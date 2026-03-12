<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import HomeHero from '@/components/home/HomeHero.vue'
import HomeMockup from '@/components/home/HomeMockup.vue'
import HomeCards from '@/components/home/HomeCards.vue'
import CardVideo from '@/components/home/CardVideo.vue'
import ExplicationProject from '@/components/home/ExplicationProject.vue'
import PageLoader from '@/components/ui/PageLoader.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const isLoading = ref(true)

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
      <CardVideo />
      <ExplicationProject />
    </template>
  </main>
</template>