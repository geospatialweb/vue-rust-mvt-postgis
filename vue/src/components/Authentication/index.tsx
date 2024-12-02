import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { Route } from '@/enums'
import { ICredentialsState } from '@/interfaces'
import { AuthenticationService, CredentialsService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'Authentication Component',
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
          authenticationService = Container.get(AuthenticationService)
        void authenticationService.login({ username, password })
        /* eslint-enable */
      },
      jsx = ({ isAdmin, isCorrect, isValid, password, username }: ICredentialsState): JSX.Element => (
        <div class={credentials} role="presentation">
          <p class={isCorrect ? inactive : active}>Username/password incorrect</p>
          <p class={isValid ? inactive : active}>Username is not registered</p>
          <div class={spacer}></div>
          <form onSubmit={(evt): void => onSubmitHandler(evt)}>
            <fieldset>
              <h1>Welcome to Geospatial Web</h1>
              <label for="username">Username:</label>
              {isAdmin ? (
                /* prettier-ignore */
                <input
                  id="username"
                  name="username"
                  type="email"
                  autocomplete="username"
                  value={username}
                  required
                />
              ) : (
                <input
                  id="username"
                  name="username"
                  type="email"
                  autocomplete="username"
                  placeholder="Enter Email Address"
                  required
                />
              )}
              <div class={spacer}></div>
              <label for="password">Password:</label>
              {isAdmin ? (
                /* prettier-ignore */
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="off"
                  minlength="8"
                  value={password}
                  required />
              ) : (
                <input
                  id="password"
                  name="password"
                  type="password"
                  autocomplete="off"
                  minlength="8"
                  placeholder="Enter Password"
                  required
                />
              )}
              <div class={spacer}></div>
              <button type="submit">Login</button>
            </fieldset>
          </form>
          <div class={doublespacer}></div>
          <router-link
            to={{ name: Route.Register }}
            onClick={(): void => setCredentialsState({ isCorrect: true, isValid: true })}
          >
            Optional Registration
          </router-link>
        </div>
      )
    return (): JSX.Element => jsx(getCredentialsState())
  }
})
