import { Container, Service } from 'typedi'
import { createRouter, createWebHistory, RouteRecordRaw, Router } from 'vue-router'

import { Route } from '@/enums'
import { AuthorizationService } from '@/services'
import { Authentication, Deckgl, Mapbox, PageNotFound, Registration } from '@/views'

@Service()
export default class RouterService {
  #router: Router

  constructor() {
    this.#router = this.#createRouter()
  }

  get router(): Router {
    return this.#router
  }

  async setRoute(name: string): Promise<void> {
    await this.#router.push({ name })
  }

  #createRouter(): Router {
    const baseURL = import.meta.env.BASE_URL,
      history = createWebHistory(baseURL),
      beforeEnter = () => () => {
        /* prettier-ignore */
        const authorizationService = Container.get(AuthorizationService),
          { jwtState: { jwtExpiry } } = authorizationService,
          currentTimestamp = Math.floor(Date.now() / 1000)
        if (currentTimestamp > jwtExpiry) return { name: Route.Login }
      },
      routes: RouteRecordRaw[] = [
        {
          path: baseURL,
          redirect: Route.Login
        },
        {
          path: `${baseURL}${Route.Login}`,
          name: Route.Login,
          component: Authentication
        },
        {
          path: `${baseURL}${Route.Register}`,
          name: Route.Register,
          component: Registration
        },
        {
          path: `${baseURL}${Route.Deckgl}`,
          name: Route.Deckgl,
          component: Deckgl,
          beforeEnter: beforeEnter()
        },
        {
          path: `${baseURL}${Route.Mapbox}`,
          name: Route.Mapbox,
          component: Mapbox,
          beforeEnter: beforeEnter()
        },
        {
          path: `${baseURL}:pathMatch(.*)*`,
          name: Route.PageNotFound,
          component: PageNotFound
        }
      ]
    return createRouter({ history, routes })
  }
}
