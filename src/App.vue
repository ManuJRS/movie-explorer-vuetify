<script setup lang="ts">
import { watch } from 'vue'
import Navbar from '@/components/Navbar.vue'
import FloatingHeader from '@/components/FloatingHeader.vue'
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
</template>