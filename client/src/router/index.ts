import { Container } from 'typedi'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import { routes as routesConfig } from '@/configuration'
import { AuthorizationService } from '@/services'
import { Authentication, Deck, Mapbox, PageNotFound, Registration } from '@/views'

const { deckgl, login, mapbox, pageNotFound, register } = routesConfig,
  beforeEnter = () => () => {
    const authorizationService = Container.get(AuthorizationService),
      /* prettier-ignore */
      { jwtState: { expiry } } = authorizationService,
      currentTimestamp = Math.floor(Date.now() / 1000)
    if (currentTimestamp > expiry) return { name: login }
  },
  baseURL = import.meta.env.BASE_URL,
  history = createWebHistory(baseURL),
  routes: RouteRecordRaw[] = [
    {
      path: baseURL,
      redirect: login
    },
    {
      path: `${baseURL}login`,
      name: login,
      component: Authentication
    },
    {
      path: `${baseURL}register`,
      name: register,
      component: Registration
    },
    {
      path: `${baseURL}deckgl`,
      name: deckgl,
      component: Deck,
      beforeEnter: beforeEnter()
    },
    {
      path: `${baseURL}mapbox`,
      name: mapbox,
      component: Mapbox,
      beforeEnter: beforeEnter()
    },
    {
      path: `${baseURL}:pathMatch(.*)*`,
      name: pageNotFound,
      component: PageNotFound
    }
  ],
  router = createRouter({ history, routes })

export default router
