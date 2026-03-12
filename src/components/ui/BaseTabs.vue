<script setup lang="ts">
export interface TabOption {
  value: string
  label: string
}

interface Props {
  options: TabOption[]
  modelValue: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selectTab = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="inline-flex w-fit rounded-full bg-white/10 p-1 backdrop-blur-sm hover:cursor-pointer">
    <button
      v-for="option in options"
      :key="option.value"
      type="button"
      @click="selectTab(option.value)"
      class="relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 hover:cursor-pointer"
      :class="
        modelValue === option.value
          ? 'bg-white text-black shadow-sm'
          : 'text-white hover:text-white/90'
      "
    >
      {{ option.label }}
    </button>
  </div>
</template>