import { Container } from 'typedi'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import { Route } from '@/enums'
import { AuthorizationService } from '@/services'
import { Authentication, Deck, Mapbox, PageNotFound, Registration } from '@/views'

const baseURL = import.meta.env.BASE_URL,
  history = createWebHistory(baseURL),
  beforeEnter = () => () => {
    /* prettier-ignore */
    const authorizationService = Container.get(AuthorizationService),
      { jwtState: { expiry } } = authorizationService,
      currentTimestamp = Math.floor(Date.now() / 1000)
    if (currentTimestamp > expiry) return { name: Route.LOGIN }
  },
  routes: RouteRecordRaw[] = [
    {
      path: baseURL,
      redirect: Route.LOGIN
    },
    {
      path: `${baseURL}${Route.LOGIN}`,
      name: Route.LOGIN,
      component: Authentication
    },
    {
      path: `${baseURL}${Route.REGISTER}`,
      name: Route.REGISTER,
      component: Registration
    },
    {
      path: `${baseURL}${Route.DECKGL}`,
      name: Route.DECKGL,
      component: Deck,
      beforeEnter: beforeEnter()
    },
    {
      path: `${baseURL}${Route.MAPBOX}`,
      name: Route.MAPBOX,
      component: Mapbox,
      beforeEnter: beforeEnter()
    },
    {
      path: `${baseURL}:pathMatch(.*)*`,
      name: Route.PAGE_NOT_FOUND,
      component: PageNotFound
    }
  ],
  router = createRouter({ history, routes })

export default router
