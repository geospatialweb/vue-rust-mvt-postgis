import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { AppService } from '@/services'
import styles from './index.module.css'

import type { IAppState } from '@/interfaces'

export default defineComponent({
  name: 'Footer Component',
  setup() {
    const { footer, active, inactive } = styles,
      getAppState = (): IAppState => {
        const { appState } = Container.get(AppService)
        return appState
      },
      jsx = ({ isMobile }: IAppState): JSX.Element => (
        <footer class={`${footer} ${isMobile ? inactive : active}`} aria-label="footer">
          <p>Use Mouse Wheel to zoom in/out Hold down Shift key to rotate map</p>
        </footer>
      )
    return (): JSX.Element => jsx(getAppState())
  }
})
