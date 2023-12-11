import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { ICredential } from '@/interfaces'
import { AuthenticationService, CredentialsService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'Authentication',
  setup() {
    const { active, inactive, credentials, spacer, doublespacer } = styles,
      authenticationService = Container.get(AuthenticationService),
      credentialsService = Container.get(CredentialsService),
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
      login = (credentials: ICredential): void => {
        void authenticationService.login({ ...credentials })
      },
      onSubmitHandler = (evt: Event): void => {
        evt.preventDefault()
        const credentials = getCredentials(evt)
        credentials && login(credentials)
      },
      jsx = ({ isAdmin, isCorrect, isValid, password, username }: ICredential): JSX.Element => (
        <div class={credentials} role="presentation">
          <p class={isCorrect ? inactive : active}>Username/password incorrect</p>
          <p class={isValid ? inactive : active}>Username is not registered</p>
          <form onSubmit={(evt): void => onSubmitHandler(evt)}>
            <fieldset>
              <h1>Welcome to Geospatial Web</h1>
              <label for="username">Username:</label>
              {isAdmin ? (
                <input id="username" type="email" value={username} />
              ) : (
                <input id="username" type="email" placeholder="Enter Email Address" />
              )}
              <div class={spacer}></div>
              <label for="password">Password:</label>
              {isAdmin ? (
                <input id="password" type="password" value={password} />
              ) : (
                <input id="password" type="password" placeholder="Enter Password" />
              )}
              <div class={spacer}></div>
              <button type="submit">Login</button>
            </fieldset>
          </form>
          <div class={doublespacer}></div>
          <router-link
            to={{ name: 'register' }}
            onClick={(): void => setCredentialsState({ isCorrect: true, isValid: true })}
          >
            Optional Registration
          </router-link>
        </div>
      )
    return (): JSX.Element => jsx(getCredentialsState())
  }
})
