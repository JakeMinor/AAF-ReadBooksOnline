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
        <b-input id="Message" v-model="message" placeholder="Enter message..." @keypress.enter="sendMessage"></b-input>
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
    chatHistory: Array, // The history of the selected chat.
    id: String // The Room ID (Request ID).
  },
  data () {
    return {
      chat: [...this.chatHistory] as Message[], // The pre-existing chat.
      message: '' // The message which is to be sent.
    }
  },
  sockets: {
    // Updates the messages when the other user sends a message.
    updated_messages (message) {
      this.$data.chat.push(message)
    }
  },
  methods: {
    /**
     * Formats the message sent date.
     * @param date - The sent date for the message.
     */
    formatDate (date : string) {
      return dayjs(date).format('D/MM @ H:mm')
    },
    /**
     * Sends a message.
     */
    sendMessage () {
      // Format the message data.
      const newMessage = {
        _id: generateId(),
        message: this.message,
        username: store.getters['user/user'].username,
        timeSent: new Date().toUTCString()
      } as Message

      // Add the message to the local message list.
      this.chat.push(newMessage)

      // Trigger the send_message method on the connected socket.
      this.$socket.client.emit('send_message', newMessage)

      // Reset the message.
      this.message = ''
    },
    /**
     * Closes the modal.
     */
    async closeModal () {
      // Send the new chat history to be saved in the database.
      await api.bookRequest.bookRequestUpdate(this.id, { chatHistory: this.chat }).catch(error => {
        // Catch any errors and display a toast informing the user.
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })

      // Closes the connection to the socket.
      this.$socket.client.disconnect()
    }
  }
})
</script>
