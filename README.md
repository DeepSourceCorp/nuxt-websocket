<div align="center">
<br>
<br>
  
  <h1>@deepsource/nuxt-websocket</h1>

[![DeepSource](https://deepsource.io/gh/deepsourcelabs/nuxt-websocket.svg/?label=active+issues&show_trend=true&token=aDA1Tz2a_4FxFsxvu4by_loF)](https://deepsource.io/gh/deepsourcelabs/nuxt-websocket/?ref=repository-badge) [![DeepSource](https://deepsource.io/gh/deepsourcelabs/nuxt-websocket.svg/?label=resolved+issues&show_trend=true&token=aDA1Tz2a_4FxFsxvu4by_loF)](https://deepsource.io/gh/deepsourcelabs/nuxt-websocket/?ref=repository-badge)

  <p>A tiny Nuxt.js module for WebSocket interactions.</p>

</div>

> This module is only compatible with Nuxt v2 at the moment.

## Setup

1. Add `@deepsource/nuxt-websocket` dependency to your project.

```bash
yarn add @deepsource/nuxt-websocket # or npm install @deepsource/nuxt-websocket
```

2. Add `@deepsource/nuxt-websocket` to the `modules` section of `nuxt.config.js`.

```js
{
  modules: [
    '@deepsource/nuxt-websocket',
  ],
  websocket: {
    // module options
  }
}
```

### TypeScript

Add the types to your `types` array in `tsconfig.json` after the `@nuxt/types` (Nuxt 2.9.0+) entry.

```json
{
  "compilerOptions": {
    "types": ["@nuxt/types", "@deepsource/nuxt-websocket"]
  }
}
```

## Options

You can pass different options using the `websocket` property in your `nuxt.config.js`.

```js
// nuxt.config.js
export default {
  websocket: {
    url: 'wss://echo.websocket.events/'
    reconnectInterval: 1000
  }
};
```

| Parameter           | Default | Description                                                                                                    |
| ------------------- | ------- | -------------------------------------------------------------------------------------------------------------- |
| `url`               | -       | WebSocket URL to connect                                                                                       |
| `reconnectInterval` | 1000    | The time interval after which a reconnection attempt takes place for a close event. It should be less than 3s. |

### Runtime Config

You can also provide the URL via [runtime config](https://nuxtjs.org/docs/configuration-glossary/configuration-runtime-config/). It always takes precedence over the URL provided via options.

```js
// nuxt.config.js
export default {
  // Via Runtime config
  publicRuntimeConfig: {
    websocket: {
      url: process.env.WEBSOCKET_URL
    }
  }
};
```

## API

The following two plugins are injected into the Vue instance and are accessible across the app:-

- `$socket` - [Vue](https://v2.vuejs.org/v2/api/#Instance-Methods-Events) instance.
- `$socketManager` - [WebSocketManager](https://github.com/deepsourcelabs/nuxt-websocket/blob/docs/update-info/src/templates/WebSocketManager.ts) instance.

### `$socket`

It's a Vue instance that's used as an event bus.

```js
mounted() {
  this.$socket.$on('socket', (data) => {
    console.log(`got ${data} from WebSocket`);
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

Establishes WebSocket connection. It defines handlers for message, close and error events.

```js
this.$socketManager.connect();
```

> Invoked by the WebSocketManager class [constructor function](https://github.com/deepsourcelabs/nuxt-websocket/blob/docs/update-info/src/templates/WebSocketManager.ts#L14).

#### `ready(): Promise<void>`

Returns a promise that resolves straightaway if the WebSocket connection is open. Or else, waits until the open event is fired.

```js
await this.$socketManager.ready();
```

> Invoked by the [send](https://github.com/deepsourcelabs/nuxt-websocket/blob/docs/update-info/src/templates/WebSocketManager.ts#L52-L53) method.

#### `send (message: string | Record<string, unknown>): Promise<void>`

Waits for the WebSocket connection to be open if not already and transmits the data received.

```js
await this.$socketManager.send({ event: "socket", data: "Hello world" });
```

#### `close(code?: number | undefined, reason?: string | undefined): void`

Closes the WebSocket connection, optionally using code as the the WebSocket connection close code and reason as the the WebSocket connection close reason.

```js
this.$socketManager.close();
```

> The [message event handler](https://github.com/deepsourcelabs/nuxt-websocket/blob/main/src/templates/WebSocketManager.ts#L39-L46) expects data received from the server as either a string or an object of the shape `{ event: string, data: string }`.

```js
// Data received of the type string.
// Emits an event by the name `message`.
this.$socket.on("message", () => {});

// Data received as an object.
// Emits an event based on the value for the 'event' key.
// { event: "socket", data: "Hello world" }
this.$socket.on("socket", () => {});
```

> The [close event handler](https://github.com/deepsourcelabs/nuxt-websocket/blob/main/src/templates/WebSocketManager.ts#L48-L64) attempts reconnection for a close event that is not normal ([connection close code](https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code) other than 1000).

## Development

1. Clone this repository.
2. Install dependencies using `yarn install`.
3. Start development server using `yarn dev`.

## License

[MIT License](https://github.com/deepsourcelabs/nuxt-websocket/blob/main/LICENSE)
