import Vue from 'vue'

export default class WebSocketManager {
  url: string;
  emitter: Vue;
  reconnectInterval: number;
  ws: WebSocket;

  constructor (url: string, emitter: Vue) {
    this.url = url
    this.emitter = emitter
    this.reconnectInterval = 1000
    this.ws = new WebSocket(this.url)
    this.connect()
  }

  connect () {
    this.reconnectInterval = 1000
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

  send (message: string | Record<string, unknown>) {
    return this.ready().then(() => {
      const parsedMessage =
        typeof message === 'string' ? message : JSON.stringify(message)
      return this.ws.send(parsedMessage)
    })
  }

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
