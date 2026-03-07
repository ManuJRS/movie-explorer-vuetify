<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import HomeHero from '@/components/HomeHero.vue'
import HomeMockup from '@/components/HomeMockup.vue'
import HomeCards from '@/components/HomeCards.vue'
import Footer from '@/components/Footer.vue'
import ExplicationProject from '@/components/ExplicationProject.vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
</script>

<template>
  <main>
    <template v-if="!user">
      <HomeHero />
      <HomeMockup />
      <HomeCards />
      <ExplicationProject />
      <Footer />
    </template>
  </main>
</template>