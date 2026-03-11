<script setup lang="ts">
import { ref } from 'vue'

type MenuOption = {
  label: string
  onClick: () => void
  icon?: string
}

interface Props {
  options: MenuOption[]
  className?: string
}

const props = defineProps<Props>()

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const handleOptionClick = (option: MenuOption) => {
  option.onClick()
  isOpen.value = false
}
</script>

<template>
  <div :class="['fixed bottom-8 right-8 z-50', props.className]">
    <!-- Main Button -->
    <button
      type="button"
      @click="toggleMenu"
      class="flex h-10 w-10 items-center justify-center rounded-full bg-[#11111198] shadow-[0_0_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:bg-[#111111d1]"
      aria-label="Toggle floating action menu"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        class="h-6 w-6 text-white transition-transform duration-300"
        :class="isOpen ? 'rotate-45' : 'rotate-0'"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    </button>

    <!-- Menu -->
    <transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-3 translate-y-3 blur-sm"
      enter-to-class="opacity-100 translate-x-0 translate-y-0 blur-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0 translate-y-0 blur-0"
      leave-to-class="opacity-0 translate-x-3 translate-y-3 blur-sm"
    >
      <div
        v-if="isOpen"
        class="absolute bottom-12 right-0 mb-2"
      >
        <div class="flex flex-col items-end gap-2">
          <transition-group
            name="menu-item"
            tag="div"
            class="flex flex-col items-end gap-2"
          >
            <button
              v-for="(option, index) in props.options"
              :key="`${option.label}-${index}`"
              type="button"
              @click="handleOptionClick(option)"
              class="flex items-center gap-2 rounded-xl border-none bg-[#11111198] px-4 py-2 text-sm text-white shadow-[0_0_20px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all duration-300 hover:bg-[#111111d1]"
            >
              <span v-if="option.icon" class="text-base leading-none">{{ option.icon }}</span>
              <span>{{ option.label }}</span>
            </button>
          </transition-group>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.menu-item-enter-active,
.menu-item-leave-active {
  transition: all 0.25s ease;
}

.menu-item-enter-from,
.menu-item-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>