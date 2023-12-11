import 'reflect-metadata'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { App } from '@/components'
import router from '@/router'
import '@/styles/screen.css'

createApp(App).use(createPinia()).use(router).mount('#app')
