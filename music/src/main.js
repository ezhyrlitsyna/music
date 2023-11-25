import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidate from '@/includes/validation'
import i18n from './includes/i18n'

import './assets/base.css'
import './assets/main.css'
import { auth } from './includes/firebase'

let app
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)

    app.use(createPinia())
    app.use(router)
    app.use(VeeValidate)
    app.use(i18n)

    app.mount('#app')
  }
})
