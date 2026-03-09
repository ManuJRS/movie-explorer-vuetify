import { ref, onMounted, onUnmounted } from 'vue'

export const useWindowWidth = () => {
  const width = ref(0)

  const updateWidth = () => {
    width.value = typeof window !== 'undefined' ? window.innerWidth : 0
  }

  onMounted(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })

  return width
}
