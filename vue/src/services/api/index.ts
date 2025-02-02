import { Container, Service } from 'typedi'

import { Endpoint, EndpointPrefix } from '@/enums'
import { HttpService } from '@/services'

import type { FeatureCollection } from 'geojson'
import type { ICredentialsState, IGeoJsonParam, IMapboxAccessToken, IUser } from '@/interfaces'
import type { HttpRequest } from '@/types'

@Service()
export default class ApiService {
  #endpointPrefix: EndpointPrefix
  #httpService: HttpService

  constructor() {
    this.#endpointPrefix = EndpointPrefix.Api
    this.#httpService = Container.get(HttpService)
  }

  getGeoJsonFeatureCollection = async (
    { columns, table }: IGeoJsonParam,
    { role }: ICredentialsState,
    jwtToken: string
  ): Promise<FeatureCollection> => {
    const query = <HttpRequest>{ params: { columns, table: table.split('-')[0], role } },
      endpoint = `${this.#endpointPrefix}${Endpoint.GetGeoJson}`
    return <FeatureCollection>await this.#httpService.get(endpoint, query, jwtToken)
  }

  deleteUser = async ({ username, role }: ICredentialsState, jwtToken: string): Promise<IUser> => {
    const query = <HttpRequest>{ params: { username, role } },
      endpoint = `${this.#endpointPrefix}${Endpoint.DeleteUser}`
    return <IUser>await this.#httpService.delete(endpoint, query, jwtToken)
  }

  getUser = async ({ username, role }: ICredentialsState, jwtToken: string): Promise<IUser> => {
    const query = <HttpRequest>{ params: { username, role } },
      endpoint = `${this.#endpointPrefix}${Endpoint.GetUser}`
    return <IUser>await this.#httpService.get(endpoint, query, jwtToken)
  }

  updatePassword = async ({ username, password, role }: ICredentialsState, jwtToken: string): Promise<IUser> => {
    const body = <HttpRequest>{ username, password, role },
      endpoint = `${this.#endpointPrefix}${Endpoint.UpdatePassword}`
    return <IUser>await this.#httpService.patch(endpoint, body, jwtToken)
  }

  getMapboxAccessToken = async ({ role }: ICredentialsState, jwtToken: string): Promise<IMapboxAccessToken> => {
    const query = <HttpRequest>{ params: { role } },
      endpoint = `${this.#endpointPrefix}${Endpoint.GetMapboxAccessToken}`
    return <IMapboxAccessToken>await this.#httpService.get(endpoint, query, jwtToken)
  }
}
