import WaveUI from 'wave-ui'
import 'wave-ui/dist/wave-ui.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'

import App from './App.vue'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(WaveUI, {
    on: '#app',
    theme: 'auto',
    colors: {
        dark: {
            primary: '#7fb0cf'
        }
    },
})

app.mount('#app')
