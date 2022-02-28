export default {
  modules: ['@nuxt/typescript-build', '../src/module.ts'],
  websocket: {
    urlForProd: 'wss://sockets.deepsource.io/'
  }
}
