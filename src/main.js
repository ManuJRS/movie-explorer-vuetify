import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import router from '@/router'
import i18n from '@/i18n'
import { createPinia } from 'pinia'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .mount('#app')

// La sesión de auth se inicializa una sola vez en el router guard (beforeEach),
// para evitar race conditions y múltiples getSession/onAuthStateChange.