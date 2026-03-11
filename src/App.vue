<script setup lang="ts">
import { watch } from 'vue'
import FloatingHeader from '@/components/layout/FloatingHeader.vue'
import Footer from '@/components/layout/Footer.vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'

const { isDark } = storeToRefs(useThemeStore())

watch(isDark, (value) => {
  if (value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}, { immediate: true })
</script>

<template>
  <FloatingHeader />
  <router-view />
  <Footer />
</template>