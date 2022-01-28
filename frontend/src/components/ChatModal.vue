<template>
  <b-modal title="Support chat" id="supportChatModal" @hidden="closeModal"  size="lg" :no-close-on-backdrop="true">
    <template #default >
      <div class="chat-window">
        <div v-for="message in chat" :key="message._id"
             :class="message.username === $store.getters['user/user'].username ? 'chat-message-right' : 'chat-message-left'">
          <span class="message">{{ message.message }}</span>
          <span class="time-sent">{{ formatDate(message.timeSent) }}</span>
        </div>
      </div>
    </template>
    <template #modal-footer>
      <div class="flex-grow-1">
        <b-input v-model="message" placeholder="Enter message..."></b-input>
      </div>
      <div>
        <b-button @click="sendMessage" variant="primary">Send</b-button>
      </div>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { generateId, api } from '@/helper'
import store from '@/store'
import { Message } from '@/api/api'
import dayjs from 'dayjs'
export default Vue.extend({
  name: 'ChatModal',
  props: {
    chatHistory: Array,
    id: String
  },
  data () {
    return {
      chat: [...this.chatHistory] as Message[],
      message: ''
    }
  },
  sockets: {
    updated_messages (message) {
      this.$data.chat.push(message)
    }
  },
  methods: {
    formatDate (date : string) {
      return dayjs(date).format('D/MM @ H:mm')
    },
    sendMessage () {
      const newMessage = {
        _id: generateId(),
        message: this.message,
        username: store.getters['user/user'].username,
        timeSent: new Date().toUTCString()
      } as Message
      this.chat.push(newMessage)
      this.$socket.client.emit('send_message', newMessage)
      this.message = ''
    },
    async closeModal () {
      await api.bookRequest.bookRequestUpdate(this.id, { chatHistory: this.chat })
      this.$socket.client.disconnect()
    }
  }
})
</script>
