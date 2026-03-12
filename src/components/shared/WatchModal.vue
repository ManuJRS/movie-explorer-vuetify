<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'

interface Props {
  isOpen: boolean
  trailerUrl?: string | null
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  trailerUrl: null,
  title: 'Trailer',
})

const emit = defineEmits<{
  (e: 'close'): void
}>()

function closeModal() {
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.isOpen) {
    closeModal()
  }
}

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }
)

window.addEventListener('keydown', onKeydown)

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
    <div
  v-if="isOpen"
  class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-xl"
  @click.self="closeModal"
>
  <div
    class="relative w-full max-w-4xl rounded-2xl shadow-2xl"
  >
  <div class="relative w-full max-w-4xl rounded-2xl shadow-2xl p-6">
    <button
      type="button"
      class="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/90 hover:cursor-pointer text-white hover:bg-red-500/30 transition"
      aria-label="Close trailer"
      @click="closeModal"
    >
      ✕
    </button>
    <h3 class="text-lg sm:text-xl font-semibold text-white">
      {{ title }}
    </h3>
  </div>


    <!-- Video -->
    <div class="aspect-video w-full overflow-hidden rounded-xl bg-black">
      <iframe
        v-if="trailerUrl"
        :src="trailerUrl"
        class="h-full w-full"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
        referrerpolicy="strict-origin-when-cross-origin"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center text-sm text-slate-400"
      >
        Trailer not available
      </div>
    </div>
  </div>
</div>
    </transition>
  </Teleport>
</template>