import { Container } from 'typedi'

import { LogService } from '@/services'

describe('LogService test suite', (): void => {
  test('logErrorMessage method should be called', (): void => {
    const logService = Container.get(LogService),
      message = 'mapbox access token is missing',
      spy = vi.spyOn(logService, 'logErrorMessage')
    logService.logErrorMessage(message)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(message)
  })
})
