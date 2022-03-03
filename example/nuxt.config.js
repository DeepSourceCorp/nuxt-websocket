export default {
  buildModules: ['@nuxtjs/tailwindcss'],
  modules: ['@nuxt/typescript-build', '../src/module.ts'],
  websocket: {
    urlForProd: 'wss://sockets.deepsource.io/'
  }
}
