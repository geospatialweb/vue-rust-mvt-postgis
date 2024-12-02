import { AxiosRequestConfig } from 'axios'
import { FeatureCollection } from 'geojson'
import { Container, Service } from 'typedi'

import { ApiEndpoint } from '@/enums'
import { ICredentialsState, IQueryParam } from '@/interfaces'
import { HttpService } from '@/services'

@Service()
export default class ApiService {
  #httpService = Container.get(HttpService)

  async deleteUser(jwtToken: string, username: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: { username } }
    return <string>await this.#httpService.delete(ApiEndpoint.DeleteUser, jwtToken, params)
  }

  async getGeoJSONFeatureCollection(jwtToken: string, { columns, id }: IQueryParam): Promise<FeatureCollection> {
    const params = <AxiosRequestConfig>{ params: { columns, table: id.split('-')[0] } }
    return <FeatureCollection>await this.#httpService.get(ApiEndpoint.Geojson, jwtToken, params)
  }

  async getMapboxAccessToken(jwtToken: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: {} }
    return <string>await this.#httpService.get(ApiEndpoint.MapboxAccessToken, jwtToken, params)
  }

  async getUser(jwtToken: string, username: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: { username } }
    return <string>await this.#httpService.get(ApiEndpoint.GetUser, jwtToken, params)
  }

  async updatePassword(jwtToken: string, credentials: ICredentialsState): Promise<string> {
    const body = <AxiosRequestConfig>{ ...credentials }
    return <string>await this.#httpService.patch(ApiEndpoint.UpdatePassword, jwtToken, body)
  }
}
