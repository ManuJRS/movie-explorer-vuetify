import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import i18n from '@/i18n'

import { createPinia } from 'pinia'


createApp(App)
.use(createPinia())
.use(router)
.use(i18n)
.mount('#app')

// init auth session
useAuthStore().init()