<script setup lang="ts">
import { ref } from 'vue'

interface FaqItem {
  question: string
  answer: string
}

interface Props {
  title?: string
  subtitle?: string
  items: FaqItem[]
}

withDefaults(defineProps<Props>(), {
  title: 'Frequently Asked Questions',
  subtitle: 'FAQs',
})

const openIndex = ref<number | null>(null)

const toggleItem = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}

const onEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = '0px'
  element.style.opacity = '0'
  element.style.marginTop = '0px'

  requestAnimationFrame(() => {
    element.style.height = `${element.scrollHeight}px`
    element.style.opacity = '1'
    element.style.marginTop = '12px'
  })
}

const onAfterEnter = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = 'auto'
}

const onLeave = (el: Element) => {
  const element = el as HTMLElement
  element.style.height = `${element.scrollHeight}px`
  element.style.opacity = '1'
  element.style.marginTop = '12px'

  requestAnimationFrame(() => {
    element.style.height = '0px'
    element.style.opacity = '0'
    element.style.marginTop = '0px'
  })
}
</script>

<template>
  <section class="relative overflow-hidden bg-background px-4 py-12 text-foreground">
    <div class="relative z-10 flex flex-col items-center justify-center text-center">
      <span
        class="mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-sm font-medium text-transparent"
      >
        {{ subtitle }}
      </span>

      <h2 class="mb-8 text-3xl font-bold sm:text-4xl md:text-5xl">
        {{ title }}
      </h2>

      <span
        class="absolute -top-[350px] left-1/2 z-0 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 blur-3xl"
      />
    </div>

    <div class="mx-auto mt-12 max-w-3xl space-y-4">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="rounded-xl border transition-colors"
        :class="openIndex === index ? 'bg-muted/50' : 'bg-card'"
      >
        <button
          type="button"
          class="flex w-full items-center justify-between gap-4 p-4 text-left hover:cursor-pointer"
          @click="toggleItem(index)"
        >
          <span
            class="text-base font-medium text-slate-400 sm:text-lg"
            :class="openIndex === index ? 'text-foreground' : 'text-muted-foreground'"
          >
            {{ item.question }}
          </span>

          <span
            class="flex h-5 w-5 shrink-0 items-center justify-center transition-transform duration-200"
            :class="openIndex === index ? 'rotate-45 text-foreground' : 'rotate-0 text-muted-foreground'"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="h-5 w-5"
            >
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </span>
        </button>

        <Transition
          enter-active-class="overflow-hidden transition-all duration-300 ease-in-out"
          leave-active-class="overflow-hidden transition-all duration-300 ease-in-out"
          @enter="onEnter"
          @after-enter="onAfterEnter"
          @leave="onLeave"
        >
          <div
            v-if="openIndex === index"
            class="overflow-hidden px-4 pb-4 text-slate-400"
          >
            <p>
              {{ item.answer }}
            </p>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>