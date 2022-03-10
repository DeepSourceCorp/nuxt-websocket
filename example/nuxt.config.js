export default {
  buildModules: ['@nuxtjs/tailwindcss'],
  modules: ['@nuxt/typescript-build', '../src/module.ts'],
  websocket: {
    url: 'wss://echo.websocket.events/'
  }
}
