import { Container } from 'typedi'

import { LogService } from '@/services'

describe('LogService test suite', () => {
  const logService = Container.get(LogService)

  test('logCsvError method should be called', () => {
    const message = 'csv fetch failed',
      spy = vi.spyOn(logService, 'logCsvError')
    logService.logCsvError(message)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(message)
  })

  test('logHexagonLayerDataError should be called', () => {
    const message = 'hexagon layer data has zero records',
      spy = vi.spyOn(logService, 'logHexagonLayerDataError')
    logService.logHexagonLayerDataError(message)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(message)
  })

  test('logHttpRequestError method should be called', () => {
    const message = 'http request error',
      spy = vi.spyOn(logService, 'logHttpRequestError')
    logService.logHttpRequestError(message)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(message)
  })

  test('logHttpRequestDataError method should be called', () => {
    const message = 'http request data error',
      spy = vi.spyOn(logService, 'logHttpRequestDataError')
    logService.logHttpRequestDataError(message)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(message)
  })

  test('logJwtCreationError method should be called', () => {
    const message = 'undefined jwt',
      spy = vi.spyOn(logService, 'logJwtCreationError')
    logService.logJwtCreationError(message)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(message)
  })

  test('logMapboxAccessTokenError method should be called', () => {
    const message = 'undefined mapbox access token',
      spy = vi.spyOn(logService, 'logMapboxAccessTokenError')
    logService.logMapboxAccessTokenError(message)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(message)
  })

  test('logMarkersError method should be called', () => {
    const message = 'no office feature found',
      spy = vi.spyOn(logService, 'logMarkersError')
    logService.logMarkersError(message)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(message)
  })
})
