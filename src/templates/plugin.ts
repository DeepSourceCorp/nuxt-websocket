import { NuxtAppOptions } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'

import Vue from 'vue'
import WebSocketManager from './WebSocketManager'

// Example Usage

// mounted() {
//   this.$socket.$on(<event-name>, (data) => {
//     console.log(`got ${data} from WebSocket`)
//   })
// }
//
// Sending message
// this.$socketManager.send({ event: 'socket', data: 'Hello' })

const reconnectInterval = Number('<%= options.reconnectInterval %>') || 1000
const urlFromOptions = '<%= options.url %>'

export default ({ app }: { app: NuxtAppOptions }, inject: Inject): void => {
  /* istanbul ignore next */
  const runtimeConfig = (app.$config && app.$config.websocket) || {}

  /* istanbul ignore next */
  const url = runtimeConfig.url || urlFromOptions

  /* istanbul ignore next */
  if (!url) {
    // eslint-disable-next-line no-console
    return console.error(
      'WebSocket connection URL is required. Please specify it via options or runtime configuration.'
    )
  }

  const emitter = new Vue()
  const manager = new WebSocketManager(url, emitter, reconnectInterval)
  inject('socket', emitter)
  inject('socketManager', manager)
}
