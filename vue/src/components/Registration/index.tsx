import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { Route } from '@/enums'
import { ICredentialsState } from '@/interfaces'
import { CredentialsService, RegistrationService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'Registration Component',
  setup() {
    const { active, credentials, doublespacer, inactive, spacer } = styles,
      getCredentialsState = (): ICredentialsState => {
        const credentialsService = Container.get(CredentialsService)
        return credentialsService.credentialsState
      },
      setCredentialsState = (state: ICredentialsState): void => {
        const credentialsService = Container.get(CredentialsService)
        credentialsService.setCredentialsState({ ...state })
      },
      onSubmitHandler = (evt: Event): void => {
        /* eslint-disable */
        evt.preventDefault()
        const username = (evt as any).target[1].value as string,
          password = (evt as any).target[2].value as string,
          registrationService = Container.get(RegistrationService)
        void registrationService.register({ username, password })
        /* eslint-enable */
      },
      jsx = ({ isCorrect, isValid }: ICredentialsState): JSX.Element => (
        <div class={credentials} role="presentation">
          <p class={isCorrect ? inactive : active}>Username/password incorrect</p>
          <p class={isValid ? inactive : active}>Username already registered</p>
          <div class={spacer}></div>
          <form onSubmit={(evt): void => onSubmitHandler(evt)}>
            <fieldset>
              <h1>Welcome to Geospatial Web</h1>
              <label for="username">Username:</label>
              <input
                id="username"
                name="username"
                type="email"
                autocomplete="off"
                placeholder="Enter Email Address"
                required
              />
              <div class={spacer}></div>
              <label for="password">Password:</label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="off"
                minlength="8"
                placeholder="Enter Password"
                required
              />
              <div class={spacer}></div>
              <button type="submit">Register</button>
            </fieldset>
          </form>
          <div class={doublespacer}></div>
          <router-link
            to={{ name: Route.Login }}
            onClick={(): void => setCredentialsState({ isCorrect: true, isValid: true })}
          >
            Already Registered?
          </router-link>
        </div>
      )
    return (): JSX.Element => jsx(getCredentialsState())
  }
})
