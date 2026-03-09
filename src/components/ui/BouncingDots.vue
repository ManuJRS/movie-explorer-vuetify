<script setup lang="ts">
interface Props {
  dots?: number
  message?: string
  messagePlacement?: 'bottom' | 'left' | 'right'
  dotClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  dots: 3,
  message: '',
  messagePlacement: 'bottom',
  dotClass: '',
})

const placementClassMap = {
  bottom: 'flex-col',
  right: 'flex-row',
  left: 'flex-row-reverse',
} as const
</script>

<template>
  <div
    :class="[
      'flex items-center justify-center gap-3',
      placementClassMap[props.messagePlacement]
    ]"
  >
    <div class="flex items-center justify-center gap-2">
      <span
        v-for="index in props.dots"
        :key="index"
        :class="[
          'h-3 w-3 rounded-full bg-white animate-bounce',
          props.dotClass
        ]"
        :style="{ animationDelay: `${(index - 1) * 0.15}s` }"
      />
    </div>

    <p
      v-if="props.message"
      class="text-sm text-slate-300"
    >
      {{ props.message }}
    </p>
  </div>
</template>