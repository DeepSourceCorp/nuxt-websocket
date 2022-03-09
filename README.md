# nuxt-websocket

[![DeepSource](https://deepsource.io/gh/deepsourcelabs/nuxt-websocket.svg/?label=active+issues&show_trend=true&token=aDA1Tz2a_4FxFsxvu4by_loF)](https://deepsource.io/gh/deepsourcelabs/nuxt-websocket/?ref=repository-badge) [![DeepSource](https://deepsource.io/gh/deepsourcelabs/nuxt-websocket.svg/?label=resolved+issues&show_trend=true&token=aDA1Tz2a_4FxFsxvu4by_loF)](https://deepsource.io/gh/deepsourcelabs/nuxt-websocket/?ref=repository-badge)

> Nuxt.js module for websocket interactions.

## Setup

1. Add `@deepsourcelabs/nuxt-websocket` dependency to your project

```bash
yarn add @deepsourcelabs/nuxt-websocket # or npm install @deepsourcelabs/nuxt-websocket
```

2. Add `@deepsourcelabs/nuxt-websocket` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    '@deepsourcelabs/nuxt-websocket',
  ],
  websocket: {
    // module options
  }
}
```

## Options

You can pass different options using the `websocket` property in your `nuxt.config.js`:

```js
// nuxt.config.js
export default {
  websocket: {
    // module options
  }
};
```

### `url`

- Default: `wss://echo.websocket.events/`

Defines the websocket URL to connect.

### `reconnectInterval`

- Default: `1000`

Defines the time interval after which a reconnection attempt takes place for a close event that isn't normal (code !== 1000). It should be less than 3s.

### Runtime Config

URL supplied via runtime config takes priority:-

```js
// nuxt.config.js
export default {
  // Via Runtime config
  publicRuntimeConfig: {
    webSocketUrl: process.env.WEBSOCKET_URL
  }
};
```

## API

The following two plugins are injected into the Vue instance and are accessible across the app:-

- `$socket` - [Vue](https://v2.vuejs.org/v2/api/#Instance-Methods-Events) instance.
- `$socketManager` - [WebSocketManager](https://github.com/deepsourcelabs/nuxt-websocket/blob/docs/update-info/src/templates/WebSocketManager.ts) instance.

### `$socket`

Defines a global event bus.

```js
mounted() {
  this.$socket.$on('socket', (data) => {
    console.log(`got ${data} from websocket`);
  });
}

beforeDestroy() {
  this.$socket.off('socket');
}
```

Please refer to the [official documentation](https://v2.vuejs.org/v2/api/#Instance-Methods-Events) for the supported instance methods/events.

### `$socketManager`

The WebSocketManager instance has access to the following methods:-

#### `connect(): void`

Establishes websocket connection. It defines handlers for message, close and error events.

```js
this.$socketManager.connect();
```

> Invoked by the WebSocketManager class [constructor function](https://github.com/deepsourcelabs/nuxt-websocket/blob/docs/update-info/src/templates/WebSocketManager.ts#L14).

#### `ready(): Promise<void>`

Returns a promise that resolves straightaway if the websocket connection is open. Or else, waits until the open event is fired.

```js
await this.$socketManager.ready();
```

> Invoked by the [send](https://github.com/deepsourcelabs/nuxt-websocket/blob/docs/update-info/src/templates/WebSocketManager.ts#L52-L53) method.

#### `send (message: string | Record<string, unknown>): Promise<void>`

Waits for the websocket connection to be open if not already and transmits the data received.

```js
await this.$socketManager.send({ event: "socket", data: "Hello world" });
```

#### `close(code?: number | undefined, reason?: string | undefined): void`

Closes the WebSocket connection, optionally using code as the the WebSocket connection close code and reason as the the WebSocket connection close reason.

```js
this.$socketManager.close();
```

> The [onmessage](https://github.com/deepsourcelabs/nuxt-websocket/blob/main/src/templates/WebSocketManager.ts#L38-L45) handler expects data received from the server as either a string or an object of the shape `{ event: string, data: string }`.

```js
// Data received of the type string.
// Emits an event by the name `message`.
this.$socket.on("message", () => {});

// Data received as an object.
// Emits an event based on the value for the 'event' key.
// { event: "socket", data: "Hello world" }
this.$socket.on("socket", () => {});
```

## Development

1. Clone this repository.
2. Install dependencies using `yarn install`.
3. Start development server using `yarn dev`.

## License

[MIT License](https://github.com/deepsourcelabs/nuxt-websocket/blob/main/LICENSE)
