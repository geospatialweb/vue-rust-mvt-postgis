import { Container, Service } from 'typedi'
import { createRouter, createWebHistory, Router } from 'vue-router'

import { Route } from '@/enums'
import { AuthorizationService } from '@/services'
import { Authentication, Deckgl, Mapbox, PageNotFound, Registration } from '@/views'

import type { RouteRecordRaw } from 'vue-router'

@Service()
export default class RouterService {
  #router: Router

  constructor() {
    this.#router = this.#createRouter()
  }

  get router(): Router {
    return this.#router
  }

  setRoute = async (name: string): Promise<void> => {
    await this.#router.push({ name })
  }

  #createRouter(): Router {
    const { BASE_URL: baseURL } = import.meta.env,
      beforeEnter = () => () => {
        /* prettier-ignore */
        const currentTimestamp = Math.floor(Date.now() / 1000),
          { jwtState: { jwtExpiry } } = Container.get(AuthorizationService)
        if (currentTimestamp > jwtExpiry) return { name: Route.Login }
      },
      history = createWebHistory(baseURL),
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
      ],
      router = createRouter({ history, routes })
    return router
  }
}
