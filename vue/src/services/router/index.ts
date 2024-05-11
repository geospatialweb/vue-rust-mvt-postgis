import { Service } from 'typedi'

import router from '@/router'

@Service()
export default class RouterService {
  #router = router

  async setRoute(name: string): Promise<void> {
    await this.#router.push({ name })
  }
}
