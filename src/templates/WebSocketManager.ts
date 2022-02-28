import Vue from 'vue'

/**
 * The WebSocketManager class
 */
export default class WebSocketManager {
  url: string;
  emitter: Vue;
  reconnectInterval: number;
  ws: WebSocket;

  /**
   * Constructor function for the WebSocketManager class.
   * Initializes properties and invokes connect method.
   *
   * @param {string} url
   * @param {number} reconnectInterval
   * @returns {WebSocketManager}
   */
  constructor (url: string, reconnectInterval: number) {
    this.url = url
    this.emitter = new Vue()
    this.reconnectInterval = reconnectInterval || 1000
    this.ws = new WebSocket(this.url)
    this.connect()
  }

  /**
   * Establishes WebSocket connection.
   * Defines handlers for message, close and error events.
   *
   * @returns {void}
   */
  connect () {
    this.reconnectInterval = this.reconnectInterval || 1000
    this.ws = new WebSocket(this.url)

    this.ws.onmessage = (message) => {
      try {
        const data = JSON.parse(message.data)
        this.emitter.$emit(data.event, data.data)
      } catch (err) {
        this.emitter.$emit('message', message)
      }
    }

    this.ws.onclose = (event) => {
      if (event) {
        // Event.code 1000 is our normal close event
        if (event.code !== 1000) {
          const maxReconnectInterval = 3000
          setTimeout(() => {
            if (this.reconnectInterval < maxReconnectInterval) {
              // Reconnect interval can't be > x seconds
              this.reconnectInterval += 1000
            }
            this.connect()
          }, this.reconnectInterval)
        }
      }
    }

    this.ws.onerror = (error): void => {
      console.error(error)
      this.ws.close()
    }
  }

  /**
   * Waits for the WebSocket connection to be open if not already and transmits the data received.
   *
   * @param {string | Record<string, unknown>} message
   * @returns {Promise<void>}
   */
  async send (message: string | Record<string, unknown>) {
    await this.ready()
    const parsedMessage = typeof message === 'string' ? message : JSON.stringify(message)
    return this.ws.send(parsedMessage)
  }

  /**
   * Returns a promise that resolves straightaway if the WebSocket connection is open.
   * Or else, waits until the open event is fired.
   * @returns {Promise<void>}
   */
  ready () {
    return new Promise<void>((resolve) => {
      if (this.ws.readyState !== this.ws.OPEN) {
        this.ws.onopen = () => {
          this.reconnectInterval = 1000
          resolve()
        }
      } else {
        resolve()
      }
    })
  }
}
