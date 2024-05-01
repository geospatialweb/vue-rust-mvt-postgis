import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { IApp } from '@/interfaces'
import { AppService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'Footer Component',
  setup() {
    const { active, inactive } = styles,
      getAppState = (): IApp => {
        const appService = Container.get(AppService),
          { appState } = appService
        return appState
      },
      jsx = ({ isMobile }: IApp): JSX.Element => (
        <footer class={isMobile ? inactive : active} aria-label="footer">
          <p>Use Mouse Wheel to zoom in/out Hold down Shift key to rotate map</p>
        </footer>
      )
    return (): JSX.Element => jsx(getAppState())
  }
})
