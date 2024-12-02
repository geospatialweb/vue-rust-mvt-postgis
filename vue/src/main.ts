import 'reflect-metadata'
import { createPinia } from 'pinia'
import { Container } from 'typedi'
import { createApp } from 'vue'

import '@/styles/screen.css'
import { App } from '@/components'
import { RouterService } from '@/services'

const routerService = Container.get(RouterService)
createApp(App).use(createPinia()).use(routerService.router).mount('#app')
