import Vue from 'vue'
import WebSocketManager from '../src/templates/WebSocketManager'

describe('WebSocketManager', () => {
  const getInstance = () => {
    const emitter = new Vue()
    return new WebSocketManager('ws://localhost:8025', emitter, 1000)
  }

  afterEach(() => {
    jest.restoreAllMocks()
  })

  test('constructor sets the properties and invokes connect method', () => {
    // Track connect method calls.
    jest.spyOn(WebSocketManager.prototype, 'connect')

    const instance = getInstance()

    // Assertions
    expect(instance.url).toBe('ws://localhost:8025')
    expect(instance.emitter).toBeInstanceOf(Vue)
    expect(instance.reconnectInterval).toBe(1000)
    expect(instance.ws).toBeInstanceOf(WebSocket)
    expect(instance.connect).toBeCalled()
  })

  test('connect method establishes websocket connection', () => {
    // connect method is invoked by the constructor.
    const instance = getInstance()

    // Assertions
    expect(instance.reconnectInterval).toBe(1000)
    expect(instance.ws).toBeInstanceOf(WebSocket)
  })

  test('ready method ensures the websocket connection is open', () => {
    const instance = getInstance()

    // The promise is resolved straightaway if the readyState is not 1.
    expect(instance.ready()).resolves.toBe(undefined)
  })

  test('send method transmits the data received as a string', async () => {
    const instance = getInstance()

    // Mock implementations of other function calls.
    jest.spyOn(instance, 'ready').mockResolvedValue(Promise.resolve())
    jest.spyOn(instance.ws, 'send').mockReturnValue(undefined)

    // Invoke send method with the message as a string.
    await instance.send('Hello world')

    // Assertions
    expect(instance.ready).toBeCalled()
    expect(instance.ws.send).toBeCalledWith('Hello world')
  })

  test('send method transmits the data received as an object', async () => {
    const instance = getInstance()

    // Mock implementations of other function calls.
    jest.spyOn(instance, 'ready').mockResolvedValue(Promise.resolve())
    jest.spyOn(instance.ws, 'send').mockReturnValue(undefined)

    // Invoke send method with the message as an object.
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
    expect(instance.ws.send).toBeCalledWith(JSON.stringify(msg))
  })

  test('close method closes the websocket connection', () => {
    const instance = getInstance()

    // Track WebSocket instance close method calls.
    instance.ws.close = jest.fn()

    // Invoke close method.
    instance.close()

    // Assertion
    expect(instance.ws.close).toBeCalled()
  })
})
