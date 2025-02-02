import { IJwtState } from '@/interfaces'

declare global {
  interface Window {
    jwtState: IJwtState
  }
}
export {}
