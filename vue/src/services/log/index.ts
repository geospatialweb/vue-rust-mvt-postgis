import { Service } from 'typedi'

import { Color } from '@/enums'

@Service()
export default class LogService {
  logErrorMessage = (message: string): void => {
    console.error(Color.Red, message)
  }
}
