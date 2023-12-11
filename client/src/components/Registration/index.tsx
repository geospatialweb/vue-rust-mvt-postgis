import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { ICredential } from '@/interfaces'
import { CredentialsService, RegistrationService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'Registration',
  setup() {
    const { active, inactive, credentials, spacer, doublespacer } = styles,
      credentialsService = Container.get(CredentialsService),
      registrationService = Container.get(RegistrationService),
      getCredentialsState = (): ICredential => {
        const { credentialsState } = credentialsService
        return credentialsState
      },
      setCredentialsState = (state: ICredential): void => credentialsService.setCredentialsState({ ...state }),
      /* eslint-disable */
      getCredentials = (evt: any): void | ICredential => {
        const username = evt.target[1].value as string,
          password = evt.target[2].value as string
        /* eslint-enable */
        if (!username || !password) return setCredentialsState({ isCorrect: false, isValid: true })
        return { username, password }
      },
      register = (credentials: ICredential): void => {
        void registrationService.register({ ...credentials })
      },
      onSubmitHandler = (evt: Event): void => {
        evt.preventDefault()
        const credentials = getCredentials(evt)
        credentials && register(credentials)
      },
      jsx = ({ isCorrect, isValid }: ICredential): JSX.Element => (
        <div class={credentials} role="presentation">
          <p class={isCorrect ? inactive : active}>Username/password incorrect</p>
          <p class={isValid ? inactive : active}>Username already registered</p>
          <form onSubmit={(evt): void => onSubmitHandler(evt)}>
            <fieldset>
              <h1>Welcome to Geospatial Web</h1>
              <label for="username">Username:</label>
              <input id="username" type="email" placeholder="Enter Email Address" />
              <div class={spacer}></div>
              <label for="password">Password:</label>
              <input id="password" type="password" placeholder="Enter Password" />
              <div class={spacer}></div>
              <button type="submit">Register</button>
            </fieldset>
          </form>
          <div class={doublespacer}></div>
          <router-link
            to={{ name: 'login' }}
            onClick={(): void => setCredentialsState({ isCorrect: true, isValid: true })}
          >
            Already Registered?
          </router-link>
        </div>
      )
    return (): JSX.Element => jsx(getCredentialsState())
  }
})
