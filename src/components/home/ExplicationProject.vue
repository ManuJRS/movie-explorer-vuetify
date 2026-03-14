<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
    <section class="md:py-24 py-12">
    <div class="max-w-7xl mx-auto px-6">
        <div class="glass p-8 md:p-16 rounded-2xl border-primary/20 border border-black/10 dark:border-white/10 hover:bg-white/5 hover:border-white/20 transition-all duration-300 group">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 class="text-2xl md:text-3xl font-bold mb-6">{{t('explicationProject.title')}}</h2>
                    <p class="text-slate-400 mb-8">
                        {{t('explicationProject.description')}}
                    </p>
                    <div class="grid grid-cols-2 gap-8">
                        <div>
                            <p class="text-sm text-slate-500 tracking-wider">ManuDev</p>
                        </div>
                    </div>
                </div>
                <div class="relative">
                    <div class="aspect-video glass-darker rounded-2xl overflow-hidden flex items-center justify-center">
                        <img loading="lazy" src="https://res.cloudinary.com/dronteu5m/image/upload/v1773505933/soyesteasiessoyyoestoycansado_k2gafm.webp" alt="Explication Project" class="w-full h-full object-cover">
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
</template>    