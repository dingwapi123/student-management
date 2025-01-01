import './assets/main.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { VueQueryPlugin } from '@tanstack/vue-query'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(Toast, {})
app.use(createPinia())
app.use(router)
app.use(VueQueryPlugin)

app.mount('#app')
