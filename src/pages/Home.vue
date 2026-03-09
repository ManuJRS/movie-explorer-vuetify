<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import HomeHero from '@/components/HomeHero.vue'
import HomeMockup from '@/components/HomeMockup.vue'
import HomeCards from '@/components/HomeCards.vue'
import Footer from '@/components/Footer.vue'
import CardVideo from '@/components/CardVideo.vue'
import ExplicationProject from '@/components/ExplicationProject.vue'
import PageLoader from '@/components/ui/PageLoader.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const isLoading = ref(true)

onMounted(async () => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 1800))
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
      <Footer />
    </template>
  </main>
</template>