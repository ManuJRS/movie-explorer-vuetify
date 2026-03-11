<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  text: string
}

const { text } = defineProps<Props>()

const wrapper = ref<HTMLElement | null>(null)
const showTooltip = ref(false)
const position = ref({ top: 0, left: 0 })

function handleMouseEnter(event: MouseEvent) {
  if (!text) return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  position.value = {
    top: rect.top,
    left: rect.left + rect.width / 2,
  }
  showTooltip.value = true
}

function handleMouseLeave() {
  showTooltip.value = false
}
</script>

<template>
  <div
    ref="wrapper"
    class="relative inline-block w-full min-w-0"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <slot />
    <Teleport to="body">
      <Transition name="tooltip">
        <div
          v-show="showTooltip && text"
          class="fixed px-3 py-2 text-sm text-white bg-slate-800 dark:bg-slate-900 rounded-lg shadow-lg whitespace-normal max-w-[280px] break-words z-[9999] pointer-events-none -translate-x-1/2 -translate-y-full -mt-2"
          :style="{ top: position.top + 'px', left: position.left + 'px' }"
        >
          {{ text }}
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
}
</style>
