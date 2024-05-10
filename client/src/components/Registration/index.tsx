import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { Route } from '@/enums'
import { ICredentialState } from '@/interfaces'
import { CredentialsService, RegistrationService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'Registration Component',
  setup() {
    const { active, credentials, doublespacer, inactive, spacer } = styles,
      credentialsService = Container.get(CredentialsService),
      getCredentialsState = (): ICredentialState => {
        const { credentialsState } = credentialsService
        return credentialsState
      },
      setCredentialsState = (state: ICredentialState): void => credentialsService.setCredentialsState({ ...state }),
      /* eslint-disable */
      getCredentials = (evt: any): void | ICredentialState => {
        const username = evt.target[1].value as string,
          password = evt.target[2].value as string
        /* eslint-enable */
        if (!username || !password) return setCredentialsState({ isCorrect: false, isValid: true })
        return { username, password }
      },
      register = (credentials: ICredentialState): void => {
        const registrationService = Container.get(RegistrationService)
        void registrationService.register({ ...credentials })
      },
      onSubmitHandler = (evt: Event): void => {
        evt.preventDefault()
        const credentials = getCredentials(evt)
        credentials && register(credentials)
      },
      jsx = ({ isCorrect, isValid }: ICredentialState): JSX.Element => (
        <div class={credentials} role="presentation">
          <p class={isCorrect ? inactive : active}>Username/password incorrect</p>
          <p class={isValid ? inactive : active}>Username already registered</p>
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
            to={{ name: Route.LOGIN }}
            onClick={(): void => setCredentialsState({ isCorrect: true, isValid: true })}
          >
            Already Registered?
          </router-link>
        </div>
      )
    return (): JSX.Element => jsx(getCredentialsState())
  }
})
