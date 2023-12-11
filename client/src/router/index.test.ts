import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

import { Authentication, Deck, Mapbox, PageNotFound, Registration } from '@/views'
import { testData } from '@/test'

describe('router test suite', (): void => {
  const { routes } = testData,
    baseURL = import.meta.env.BASE_URL,
    history = createWebHistory(baseURL),
    router = createRouter({ history, routes })

  beforeEach((): void => {
    setActivePinia(createPinia())
  })

  test('set deckgl route', async (): Promise<void> => {
    render(Deck, { global: { plugins: [router] } })
    const deckgl = screen.getAllByRole('presentation')[0]
    await router.push(`${baseURL}deckgl`)
    expect(deckgl).toBeInTheDocument()
  })

  test('set login route', async (): Promise<void> => {
    render(Authentication, { global: { plugins: [router] } })
    const authentication = screen.getAllByRole('presentation')[0]
    await router.push(`${baseURL}login`)
    expect(authentication).toBeInTheDocument()
  })

  test('set mapbox route', async (): Promise<void> => {
    render(Mapbox, { global: { plugins: [router] } })
    const mapbox = screen.getAllByRole('presentation')[0]
    await router.push(`${baseURL}mapbox`)
    expect(mapbox).toBeInTheDocument()
  })

  test('set 404 route', async (): Promise<void> => {
    render(PageNotFound, { global: { plugins: [router] } })
    const pageNotFound = screen.getAllByRole('presentation')[0]
    await router.push(`${baseURL}abc`)
    expect(pageNotFound).toBeInTheDocument()
  })

  test('set register route', async (): Promise<void> => {
    render(Registration, { global: { plugins: [router] } })
    const registration = screen.getAllByRole('presentation')[0]
    await router.push(`${baseURL}register`)
    expect(registration).toBeInTheDocument()
  })
})
