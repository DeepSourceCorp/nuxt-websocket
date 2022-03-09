import { NuxtAppOptions } from '@nuxt/types'
import { Inject } from '@nuxt/types/app'

import plugin from '../src/templates/plugin'

// Mocks
const ctx = {
  app: {
    $config: {
      webSocketUrlForDev: 'wss://echo.websocket.events/'
    }
  } as NuxtAppOptions
}
const inject: jest.MockedFunction<Inject> = jest.fn()

describe('plugin', () => {
  test('injects socket and socketManager plugins', () => {
    Object.defineProperty(process.env, 'NODE_ENV', {
      value: 'development'
    })

    // Invoke plugin function.
    plugin(ctx, inject)

    // Assertions
    expect(inject).toBeCalledTimes(2)
    expect(inject.mock.calls[0][0]).toBe('socket')
    expect(inject.mock.calls[1][0]).toBe('socketManager')
  })
})
