import 'reflect-metadata'
import '@testing-library/jest-dom/vitest'

import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { ApiService, CredentialsService } from '@/services'
import { testData } from '@/test'

import type { ICredentialsState } from '@/interfaces'

setActivePinia(createPinia())

beforeAll(async (): Promise<void> => {
  const { credentials } = testData as { credentials: ICredentialsState },
    { login, register } = Container.get(CredentialsService)
  await register(credentials)
  window.jwtState = await login(credentials)
  const { jwtToken } = window.jwtState,
    { deleteUser } = Container.get(ApiService)
  await deleteUser(credentials, jwtToken)
})

window.matchMedia = (query): MediaQueryList => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
})

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
window.URL.createObjectURL = (): any => {
  /* Mock this function for mapbox-gl to work */
}
