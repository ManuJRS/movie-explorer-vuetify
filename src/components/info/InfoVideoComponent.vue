<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

import { ref } from 'vue'

defineProps({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    }
})

</script>

<template>
    <section class="">
    <div class="max-w-7xl mx-auto px-6">
        <div class="p-8 md:p-16 rounded-2xl group">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 class="text-2xl md:text-3xl font-bold mb-6">{{ title }}</h2>
                    <p class="text-slate-400 mb-8">
                        {{ description }}
                    </p>
                    <div class="grid grid-cols-2 gap-8">
                        <div>
                            <p class="text-sm text-slate-500 tracking-wider"></p>
                        </div>
                    </div>
                </div>
                <div class="relative">
                    <div class="aspect-video glass-darker rounded-2xl overflow-hidden flex items-center justify-center">
                        <iframe :src="videoUrl" frameborder="0" allowfullscreen></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
</template>    