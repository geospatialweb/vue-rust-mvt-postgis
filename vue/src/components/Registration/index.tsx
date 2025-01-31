import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { Role, Route } from '@/enums'
import { CredentialsService, RegistrationService } from '@/services'
import styles from './index.module.css'

import type { ICredentialsState } from '@/interfaces'

export default defineComponent({
  name: 'Registration Component',
  setup() {
    const { active, credentials, doublespacer, inactive, spacer } = styles,
      getCredentialsState = (): ICredentialsState => {
        const { credentialsState } = Container.get(CredentialsService)
        return credentialsState
      },
      setCredentialsState = (state: ICredentialsState): void => {
        const credentialsService = Container.get(CredentialsService)
        credentialsService.credentialsState = { ...getCredentialsState(), ...state }
      },
      onSubmitHandler = (evt: Event): void => {
        evt.preventDefault()
        /* eslint-disable @typescript-eslint/no-explicit-any */
        const username = (evt as any).target[1].value as string,
          password = (evt as any).target[2].value as string,
          /* eslint-enable */
          { register } = Container.get(RegistrationService)
        void register({ ...getCredentialsState(), password, username, role: Role.User })
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
            onClick={(): void => setCredentialsState({ ...getCredentialsState(), isCorrect: true, isValid: true })}
          >
            Already Registered?
          </router-link>
        </div>
      )
    return (): JSX.Element => jsx(getCredentialsState())
  }
})
