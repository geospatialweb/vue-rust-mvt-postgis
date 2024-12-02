import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/vue'

import { LayerController, Mapbox, Modal, Trails } from '@/components'
import { mapbox } from '@/configuration'
import { Mapbox as MapboxView } from '@/views'

describe('Mapbox view test suite', (): void => {
  it('should render successfully', (): void => {
    render(MapboxView)
    const mapboxView = screen.getAllByRole('presentation')[0]
    expect(mapboxView).toBeInTheDocument()
  })

  test('Mapbox component renders successfully', (): void => {
    /* prettier-ignore */
    const { options: { container } } = mapbox
    render(Mapbox, { props: { container } })
    const mapboxComponent = screen.getByRole('presentation')
    expect(mapboxComponent).toBeInTheDocument()
  })

  test('LayerController component renders successfully', (): void => {
    render(LayerController)
    const list = screen.getByTestId('layers')
    expect(list).toBeInTheDocument()
  })

  test('Trails component renders successfully', (): void => {
    render(Trails)
    const trails = screen.getByLabelText('Select Trail')
    expect(trails).toBeInTheDocument()
  })

  test('Modal component renders successfully', (): void => {
    render(Modal)
    const modal = screen.getByRole('presentation')
    expect(modal).toBeInTheDocument()
  })

  test('Modal component dynamic class set correctly', (): void => {
    render(Modal)
    const modal = screen.getByRole('presentation')
    expect(modal.className).toMatch(/active/)
  })
})
