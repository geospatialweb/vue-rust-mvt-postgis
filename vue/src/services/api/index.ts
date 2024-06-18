import { AxiosRequestConfig } from 'axios'
import { FeatureCollection } from 'geojson'
import { Container, Service } from 'typedi'

import { ICredentialsState, IQueryParam } from '@/interfaces'
import { HttpService } from '@/services'

@Service()
export default class ApiService {
  #httpService = Container.get(HttpService)

  #deleteUserEndpoint = `${import.meta.env.VITE_DELETE_USER_ENDPOINT}`
  #geoJsonEndpoint = `${import.meta.env.VITE_GEOJSON_ENDPOINT}`
  #getUserEndpoint = `${import.meta.env.VITE_GET_USER_ENDPOINT}`
  #mapboxAccessTokenEnpoint = `${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN_ENDPOINT}`
  #updatePasswordEndpoint = `${import.meta.env.VITE_UPDATE_PASSWORD_ENDPOINT}`

  async deleteUser(jwtToken: string, username: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: { username } }
    return <string>await this.#httpService.delete(this.#deleteUserEndpoint, jwtToken, params)
  }

  async getGeoJSONFeatureCollection(jwtToken: string, { columns, id }: IQueryParam): Promise<FeatureCollection> {
    const params = <AxiosRequestConfig>{ params: { columns, table: id.split('-')[0] } }
    return <FeatureCollection>await this.#httpService.get(this.#geoJsonEndpoint, jwtToken, params)
  }

  async getMapboxAccessToken(jwtToken: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: {} }
    return <string>await this.#httpService.get(this.#mapboxAccessTokenEnpoint, jwtToken, params)
  }

  async getUser(jwtToken: string, username: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: { username } }
    return <string>await this.#httpService.get(this.#getUserEndpoint, jwtToken, params)
  }

  async updatePassword(jwtToken: string, credentials: ICredentialsState): Promise<string> {
    const body = <AxiosRequestConfig>{ ...credentials }
    return <string>await this.#httpService.patch(this.#updatePasswordEndpoint, jwtToken, body)
  }
}
