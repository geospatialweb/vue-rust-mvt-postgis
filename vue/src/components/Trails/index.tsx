import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { trails } from '@/configuration'
import { TrailService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'Trails Component',
  setup() {
    const { trail } = styles,
      onChangeHandler = (evt: Event): void => {
        evt.stopPropagation()
        const { value: name } = evt.target as HTMLSelectElement,
          trailService = Container.get(TrailService)
        trailService.selectTrail(name)
      }
    return (): JSX.Element => (
      <label>
        Select Trail
        <select class={trail} name="trails" onChange={(evt): void => onChangeHandler(evt)}>
          <option>Select Trail</option>
          {
            /* prettier-ignore */
            trails.map(({ name }): JSX.Element => <option key={name}>{name}</option>)
          }
        </select>
      </label>
    )
  }
})
