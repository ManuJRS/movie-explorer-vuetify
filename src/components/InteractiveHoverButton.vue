<script setup lang="ts">
import { useAuthStore } from "@/stores/auth"

const auth = useAuthStore()

interface Props {
  text?: string
  type?: "button" | "submit" | "reset"
  variant?: "demo" | "login" | "common" | "cancel" | "save"
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  text: "Button",
  type: "button",
  variant: "demo",
  disabled: false,
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'group relative w-full cursor-pointer overflow-hidden rounded-xl text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base',
      variant === 'cancel'
        ? 'border border-white/20 bg-transparent py-2 px-6 text-center hover:text-red-500 hover:bg-white/10'
        : variant === 'demo'
          ? 'border border-white/10 bg-black/70 py-4 pl-10 pr-8 text-center text-white'
          : variant === 'common'
            ? 'flex items-center justify-center gap-2 border border-white/10 bg-black/70 px-6 py-2 text-white'
            : variant === 'save'
              ? 'border border-white/10 bg-black/70 py-2 pl-10 pr-8 text-center text-white'
              : 'border border-white/10 bg-black/70 py-2 pl-10 pr-8 text-center text-white',
    ]"
  >
    <span
      :class="[
        'inline-block transition-all duration-300',
        variant === 'common' ? 'relative z-10 translate-x-0 text-white group-hover:text-black' : variant === 'save' ? 'relative z-10 translate-x-0 text-white group-hover:text-black' : variant === 'cancel' ? 'translate-x-0' : 'translate-x-1 group-hover:translate-x-10 group-hover:opacity-0',
      ]"
    >
      {{ text }}
    </span>
    <span
      v-if="variant === 'common' && !auth.loading"
      class="material-symbols-outlined relative z-10 shrink-0 text-white transition-transform group-hover:translate-x-1 group-hover:text-black"
    >
      arrow_forward
    </span>

    <div
      v-if="variant !== 'common' && variant !== 'cancel' && variant !== 'save'"
      class="absolute top-0 z-20 flex h-full w-full translate-x-10 items-center justify-center gap-4 text-black opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
    >
      <span>{{ text }}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4 sm:h-5 sm:w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
      </svg>
    </div>

    <!-- fondo animado (no en cancel) -->
    <div
      v-if="variant !== 'cancel'"
      class="absolute left-[-18%] top-[34%] z-0 h-4 w-4 scale-100 rounded-lg bg-white transition-all duration-300 group-hover:left-0 group-hover:top-0 group-hover:h-full group-hover:w-full group-hover:scale-[1.8]"
    ></div>

    <!-- icono play (solo en variant demo, sobre el fondo blanco, desaparece al hacer hover) -->
    <span
      v-if="variant === 'demo'"
      class="material-symbols-outlined pointer-events-none absolute left-[15%] top-[27%] z-20 text-xl text-white opacity-100 transition-all duration-300 group-hover:opacity-0"
    >
      play_circle
    </span>

    <!-- icono login (solo en variant login, a la izquierda del texto, desaparece al hacer hover) -->
    <span
      v-if="variant === 'login'"
      class="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 z-20 -translate-y-1/2 text-xl text-white opacity-100 transition-all duration-300 group-hover:opacity-0"
    >
      login
    </span>

    <!-- icono save (solo en variant save, a la izquierda del texto, desaparece al hacer hover) -->
    <span
      v-if="variant === 'save'"
      class="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 z-20 -translate-y-1/2 text-xl text-white opacity-100 transition-all duration-300 group-hover:opacity-0"
    >
      save
    </span>
  </button>
</template>