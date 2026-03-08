<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue';

type OptionItem = string | { value: string; label: string };

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: 'Selecciona una opción'
    },
    options: {
        type: Array as () => OptionItem[],
        required: true
    }
});

const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const isOpen = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const dropdownStyle = ref({ top: 0, left: 0, width: 0 });

const selectedLabel = computed(() => {
    if (!props.modelValue) return null;
    const opt = props.options.find(o => (typeof o === 'string' ? o : o.value) === props.modelValue);
    return opt ? (typeof opt === 'string' ? opt : opt.label) : null;
});

function updateDropdownPosition() {
    if (!triggerRef.value) return;
    const rect = triggerRef.value.getBoundingClientRect();
    dropdownStyle.value = {
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
    };
}

function toggle() {
    isOpen.value = !isOpen.value;
}

watch(isOpen, async (open) => {
    if (open) {
        await nextTick();
        updateDropdownPosition();
        window.addEventListener('scroll', handleScroll, true);
    } else {
        window.removeEventListener('scroll', handleScroll, true);
    }
});

function select(value: string) {
    emit('update:modelValue', value);
    isOpen.value = false;
}

function getOptionValue(option: OptionItem): string {
    return typeof option === 'string' ? option : option.value;
}

function getOptionLabel(option: OptionItem): string {
    return typeof option === 'string' ? option : option.label;
}

function handleClickOutside(event: MouseEvent) {
    const target = event.target as Node | null;
    const inTrigger = triggerRef.value?.contains(target);
    const inDropdown = dropdownRef.value?.contains(target);
    if (!inTrigger && !inDropdown) {
        isOpen.value = false;
    }
}

function handleScroll() {
    if (isOpen.value && window.innerWidth < 768) {
        isOpen.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('scroll', handleScroll, true);
});
</script>

<template>
    <div ref="triggerRef" class="relative w-full">
        <button
            type="button"
            @click="toggle"
            class="hover:cursor-pointer w-full flex items-center justify-between gap-2 rounded-lg py-3 text-left text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all text-xs font-bold uppercase tracking-wider"
        >
            <span :class="selectedLabel ? 'text-slate-900 dark:text-white' : 'text-slate-400'">
                {{ selectedLabel || placeholder }}
            </span>
            <span
                class="material-symbols-outlined text-lg transition-transform"
                :class="{ 'rotate-180': isOpen }"
            >
                expand_more
            </span>
        </button>

        <Teleport to="body">
            <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 -translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-1"
            >
                <div
                    v-show="isOpen"
                    ref="dropdownRef"
                    class="fixed z-[9999] py-1 rounded-lg shadow-lg border border-black/10 dark:border-white/10 bg-slate-100 dark:bg-slate-800/95 backdrop-blur-sm overflow-hidden"
                    :style="{ top: dropdownStyle.top + 'px', left: dropdownStyle.left + 'px', width: dropdownStyle.width + 'px' }"
                >
                    <button
                        v-for="option in options"
                        :key="getOptionValue(option)"
                        type="button"
                        @click="select(getOptionValue(option))"
                        class="w-full px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                        :class="{ 'bg-primary/10 dark:bg-primary/20 text-primary': modelValue === getOptionValue(option) }"
                    >
                        {{ getOptionLabel(option) }}
                    </button>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>
