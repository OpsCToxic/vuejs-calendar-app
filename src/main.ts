import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

import { createVuetify } from 'vuetify'
import 'vuetify/styles' // Import Vuetify styles
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

import { aliases, mdi } from 'vuetify/iconsets/mdi'

// Create Vuetify instance
const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  }
})

app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(PrimeVue)

app.mount('#app')
