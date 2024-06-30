import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'

import { App, Header } from '@/components'
import { testData } from '@/test'

describe('App component test suite', (): void => {
  beforeAll((): void => {
    setActivePinia(createPinia())
  })

  test('App should render successfully', (): void => {
    const { routes } = testData,
      baseURL = import.meta.env.BASE_URL,
      history = createWebHistory(baseURL),
      router = createRouter({ history, routes })
    render(App, { global: { plugins: [router] } })
    const app = screen.getByRole('presentation')
    expect(app).toBeInTheDocument()
  })

  test('Header should render successfully', (): void => {
    render(Header)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })
})
