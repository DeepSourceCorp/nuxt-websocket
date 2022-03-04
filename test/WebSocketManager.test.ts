import Vue from 'vue'
import WS from 'jest-websocket-mock'
import WebSocketManager from '../src/templates/WebSocketManager'

let ws = {} as WS
let client = {} as WebSocketManager

describe('WebSocketManager', () => {
  beforeEach(async () => {
    const emitter = new Vue()

    // create a WS instance, listening on port 8025 on localhost.
    ws = new WS('ws://localhost:8025')

    // Connect to the mock websocket server.
    client = new WebSocketManager('ws://localhost:8025', emitter, 1000)

    // Wait for the server to have established the connection.
    await ws.connected
  })

  afterEach(() => {
    jest.restoreAllMocks()
    WS.clean()
  })

  test('connect method establishes websocket connection', () => {
    // connect method is invoked by the constructor.

    // Assertions
    expect(client.url).toBe('ws://localhost:8025')
    expect(client.emitter).toBeInstanceOf(Vue)
    expect(client.reconnectInterval).toBe(1000)
    expect(client.ws).toBeInstanceOf(WebSocket)
  })

  test('emits an event of the type `message` on receiving the data as a string', () => {
    // Mock
    Vue.prototype.$emit = jest.fn()

    // Send data to the client.
    ws.send('Test message')

    // Assertions
    expect(Vue.prototype.$emit.mock.calls[0][0]).toBe('message')
    expect(Vue.prototype.$emit.mock.calls[0][1].data).toBe('Test message')
  })

  test('emits an event of the type based on value for the event key when the data is an object', () => {
    // Mock
    Vue.prototype.$emit = jest.fn()

    // Send data to the client.
    ws.send(JSON.stringify({ event: 'socket', data: 'Hello world' }))

    // Assertions
    expect(Vue.prototype.$emit.mock.calls[0][0]).toBe('socket')
    expect(Vue.prototype.$emit.mock.calls[0][1]).toBe('Hello world')
  })

  test('attempts reconnection on a close event which is not normal', async () => {
    // Mocks
    client.connect = jest.fn()
    jest.spyOn(global, 'setTimeout')

    // Close the connection with a code that is not normal.
    ws.close({ wasClean: false, code: 1003, reason: 'nope' })

    // Assertions
    expect(global.setTimeout).toBeCalledWith(expect.any(Function), 1000)

    // Wait for 1s and assert for the reconnection attempt.
    await new Promise(resolve => setTimeout(resolve, 1000))
    expect(client.connect).toBeCalled()
  })

  test('closes the websocket connection on error event', () => {
    // Mocks
    console.error = jest.fn(); // eslint-disable-line
    client.ws.close = jest.fn()

    // Simulate an error and close the connection.
    ws.error()

    // Assertions
    expect(console.error).toBeCalled(); // eslint-disable-line
    expect(client.ws.close).toBeCalled()
  })

  test('ready method waits for the open event if the readyState is not 1', () => {
    // Assertion
    expect(client.ready()).resolves.toBe(undefined)
  })

  test('ready method is resolved straightaway if the readyState is 1', () => {
    Object.defineProperty(client.ws, 'readyState', {
      value: 1
    })

    // Assertion
    expect(client.ready()).resolves.toBe(undefined)
  })

  test('send method transmits the data received as a string', async () => {
    // Mock implementations of other function calls.
    jest.spyOn(client, 'ready').mockResolvedValue(Promise.resolve())
    jest.spyOn(client.ws, 'send').mockReturnValue(undefined)

    // Invoke send method with the message as a string.
    await client.send('Hello world')

    // Assertions
    expect(client.ready).toBeCalled()
    expect(client.ws.send).toBeCalledWith('Hello world')
  })

  test('send method transmits the data received as an object', async () => {
    // Mock implementations of other function calls.
    jest.spyOn(client, 'ready').mockResolvedValue(Promise.resolve())
    jest.spyOn(client.ws, 'send').mockReturnValue(undefined)

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
    await client.send(msg)

    // Assertions
    expect(client.ready).toBeCalled()
    expect(client.ws.send).toBeCalledWith(JSON.stringify(msg))
  })

  test('close method closes the websocket connection', () => {
    // Track WebSocket instance close method calls.
    client.ws.close = jest.fn()

    // Invoke close method.
    client.close()

    // Assertion
    expect(client.ws.close).toBeCalled()
  })
})
