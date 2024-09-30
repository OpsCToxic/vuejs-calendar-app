import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/stylesheets/main.css'
import App from './App.vue'
import router from './routes'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.use(pinia)

app.mount('#app')
