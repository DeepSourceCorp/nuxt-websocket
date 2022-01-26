import Vue from 'vue'
import WebSocketManager from '../src/templates/WebSocketManager'

describe('WebSocketManager', () => {
  const getInstance = () => {
    const emitter = new Vue()
    return new WebSocketManager('ws://localhost:8025', emitter)
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('constructor sets the properties and invokes connect method', () => {
    // Track connect method calls
    jest.spyOn(WebSocketManager.prototype, 'connect')

    const instance = getInstance()

    // Assertions
    expect(instance.url).toBe('ws://localhost:8025')
    expect(instance.emitter).toBeInstanceOf(Vue)
    expect(instance.reconnectInterval).toBe(1000)
    expect(instance.ws).toBeInstanceOf(WebSocket)
    expect(instance.connect).toBeCalled()
  })

  test('connect method', () => {
    // connect method is invoked by the constructor
    const instance = getInstance()

    // Assertions
    expect(instance.reconnectInterval).toBe(1000)
    expect(instance.ws).toBeInstanceOf(WebSocket)
  })

  test('send method', async () => {
    // Track ready method calls
    jest.spyOn(WebSocketManager.prototype, 'ready')

    const instance = getInstance()

    // Mock implementations of other function calls
    jest.spyOn(instance, 'ready').mockResolvedValue(Promise.resolve())
    jest.spyOn(WebSocket.prototype, 'send').mockReturnValue(undefined)

    // Invoke send method with the message as a string
    await instance.send('Hello world')

    // Assertions
    expect(instance.ready).toBeCalled()
    expect(WebSocket.prototype.send).toBeCalledWith('Hello world')

    // Invoke send method with the message as an object
    const msg = {
      type: 'message',
      text: 'Hello world',
      id:
        'id' +
        Math.random()
          .toString(16)
          .slice(2),
      date: Date.now()
    }
    await instance.send(msg)

    // Assertions
    expect(instance.ready).toBeCalled()
    expect(WebSocket.prototype.send).toBeCalledWith(JSON.stringify(msg))
  })

  test('ready method', async () => {
    const instance = getInstance()

    // The promise is resolved straightaway if the readyState is 1
    Object.defineProperty(instance.ws, 'readyState', {
      value: 1
    })
    await instance.ready()
  })
})
