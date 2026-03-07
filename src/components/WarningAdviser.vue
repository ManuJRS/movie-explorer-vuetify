<script setup lang="ts">
import { computed, ref } from "vue"

type AlertVariant = "default" | "destructive" | "warning" | "success" | "info"

interface Props {
  variant?: AlertVariant
  title?: string
  dismissible?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
  title: "",
  dismissible: false,
  className: "",
})

const emit = defineEmits<{
  (e: "dismiss"): void
}>()

const isVisible = ref(true)

const handleDismiss = () => {
  isVisible.value = false
  setTimeout(() => {
    emit("dismiss")
  }, 150)
}

const variantClasses = computed(() => {
  const variants: Record<AlertVariant, string> = {
    default:
      "border-[hsl(var(--hu-border))] bg-[hsl(var(--hu-card))] text-[hsl(var(--hu-card-foreground))]",
    destructive:
      "border-red-200 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-950/30 dark:text-red-200",
    warning:
      "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-700 dark:bg-amber-950/30 dark:text-amber-200",
    success:
      "border-green-200 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-950/30 dark:text-green-200",
    info:
      "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-700 dark:bg-blue-950/30 dark:text-blue-200",
  }

  return variants[props.variant]
})
</script>

<template>
  <Transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0 -translate-y-2 scale-95"
    enter-to-class="opacity-100 translate-y-0 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0 scale-100"
    leave-to-class="opacity-0 -translate-y-2 scale-95"
  >
    <div
      v-if="isVisible"
      :class="[
        'relative w-full rounded-lg border p-4 text-sm shadow-sm transition-colors',
        variantClasses,
        className
      ]"
      role="alert"
    >
      <div class="flex items-start gap-3">
        <div v-if="$slots.icon" class="shrink-0 pt-0.5">
          <slot name="icon" />
        </div>

        <div class="flex-1 min-w-0">
          <h3 v-if="title" class="mb-1 text-sm font-medium">
            {{ title }}
          </h3>

          <div class="text-sm">
            <slot />
          </div>
        </div>

        <div v-if="dismissible" class="shrink-0">
          <button
            type="button"
            class="inline-flex rounded-md p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2"
            aria-label="Dismiss alert"
            @click="handleDismiss"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="h-4 w-4"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>