<template>
  <div>
    <div v-for="message in messages" :key="message">
      {{ message.message }}
      Sent By {{ message.user }}
      at {{ formatDate(message.sentTime) }}
    </div>
    <b-input v-model="message"></b-input>
    <b-button @click="sendMessage">Send</b-button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '../store/index'
import { formatDate } from '@/helper'
export default Vue.extend({
  name: 'chat',
  data () {
    return {
      messages: [] as any[],
      message: ''
    }
  },
  sockets: {
    updated_messages (message) {
      this.$data.messages.push(message)
    }
  },
  methods: {
    formatDate,
    sendMessage () {
      const newMessage = {
        message: this.message,
        user: store.getters['user/user'].username,
        sentTime: new Date().toUTCString()
      }
      this.messages.push(newMessage)
      this.$socket.client.emit('send_message', newMessage)
      this.message = ''
    }
  },

  // beforeUnmount() {
  //   this.$socket.client.disconnect()
  //   // SEND API CALL TO SAVE MESSAGES WITH REQUESTID AND MESSAGES ARRAY
  // }
  created () {
    this.$socket.client.connect()
    this.$socket.client.emit('join_request_chat', 'urmum')
    // SEND API CALL WITH REQUEST ID TO GET CHAT HISTORY AND PUSH TO ARRAY
  }
})
</script>
