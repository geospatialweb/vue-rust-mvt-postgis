import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent, onBeforeMount } from 'vue'

import { Header } from '@/components'
import { AppService } from '@/services'

export default defineComponent({
  name: 'App Component',
  setup() {
    const appService = Container.get(AppService),
      setInitialZoom = (): void => appService.setInitialZoom()
    onBeforeMount((): void => setInitialZoom())
    return (): JSX.Element => (
      <div role="presentation">
        <Header />
        <main>
          <router-view />
        </main>
      </div>
    )
  }
})
