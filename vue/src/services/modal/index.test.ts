import { Container } from 'typedi'

import { ModalService } from '@/services'

describe('ModalService test suite', (): void => {
  const modalService = Container.get(ModalService)

  test('modalState getter should be called', (): void => {
    const spy = vi.spyOn(modalService, 'modalState', 'get')
    modalService.modalState
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('hideModal method should be called', (): void => {
    const spy = vi.spyOn(modalService, 'hideModal')
    modalService.hideModal()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('showModal method should be called', (): void => {
    const spy = vi.spyOn(modalService, 'showModal')
    modalService.showModal()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })
})
