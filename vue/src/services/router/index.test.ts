import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/vue'
import { Container } from 'typedi'
import { createRouter, createWebHistory } from 'vue-router'

import { layerControllerLayers } from '@/configuration'
import { Route } from '@/enums'
import { RouterService } from '@/services'
import { testData } from '@/test'
import { Authentication, Deckgl, Mapbox, PageNotFound, Registration } from '@/views'

describe('RouterService test suite', (): void => {
  const routerService = Container.get(RouterService)

  test('router getter should be called', (): void => {
    const spy = vi.spyOn(routerService, 'router', 'get')
    routerService.router
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setRoute method should be called', async (): Promise<void> => {
    const { id } = layerControllerLayers[5],
      spy = vi.spyOn(routerService, 'setRoute')
    await routerService.setRoute(id)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(id)
    expect(spy).toHaveReturnedTimes(1)
  })
})

describe('router test suite', (): void => {
  const { routes } = testData,
    baseURL = import.meta.env.BASE_URL,
    history = createWebHistory(baseURL),
    router = createRouter({ history, routes })

  test('set baseURL redirect route', async (): Promise<void> => {
    render(Authentication, { global: { plugins: [router] } })
    const authentication = screen.getAllByRole('presentation')[0]
    await router.push(baseURL)
    expect(authentication).toBeInTheDocument()
  })

  test('set deckgl route', async (): Promise<void> => {
    render(Deckgl, { global: { plugins: [router] } })
    const deckgl = screen.getAllByRole('presentation')[0]
    await router.push(`${baseURL}${Route.Deckgl}`)
    expect(deckgl).toBeInTheDocument()
  })

  test('set login route', async (): Promise<void> => {
    render(Authentication, { global: { plugins: [router] } })
    const authentication = screen.getAllByRole('presentation')[0]
    await router.push(`${baseURL}${Route.Login}`)
    expect(authentication).toBeInTheDocument()
  })

  test('set mapbox route', async (): Promise<void> => {
    render(Mapbox, { global: { plugins: [router] } })
    const mapbox = screen.getAllByRole('presentation')[0]
    await router.push(`${baseURL}${Route.Mapbox}`)
    expect(mapbox).toBeInTheDocument()
  })

  test('set pageNotFound route', async (): Promise<void> => {
    render(PageNotFound, { global: { plugins: [router] } })
    const pageNotFound = screen.getAllByRole('presentation')[0]
    await router.push(`${baseURL}abc`)
    expect(pageNotFound).toBeInTheDocument()
  })

  test('set register route', async (): Promise<void> => {
    render(Registration, { global: { plugins: [router] } })
    const registration = screen.getAllByRole('presentation')[0]
    await router.push(`${baseURL}${Route.Register}`)
    expect(registration).toBeInTheDocument()
  })
})
