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
      <p class="font-bold">{{ connectionStatusText }}</p>
    </div>

    <button
      :disabled="canCloseConnection"
      class="btn btn-green"
      :class="{ 'cursor-not-allowed opacity-50': canCloseConnection }"
      @click="openConnection"
    >
      Open connection
    </button>

    <form class="border p-4 space-y-2">
      <div class="inline-flex items-center w-full space-x-2">
        <div class="w-44">
          <label
            class="block text-gray-500 font-bold mb-1 pr-4"
            for="msgReceived"
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
          />
        </div>
      </div>
      <div class="inline-flex items-center w-full space-x-2">
        <div class="w-44">
          <label class="block text-gray-500 font-bold mb-1 pr-4" for="msgSend">
            Message send:
          </label>
        </div>

        <div class="flex-grow">
          <input
            id="messageSend"
            v-model="msgSend"
            type="text"
            class="w-48 bg-transparent appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
          />
        </div>
      </div>
    </form>

    <div class="space-x-2">
      <button class="btn btn-blue" @click="sendMessage">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      canOpenConnection: false,
      canCloseConnection: true,
      connectionStatus: "",
      msgSend: "Hello world",
      msgReceived: ""
    };
  },
  mounted() {
    this.$socket.$on("socket", data => (this.msgReceived = data));
    this.connectionStatus = "open";
  },
  beforeDestroy() {
    this.$socket.$off("socket");
  },
  methods: {
    openConnection() {
      this.$socketManager.connect();
      this.connectionStatus = "open";
      this.canOpenConnection = false;
      this.canCloseConnection = true;
    },
    closeConnection() {
      this.$socketManager.ws.close();
      this.connectionStatus = "closed";
      this.canCloseConnection = false;
      this.canOpenConnection = true;
    },
    sendMessage() {
      this.$socketManager.send({ event: "socket", data: this.msgSend });
      this.connectionStatus = "open";
      this.canOpenConnection = false;
      this.canCloseConnection = true;
    }
  },
  computed: {
    connectionStatusText() {
      const statusMap = {
        open: "Connection established!",
        closed: "Connection closed!"
      };
      return statusMap[this.connectionStatus];
    }
  }
};
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
