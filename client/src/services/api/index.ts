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

  async deleteUser(jwt: string, username: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: { username } }
    return <string>await this.#httpService.delete(this.#endpoint.DELETE_USER_ENDPOINT, jwt, params)
  }

  async getGeoJSONFeatureCollection(jwt: string, { columns, id }: IQueryParam): Promise<FeatureCollection> {
    const params = <AxiosRequestConfig>{ params: { columns, table: id.split('-')[0] } }
    return <FeatureCollection>await this.#httpService.get(this.#endpoint.GEOJSON_ENDPOINT, jwt, params)
  }

  async getMapboxAccessToken(jwt: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: {} }
    return <string>await this.#httpService.get(this.#endpoint.MAPBOX_ACCESS_TOKEN_ENDPOINT, jwt, params)
  }

  async getUser(jwt: string, username: string): Promise<number> {
    const params = <AxiosRequestConfig>{ params: { username } }
    return <number>await this.#httpService.get(this.#endpoint.GET_USER_ENDPOINT, jwt, params)
  }

  async updatePassword(jwt: string, credentials: ICredential): Promise<string> {
    const body = <AxiosRequestConfig>{ ...credentials }
    return <string>await this.#httpService.patch(this.#endpoint.UPDATE_PASSWORD_ENDPOINT, jwt, body)
  }
}
