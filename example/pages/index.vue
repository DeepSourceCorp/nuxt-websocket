<template>
  <div
    class="w-1/2 rounded overflow-hidden shadow-lg text-center p-4 mx-auto mt-8 space-y-4"
  >
    <div
      class="border-t border-b px-4 py-3"
      role="alert"
      :class="[
        connectionStatus === 'open'
          ? 'bg-green-100 border-green-500 text-green-700'
          : 'bg-red-100 border-red-500 text-red-700'
      ]"
    >
      <p class="font-bold">
        {{ connectionStatusText }}
      </p>
    </div>

    <form class="border p-4 space-y-4">
      <div class="inline-flex items-center w-full space-x-2">
        <div class="w-44">
          <label
            for="msgReceived"
            class="block text-gray-500 font-bold mb-1 pr-4"
          >
            Message received:
          </label>
        </div>

        <div class="flex-grow">
          <input
            id="messageReceived"
            :disabled="true"
            :value="msgReceived"
            type="text"
            class="bg-transparent appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 cursor-not-allowed"
          >
        </div>
      </div>

      <div class="inline-flex items-center w-full space-x-2">
        <div class="w-44">
          <label for="msgSend" class="block text-gray-500 font-bold mb-1 pr-4">
            Message send:
          </label>
        </div>

        <div class="flex-grow">
          <input
            id="messageSend"
            v-model="msgSend"
            type="text"
            class="w-48 bg-transparent appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          >
        </div>
      </div>

      <div class="space-x-2">
        <button
          :disabled="canCloseConnection"
          class="btn btn-green"
          :class="{ 'cursor-not-allowed opacity-50': canCloseConnection }"
          @click="openConnection"
        >
          Open connection
        </button>
        <button
          :disabled="!msgSend"
          class="btn btn-blue"
          :class="{ 'cursor-not-allowed opacity-50': !msgSend }"
          @click.prevent="sendMessage"
        >
          Send message
        </button>
        <button
          :disabled="canOpenConnection"
          class="btn btn-red"
          :class="{ 'cursor-not-allowed opacity-50': canOpenConnection }"
          @click="closeConnection"
        >
          Close connection
        </button>
      </div>
    </form>
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
  computed: {
    connectionStatusText () {
      const statusMap = {
        open: 'Connection established!',
        closed: 'Connection closed!'
      }
      return statusMap[this.connectionStatus]
    }
  },
  mounted () {
    this.$socket.$on('socket', data => (this.msgReceived = data))
    this.connectionStatus = 'open'
  },
  beforeDestroy () {
    this.$socket.$off('socket')
  },
  methods: {
    openConnection () {
      this.$socketManager.connect()
      this.toggleProperties()
    },
    closeConnection () {
      this.$socketManager.close()
      this.toggleProperties(false)
      this.msgSend = ''
      this.msgReceived = ''
    },
    sendMessage () {
      this.$socketManager.send({ event: 'socket', data: this.msgSend })
      this.toggleProperties()
    },
    toggleProperties (isOpen = true) {
      this.connectionStatus = isOpen ? 'open' : 'closed'
      this.canOpenConnection = !isOpen
      this.canCloseConnection = isOpen
    }
  }
}
</script>

<style scoped>
.btn {
  @apply text-sm bg-transparent font-semibold py-2 px-4 border rounded;
}
.btn:hover {
  @apply text-white border-transparent;
}

.btn-blue {
  @apply text-blue-700 border-blue-500;
}
.btn-blue:hover {
  @apply bg-blue-500;
}

.btn-red {
  @apply text-red-700 border-red-500;
}
.btn-red:hover {
  @apply bg-red-500;
}

.btn-green {
  @apply text-green-700 border-green-500;
}
.btn-green:hover {
  @apply bg-green-500;
}
</style>
