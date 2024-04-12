import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent, onBeforeUnmount, onMounted } from 'vue'

import { Route } from '@/enums'
import { RouterService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'PageNotFound',
  setup() {
    const { page_not_found } = styles,
      routeTimeout = window.setTimeout((): void => setRoute(), 2000),
      routerService = Container.get(RouterService),
      setRoute = (): void => void routerService.setRoute(Route.LOGIN)
    onMounted((): number => routeTimeout)
    onBeforeUnmount((): void => window.clearTimeout(routeTimeout))
    return (): JSX.Element => (
      <div class={page_not_found} role="presentation">
        <img src="/assets/images/404.webp" alt="404 Page Not Found" />
      </div>
    )
  }
})
