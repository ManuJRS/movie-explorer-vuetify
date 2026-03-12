<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

type PageItem = number | 'dots'

interface Props {
  totalPages: number
  currentPage: number
  maxVisiblePages?: number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxVisiblePages: 5,
  className: '',
})

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
  (e: 'page-change', value: number): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const buttonRefs = ref<Record<number, HTMLButtonElement | null>>({})

const MOBILE_BREAKPOINT = 768
const mobileQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
const isMobile = ref(mobileQuery.matches)
const updateMobile = () => {
  isMobile.value = mobileQuery.matches
}
mobileQuery.addEventListener('change', updateMobile)
onUnmounted(() => mobileQuery.removeEventListener('change', updateMobile))

const underlineStyle = ref({
  left: 0,
  width: 0,
  opacity: 0,
})

const setButtonRef = (page: number, el: HTMLButtonElement | null) => {
  buttonRefs.value[page] = el
}

const handlePageChange = (page: number) => {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('update:currentPage', page)
  emit('page-change', page)
}

const effectiveMaxVisible = computed(() =>
  isMobile.value ? 4 : props.maxVisiblePages
)

/**
 * Sliding Window Pagination: muestra una ventana deslizante de páginas
 * centrada en la página actual. Soporta cualquier cantidad total de páginas.
 */
const generatePages = (): PageItem[] => {
  const total = props.totalPages
  const current = props.currentPage
  const maxVisible = Math.min(effectiveMaxVisible.value, total)

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const half = Math.floor((maxVisible - 1) / 2)
  let start = Math.max(1, current - half)
  let end = Math.min(total, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  const pages: PageItem[] = []
  // 1... solo cuando hay 2+ páginas ocultas al inicio Y no estamos al final
  const showFirstDots = start > 2 && end < total
  // ...último solo cuando hay 2+ ocultas al final Y no estamos al inicio
  const showLastDots = end < total - 1 && start > 1

  if (showFirstDots) {
    pages.push(1)
    pages.push('dots')
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (showLastDots) {
    pages.push('dots')
    pages.push(total)
  }

  return pages
}

const pagesToShow = computed(() => generatePages())

const updateUnderline = async () => {
  await nextTick()

  const currentBtn = buttonRefs.value[props.currentPage]
  const container = containerRef.value

  if (!currentBtn || !container) {
    underlineStyle.value.opacity = 0
    return
  }

  const btnRect = currentBtn.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()

  underlineStyle.value = {
    left: btnRect.left - containerRect.left,
    width: btnRect.width,
    opacity: 1,
  }
}

watch(
  () => [props.currentPage, props.totalPages, props.maxVisiblePages, isMobile.value],
  updateUnderline,
  { immediate: true }
)

onMounted(() => {
  updateUnderline()
})

const goPrev = () => {
  handlePageChange(props.currentPage - 1)
}

const goNext = () => {
  handlePageChange(props.currentPage + 1)
}
</script>

<template>
  <div :class="['flex flex-wrap items-center justify-center gap-3 min-w-0', className]">
    <button
      type="button"
      class="inline-flex h-9 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-white/5 px-3 text-sm text-slate-700 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300"
      :disabled="currentPage <= 1"
      @click="goPrev"
    >
      Prev
    </button>

    <div
      ref="containerRef"
      class="relative flex flex-wrap items-center justify-center gap-2"
    >
      <template
        v-for="(pageNum, index) in pagesToShow"
        :key="pageNum === 'dots' ? `dots-${index}` : `page-${pageNum}`"
      >
        <span
          v-if="pageNum === 'dots'"
          class="px-2 text-slate-400"
        >
          …
        </span>

        <button
          v-else
          :ref="(el) => setButtonRef(pageNum, el as HTMLButtonElement | null)"
          type="button"
          @click="handlePageChange(pageNum)"
          class="relative rounded-md px-4 py-2 text-sm transition-all duration-200 hover:bg-white/10 dark:hover:bg-white/5"
          :class="
            pageNum === currentPage
              ? 'font-semibold text-slate-900 dark:text-white'
              : 'text-slate-500 dark:text-slate-400'
          "
        >
          {{ pageNum }}
        </button>
      </template>

      <div
        class="absolute bottom-0 h-0.5 rounded bg-primary transition-all duration-300 ease-out"
        :style="{
          left: `${underlineStyle.left}px`,
          width: `${underlineStyle.width}px`,
          opacity: underlineStyle.opacity,
        }"
      />
    </div>

    <button
      type="button"
      class="inline-flex h-9 items-center justify-center rounded-lg border border-black/10 dark:border-white/10 bg-white/5 px-3 text-sm text-slate-700 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-300"
      :disabled="currentPage >= totalPages"
      @click="goNext"
    >
      Next
    </button>
  </div>
</template>