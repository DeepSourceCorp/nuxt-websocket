import { Module } from '@nuxt/types'
import Vue from 'vue'
import { name, version } from '../package.json'

import WebSocketManager from './templates/WebSocketManager.client'

export interface ModuleOptions {
  uri: string;
}

const CONFIG_KEY = 'websocket'

const nuxtModule: Module<ModuleOptions> = /* async */ function (moduleOptions) {
  const options = Object.assign(
    this.options[CONFIG_KEY] /* istanbul ignore next */ || {},
    moduleOptions
  )

  this.addPlugin({
    src: require.resolve('./templates/WebSocketManager.client.ts'),
    fileName: 'nuxt-websocket/templates/WebSocketManager.client.ts',
    options
  })

  // Register plugin
  const src = require.resolve('./templates/plugin')
  this.addPlugin({
    src,
    fileName: 'nuxt-websocket/templates/websocket.client.ts',
    options
  })
};

(nuxtModule as any).meta = { name, version }

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

export default nuxtModule
