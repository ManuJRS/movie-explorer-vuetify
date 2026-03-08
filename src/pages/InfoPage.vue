<script setup lang="ts">
import InfoVideoComponent from '@/components/InfoVideoComponent.vue';
import AccordionFAQS from '@/components/AccordionFAQS.vue';
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const faqItems = [
  {
    question: t('faqPage.question1'),
    answer:
      t('faqPage.answer1'),
  },
  {
    question: t('faqPage.question2'),
    answer:
      t('faqPage.answer2'),
  },
  {
    question: t('faqPage.question3'),
    answer:
      t('faqPage.answer3'),
  },
  {
    question: t('faqPage.question4'),
    answer:
      t('faqPage.answer4'),
  },
]
</script>

<template>
    <main class="md:py-24 py-24">
        <div class="max-w-7xl mx-auto px-6">
            <router-link to="/" class="inline-flex items-center gap-2">
                <span class="material-symbols-outlined text-sm text-blue-500 hover:cursor-pointer hover:text-blue-600 transition-all duration-300">arrow_back</span>
                <span class="text-sm text-slate-400"> {{ t('infoPage.backToMovies') }}</span>
            </router-link>
        </div>
            <InfoVideoComponent :title="t('infoPage.howToUse')" :description="t('infoPage.howToUseDescription')" videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
            <InfoVideoComponent :title="t('infoPage.HoToEdit')" :description="t('infoPage.HoToEditDescription')" videoUrl="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />

            <AccordionFAQS
                :title="t('faqPage.title')"
                subtitle="Let's answer some questions"
                :items="faqItems"
            />
    </main>
</template>