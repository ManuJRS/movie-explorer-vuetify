import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import es from './locales/es.json'

const savedLocale = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null
const initialLocale = savedLocale === 'es' || savedLocale === 'en' ? savedLocale : 'en'

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    es
  }
})

export default i18n