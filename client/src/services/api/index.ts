import { AxiosRequestConfig } from 'axios'
import { FeatureCollection } from 'geojson'
import { Container, Service } from 'typedi'

import { Endpoint } from '@/enums'
import { ICredential, IQueryParam } from '@/interfaces'
import { HttpService } from '@/services'

@Service()
export default class ApiService {
  #httpService = Container.get(HttpService)

  #deleteUserEndpoint: string = Endpoint.DELETE_USER_ENDPOINT
  #geoJsonEndpoint: string = Endpoint.GEOJSON_ENDPOINT
  #getUserEndpoint: string = Endpoint.GET_USER_ENDPOINT
  #mapboxAccessTokenEnpoint: string = Endpoint.MAPBOX_ACCESS_TOKEN_ENDPOINT
  #updatePasswordEndpoint: string = Endpoint.UPDATE_PASSWORD_ENDPOINT

  async deleteUser(token: string, username: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: { username } }
    return <string>await this.#httpService.delete(this.#deleteUserEndpoint, token, params)
  }

  async getGeoJSONFeatureCollection(token: string, { columns, id }: IQueryParam): Promise<FeatureCollection> {
    const params = <AxiosRequestConfig>{ params: { columns, table: id.split('-')[0] } }
    return <FeatureCollection>await this.#httpService.get(this.#geoJsonEndpoint, token, params)
  }

  async getMapboxAccessToken(token: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: {} }
    return <string>await this.#httpService.get(this.#mapboxAccessTokenEnpoint, token, params)
  }

  async getUser(token: string, username: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: { username } }
    return <string>await this.#httpService.get(this.#getUserEndpoint, token, params)
  }

  async updatePassword(token: string, credentials: ICredential): Promise<string> {
    const body = <AxiosRequestConfig>{ ...credentials }
    return <string>await this.#httpService.patch(this.#updatePasswordEndpoint, token, body)
  }
}
