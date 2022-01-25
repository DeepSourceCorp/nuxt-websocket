import { NuxtAppOptions } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'

import Vue from 'vue'
import WebSocketManager from './WebSocketManager'

// Example Usage

// mounted() {
//   this.$socket.$on(<event-name>, (data) => {
//     console.log(`got ${data} from websocket`)
//   })
// }
//
// Sending message
// this.$socketManager.send({ event: 'socket', data: 'Hello' })

const uri = '<%= options.uri %>'

export default ({ app }: { app: NuxtAppOptions }, inject: Inject): void => {
  const url =
    process.env.NODE_ENV === 'development'
      ? 'wss://echo.websocket.org/'
      : app.$config.webSocketUri || uri

  const emitter = new Vue()
  const manager = new WebSocketManager(url, emitter)
  inject('socket', emitter)
  inject('socketManager', manager)
}
