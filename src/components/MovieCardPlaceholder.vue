<script setup>
</script>

<template>
    <div class="w-full sm:w-1/2 lg:w-1/3 p-2">
        <div class="group relative glass rounded-xl overflow-hidden hover:scale-[1.02] transition-all duration-300">
            <div
                class="relative h-[400px] overflow-hidden bg-primary/5 flex items-center justify-center border-2 border-dashed border-white/10 group-hover:border-primary/40 transition-colors">
                <div class="text-center p-6">
                    <span class="material-symbols-outlined text-4xl text-slate-600 mb-2">add_circle</span>
                    <p class="text-sm font-medium text-slate-500">Add another film to your library</p>
                </div>
            </div>
            <div class="p-4 flex items-center justify-between opacity-50">
                <div class="overflow-hidden">
                    <h3 class="font-bold text-lg truncate pr-2">Next Great Film</h3>
                    <p class="text-sm text-slate-500">Coming soon</p>
                </div>
                <button class="p-2 text-slate-600" disabled>
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        </div>
    </div>
</template>
