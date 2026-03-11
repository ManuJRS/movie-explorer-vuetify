<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
<section class="md:py-24 py-12">
    <div class="max-w-7xl mx-auto md:px-6">
        <div class="group">
            <div class="">
                <div class="relative w-full h-full ">
                    <div class="aspect-video glass-darker rounded-2xl overflow-hidden">
                        <video autoplay muted loop class="w-full h-full object-cover">
                        <source src="https://res.cloudinary.com/dronteu5m/video/upload/v1773004245/Dise%C3%B1o_sin_t%C3%ADtulo_5_wah75m.mp4" type="video/mp4">
                        </video>
                    </div>
                </div>
                <div class="md:text-right text-left flex flex-col justify-center p-8">
                    <h2 class="text-2xl md:text-3xl font-bold mb-6 md:text-right text-left">{{ t('cardVideo.title') }}</h2>
                    <p class="text-slate-400 mb-8 md:text-right text-left">
                        {{ t('cardVideo.description') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>
<section class="md:py-24 py-12">
    <div class="max-w-7xl mx-auto md:px-6">
        <div class="group">
            <div class="">
                <div class="relative w-full h-full ">
                    <div class="aspect-video glass-darker rounded-2xl overflow-hidden">
                        <video autoplay muted loop class="w-full h-full object-cover">
                        <source src="https://res.cloudinary.com/dronteu5m/video/upload/v1773008398/Dise%C3%B1o_sin_t%C3%ADtulo_6_d68uqs.mp4" type="video/mp4">
                        </video>
                    </div>
                </div>
                <div class="text-left flex flex-col justify-center p-8">
                    <h2 class="text-2xl md:text-3xl font-bold mb-6 text-left">{{ t('cardVideo.title2') }}</h2>
                    <p class="text-slate-400 mb-8 text-left">
                        {{ t('cardVideo.description2') }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</section>
</template>    