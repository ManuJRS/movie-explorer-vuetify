<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

type PageItem = number | 'dots'

interface Props {
  totalPages: number
  currentPage: number
  maxVisiblePages?: number
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxVisiblePages: 7,
  className: '',
})

const emit = defineEmits<{
  (e: 'update:currentPage', value: number): void
  (e: 'page-change', value: number): void
}>()

const containerRef = ref<HTMLElement | null>(null)
const buttonRefs = ref<Record<number, HTMLButtonElement | null>>({})

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

const generatePages = (): PageItem[] => {
  const total = props.totalPages
  const current = props.currentPage
  const maxVisible = props.maxVisiblePages

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: PageItem[] = []
  const first = 1
  const last = total
  const sideCount = 1
  const middleCount = maxVisible - 2 * sideCount - 2

  pages.push(first)

  let left = Math.max(current - Math.floor(middleCount / 2), sideCount + 1)
  let right = Math.min(current + Math.floor(middleCount / 2), total - sideCount)

  if (left > sideCount + 1) {
    pages.push('dots')
  } else {
    left = sideCount + 1
  }

  for (let i = left; i <= right; i++) {
    pages.push(i)
  }

  if (right < total - sideCount) {
    pages.push('dots')
  }

  pages.push(last)

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
  () => [props.currentPage, props.totalPages, props.maxVisiblePages],
  () => {
    updateUnderline()
  },
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