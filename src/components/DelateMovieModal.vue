<script setup lang="ts">
defineProps<{
  open: boolean
  movie: { title?: string; id?: string } | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  confirm: []
}>()

function close() {
  emit('update:open', false)
}

function onConfirm() {
  emit('confirm')
  emit('update:open', false)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl"
      @click.self="close"
    >
      <div class="glass-modal max-w-md w-full rounded-2xl p-8 shadow-2xl shadow-rose-900/10">
        <div class="flex flex-col items-center text-center">
          <div
            class="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-500/20"
          >
            <span class="material-symbols-outlined text-rose-500 text-3xl">delete_forever</span>
          </div>
          <h2 class="text-2xl font-bold text-white mb-3">Remove Movie?</h2>
          <p class="text-slate-400 leading-relaxed mb-8">
            Are you sure you want to remove
            <span class="text-white font-medium">"{{ movie?.title ?? 'this movie' }}"</span>
            from your shelf? This action cannot be undone.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 w-full">
            <button
              type="button"
              class="hover:cursor-pointer flex-1 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 border border-white/5 transition-all"
              @click="close"
            >
              Cancel
            </button>
            <button
              type="button"
              class="hover:cursor-pointer flex-1 px-6 py-3.5 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_25px_rgba(225,29,72,0.5)] transition-all"
              @click="onConfirm"
            >
              Delete Movie
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>