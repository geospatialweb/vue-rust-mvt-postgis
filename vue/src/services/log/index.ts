import { Service } from 'typedi'

@Service()
export default class LogService {
  logCsvError(message: string): void {
    console.error(message)
  }

  logHexagonLayerDataError(message: string): void {
    console.error(message)
  }

  logHttpRequestError(message: string): void {
    console.error(message)
  }

  logHttpRequestDataError(message: string): void {
    console.error(message)
  }

  logJwtCreationError(message: string): void {
    console.error(message)
  }

  logMapboxAccessTokenError(message: string): void {
    console.error(message)
  }

  logMarkersError(message: string): void {
    console.error(message)
  }
}
