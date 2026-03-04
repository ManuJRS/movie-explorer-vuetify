<script setup>
defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    open: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'update:open']);

function close() {
    emit('update:open', false);
}

function save() {
    emit('update:open', false);
}
</script>

<template>
    <Teleport to="body">
        <div
            v-if="open"
            class="fixed inset-0 bg-background-dark/80 backdrop-blur-sm z-40 flex items-center justify-center p-6"
            @click.self="close"
        >
            <div
                class="relative w-full max-w-5xl bg-background-light dark:bg-background-dark/90 rounded-xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row"
            >
                <button
                    type="button"
                    @click="close"
                    class="hover:cursor-pointer absolute top-4 right-4 z-50 p-2 rounded-full text-slate-500 transition-colors"
                >
                    <span class="material-symbols-outlined">close</span>
                </button>
                <div class="w-full md:w-full p-8 overflow-y-auto flex flex-col">
                    <div class="mb-8"></div>
                    <div class="mb-8">
                        <h2 class="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em] mb-3">
                            Synopsis
                        </h2>
                        <textarea
                            :value="modelValue"
                            @input="emit('update:modelValue', $event.target.value)"
                            class="w-full min-h-[200px] p-4 rounded-lg bg-white/5 dark:bg-slate-800 border border-black/10 dark:border-white/10 text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-primary/20 focus:outline-none resize-y"
                            placeholder="Write the movie synopsis..."
                        ></textarea>
                    </div>
                    <div
                        class="mt-auto flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800"
                    >
                        <div></div>
                        <div class="flex gap-3">
                            <button
                                type="button"
                                @click="close"
                                class="hover:cursor-pointer px-6 py-2.5 rounded-lg border border-primary text-primary hover:bg-primary/5 text-sm font-bold transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                @click="save"
                                class="px-6 hover:cursor-pointer py-2.5 rounded-lg bg-blue-600 hover:shadow-[0_0_20px_rgba(17,82,212,0.4)] text-white font-bold py-4 rounded-lg transition-all"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>
