<template>
  <div>
    <p>
      {{ connectionStatus }}
    </p>
    <button :disabled="canCloseConnection" @click="openConnection">
      Connect to WS endpoint
    </button>

    <p v-if="msgSend && msgReceived">
      Data received: {{ msgReceived }}
    </p>

    <form>
      <label for="messageInput">Message:</label>
      <input id="messageInput" v-model="msgSend" type="text" name="msg">
    </form>

    <button @click="sendMessage">
      Send message
    </button>
    <button :disabled="canOpenConnection" @click="closeConnection">
      Close connection
    </button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      canOpenConnection: false,
      canCloseConnection: true,
      connectionStatus: '',
      msgSend: 'Hello world',
      msgReceived: ''
    }
  },
  mounted () {
    this.$socket.$on('socket', data => (this.msgReceived = data))
    this.connectionStatus = 'Connection established!'
  },
  beforeDestroy () {
    this.$socket.$off('socket')
  },
  methods: {
    openConnection () {
      this.$socketManager.connect()
      this.connectionStatus = 'Connection established!'
      this.canOpenConnection = false
      this.canCloseConnection = true
    },
    closeConnection () {
      this.$socketManager.ws.close()
      this.connectionStatus = 'Connection closed!'
      this.canCloseConnection = false
      this.canOpenConnection = true
    },
    sendMessage () {
      this.$socketManager.send({ event: 'socket', data: this.msgSend })
      this.connectionStatus = 'Connection established!'
      this.canOpenConnection = false
      this.canCloseConnection = true
    }
  }
}
</script>
