import { extname, join } from 'path'
import { Module } from '@nuxt/types'
import Vue from 'vue'

import { name, version } from '../package.json'
import WebSocketManager from './templates/WebSocketManager'

export interface ModuleOptions {
  uri: string;
}

const CONFIG_KEY = 'websocket'

const websocketModule: Module<ModuleOptions> = function (moduleOptions) {
  /* istanbul ignore next */
  const options = Object.assign(this.options[CONFIG_KEY] || {}, moduleOptions)

  const webSocketManagerPath = require.resolve('./templates/WebSocketManager')
  const pluginPath = require.resolve('./templates/plugin')

  this.addTemplate({
    src: webSocketManagerPath,
    fileName: join(
      'nuxt-websocket',
      `WebSocketManager${extname(webSocketManagerPath)}`
    ),
    options
  })

  // Register plugin
  this.addPlugin({
    src: pluginPath,
    fileName: join('nuxt-websocket', `websocket.client${extname(pluginPath)}`),
    options
  })
};

(websocketModule as any).meta = { name, version }

declare module '@nuxt/types' {
  interface NuxtConfig {
    $socket: Vue;
    $socketManager: WebSocketManager;
  } // Nuxt 2.14+
  interface Configuration {
    $socket: Vue;
    $socketManager: WebSocketManager;
  } // Nuxt 2.9 - 2.13
}

declare module 'vue/types/vue' {
  interface Vue {
    $socket: Vue;
    $socketManager: WebSocketManager;
  }
}

export default websocketModule
