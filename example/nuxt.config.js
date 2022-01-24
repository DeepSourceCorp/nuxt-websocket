export default {
  modules: ['@nuxt/typescript-build', '../src/module.ts'],
  websocket: {
    url: 'wss://sockets.deepsource.io/'
  }
}
