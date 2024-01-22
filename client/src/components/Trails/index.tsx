import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { trails } from '@/configuration'
import { TrailService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'Trails',
  setup() {
    const { trail } = styles,
      trailService = Container.get(TrailService),
      selectTrail = (name: string): void => trailService.selectTrail(name),
      onChangeHandler = (evt: Event): void => {
        evt.stopPropagation()
        const { value } = evt.target as HTMLSelectElement
        selectTrail(value)
      }
    return (): JSX.Element => (
      <label>
        Select Trail
        <select class={trail} name="trails" onChange={(evt): void => onChangeHandler(evt)}>
          <option>Select Trail</option>
          {trails.map(
            ({ name }): JSX.Element => (
              <option key={name}>{name}</option>
            )
          )}
        </select>
      </label>
    )
  }
})
