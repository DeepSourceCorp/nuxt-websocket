import {
  expectModuleToBeCalledWith,
  getNuxt,
  setupTest
} from '@nuxt/test-utils'

describe('module', () => {
  setupTest({
    testDir: __dirname,
    fixture: '../example'
  })

  test('should register the plugin', () => {
    expectModuleToBeCalledWith('addPlugin', {
      src: require.resolve('../src/templates/plugin.ts'),
      fileName: 'nuxt-websocket/websocket.client.ts',
      options: getNuxt().options.websocket
    })
  })

  test('should render the template', () => {
    expectModuleToBeCalledWith('addTemplate', {
      src: require.resolve('../src/templates/WebSocketManager.ts'),
      fileName: 'nuxt-websocket/WebSocketManager.ts',
      options: getNuxt().options.websocket
    })
  })
})
