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

const reconnectInterval = Number('<%= options.reconnectInterval %>') || 1000
const urlForProdFromOptions = '<%= options.urlForProd %>'
const urlForDevFromOptions = '<%= options.urlForDev %>'

export default ({ app }: { app: NuxtAppOptions }, inject: Inject): void => {
  const url =
    process.env.NODE_ENV === 'development'
      ? app.$config.webSocketUrlForDev ||
        urlForDevFromOptions ||
        'wss://echo.websocket.events/'
      : app.$config.webSocketUrlForProd || urlForProdFromOptions

  const emitter = new Vue()
  const manager = new WebSocketManager(url, emitter, reconnectInterval)
  inject('socket', emitter)
  inject('socketManager', manager)
}
