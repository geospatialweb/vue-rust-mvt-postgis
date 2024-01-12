import { AxiosRequestConfig } from 'axios'
import { FeatureCollection } from 'geojson'
import { Container, Service } from 'typedi'

import { Endpoint } from '@/enums'
import { ICredential, IEndpoint, IQueryParam } from '@/interfaces'
import { HttpService } from '@/services'

@Service()
export default class ApiService {
  #httpService = Container.get(HttpService)
  #endpoint: IEndpoint = Endpoint

  async deleteUser(token: string, username: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: { username } }
    return <string>await this.#httpService.delete(this.#endpoint.DELETE_USER_ENDPOINT, token, params)
  }

  async getGeoJSONFeatureCollection(token: string, { columns, id }: IQueryParam): Promise<FeatureCollection> {
    const params = <AxiosRequestConfig>{ params: { columns, table: id.split('-')[0] } }
    return <FeatureCollection>await this.#httpService.get(this.#endpoint.GEOJSON_ENDPOINT, token, params)
  }

  async getMapboxAccessToken(token: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: {} }
    return <string>await this.#httpService.get(this.#endpoint.MAPBOX_ACCESS_TOKEN_ENDPOINT, token, params)
  }

  async getUser(token: string, username: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: { username } }
    return <string>await this.#httpService.get(this.#endpoint.GET_USER_ENDPOINT, token, params)
  }

  async updatePassword(token: string, credentials: ICredential): Promise<string> {
    const body = <AxiosRequestConfig>{ ...credentials }
    return <string>await this.#httpService.patch(this.#endpoint.UPDATE_PASSWORD_ENDPOINT, token, body)
  }
}
