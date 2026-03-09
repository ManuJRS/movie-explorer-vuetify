import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import i18n from './i18n'

import { createPinia } from 'pinia'


createApp(App)
.use(createPinia())
.use(i18n)
.mount('#app')