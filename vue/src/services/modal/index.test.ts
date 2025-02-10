import { Container } from 'typedi'

import { ModalService } from '@/services'
import { testData } from '@/test'

import type { IModalState } from '@/interfaces'

describe('ModalService test suite', (): void => {
  const modalService = Container.get(ModalService)

  test('modalState getter should be called with a return', (): void => {
    const { modalState } = testData as { modalState: IModalState },
      spy = vi.spyOn(modalService, 'modalState', 'get').mockReturnValue(modalState)
    modalService.modalState
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('hideModal method should be called', (): void => {
    const spy = vi.spyOn(modalService, 'hideModal')
    modalService.hideModal()
    expect(spy).toBeCalled()
  })

  test('showModal method should be called', (): void => {
    const spy = vi.spyOn(modalService, 'showModal')
    modalService.showModal()
    expect(spy).toBeCalled()
  })
})
