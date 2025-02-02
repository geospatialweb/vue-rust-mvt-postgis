import { render, screen } from '@testing-library/vue'
import { Container } from 'typedi'
import { createRouter, createWebHistory } from 'vue-router'

import { layerControllerLayers } from '@/configuration'
import { Route } from '@/enums'
import { RouterService } from '@/services'
import { testData } from '@/test'
import { Authentication, Deckgl, Mapbox, PageNotFound, Registration } from '@/views'

const { routes } = testData,
  baseURL = import.meta.env.BASE_URL,
  history = createWebHistory(baseURL),
  router = createRouter({ history, routes })

describe('RouterService test suite', (): void => {
  const routerService = Container.get(RouterService)

  test('router getter should be called with a return', (): void => {
    const spy = vi.spyOn(routerService, 'router', 'get').mockReturnValue(router)
    routerService.router
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('setRoute method should be called', async (): Promise<void> => {
    const { id } = layerControllerLayers[5],
      spy = vi.spyOn(routerService, 'setRoute')
    await routerService.setRoute(id)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(id)
  })
})

describe('router test suite', (): void => {
  test('baseURL redirect route', async (): Promise<void> => {
    render(Authentication, { global: { plugins: [router] } })
    const authentication = screen.getAllByRole('presentation')[0]
    await router.push(baseURL)
    expect(authentication).toBeInTheDocument()
  })

  test('deckgl route', async (): Promise<void> => {
    render(Deckgl, { global: { plugins: [router] } })
    const deckgl = screen.getAllByRole('presentation')[0]
    await router.push(`${baseURL}${Route.Deckgl}`)
    expect(deckgl).toBeInTheDocument()
  })

  test('login route', async (): Promise<void> => {
    render(Authentication, { global: { plugins: [router] } })
    const authentication = screen.getAllByRole('presentation')[0]
    await router.push(`${baseURL}${Route.Login}`)
    expect(authentication).toBeInTheDocument()
  })

  test('mapbox route', async (): Promise<void> => {
    render(Mapbox, { global: { plugins: [router] } })
    const mapbox = screen.getAllByRole('presentation')[0]
    await router.push(`${baseURL}${Route.Mapbox}`)
    expect(mapbox).toBeInTheDocument()
  })

  test('pageNotFound route', async (): Promise<void> => {
    render(PageNotFound, { global: { plugins: [router] } })
    const pageNotFound = screen.getAllByRole('presentation')[0]
    await router.push(`${baseURL}abc`)
    expect(pageNotFound).toBeInTheDocument()
  })

  test('register route', async (): Promise<void> => {
    render(Registration, { global: { plugins: [router] } })
    const registration = screen.getAllByRole('presentation')[0]
    await router.push(`${baseURL}${Route.Register}`)
    expect(registration).toBeInTheDocument()
  })
})
