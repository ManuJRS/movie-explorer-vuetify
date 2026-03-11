<script setup lang="ts">
interface Props {
  options: string[]
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const selectTab = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="inline-flex w-fit rounded-full bg-white/10 p-1 backdrop-blur-sm">
    <button
      v-for="option in options"
      :key="option"
      type="button"
      @click="selectTab(option)"
      class="relative rounded-full px-4 py-2 text-sm font-semibold capitalize transition-all duration-300"
      :class="
        modelValue === option
          ? 'bg-white text-black shadow-sm'
          : 'text-white hover:text-white/90'
      "
    >
      {{ option }}
    </button>
  </div>
</template>