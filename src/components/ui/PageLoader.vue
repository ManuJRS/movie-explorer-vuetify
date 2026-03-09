<script setup lang="ts">
import BouncingDots from '@/components/ui/BouncingDots.vue'

interface Props {
  message?: string
}

withDefaults(defineProps<Props>(), {
  message: 'Loading...',
})
</script>

<template>
  <div class="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-lg glass-darker">
    <div class="flex flex-col items-center gap-4 px-6 text-center">
      <div class="rounded-2xl px-8 py-6">
        <BouncingDots message-placement="bottom" />
      </div>
    </div>
  </div>
</template>