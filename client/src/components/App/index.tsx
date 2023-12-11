import { Container } from 'typedi'
import { defineComponent, onBeforeMount } from 'vue'

import { Header } from '@/components'
import { AppService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'App',
  setup() {
    const { app } = styles,
      appService = Container.get(AppService),
      setInitialZoom = (): void => appService.setInitialZoom()
    onBeforeMount((): void => setInitialZoom())
    return (): JSX.Element => (
      <div class={app} role="presentation">
        <Header />
        <router-view />
      </div>
    )
  }
})
