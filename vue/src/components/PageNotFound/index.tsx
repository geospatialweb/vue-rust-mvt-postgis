import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent, onMounted, onUnmounted } from 'vue'

import { Route } from '@/enums'
import { RouterService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'PageNotFound Component',
  setup() {
    const { page_not_found } = styles,
      route = Route.Login,
      routeTimeout = window.setTimeout(async (): Promise<void> => await setRoute(route), 2000),
      setRoute = async (route: string): Promise<void> => {
        const { setRoute } = Container.get(RouterService)
        await setRoute(route)
      }
    onMounted((): number => routeTimeout)
    onUnmounted((): void => window.clearTimeout(routeTimeout))
    return (): JSX.Element => (
      <div class={page_not_found} role="presentation">
        <img src="/assets/images/404.webp" alt="404 Page Not Found" />
      </div>
    )
  }
})
