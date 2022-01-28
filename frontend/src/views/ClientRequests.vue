<template>
  <div>
    <h1 class="font-color-black">My Requests</h1>
    <b-button class="mt-2 mb-2 ml-auto" variant="primary" v-b-modal.createModal>Create</b-button>
    <b-table responsive striped hover :items="requests" :fields="requestTableHeaders" :current-page="offset" :per-page="0" show-empty empty-text="You have no requests, why not make one!">
      <template #cell(requesteddatetime)="cell">
        {{formatDate(cell.item.requestedDateTime)}}
      </template>
      <template #cell(status)="cell">
        {{cell.item.status}}
      </template>
      <template #cell(actions)="row">
        <div class="d-flex flex-column">
          <b-link class="mb-2" v-b-modal.supportChatModal @click="startChat(row)">Support Chat</b-link>
          <b-link class="mb-2" v-b-modal.editModal @click="selectedRequest = row.item" v-if="row.item.status === 'Pending Review' || row.item.status === 'Additional Information Required'">Edit</b-link>
          <b-link class="mb-2" @click="deleteRequest(row.item._id)" v-if="row.item.status === 'Pending Review'">Delete</b-link>
          <b-link class="mb-2" @click="showStatusHistory(row)">Status History <b-icon :icon="row.detailsShowing ? 'chevron-up' : 'chevron-down'" /></b-link>
        </div>
      </template>
      <template #row-details>
        <status-timeline v-if="selectedRequest" :selected-request="selectedRequest" @AdditionalInformationSupplied="getTableItems"/>
      </template>
    </b-table>
    <div class="d-flex justify-content-between align-items-baseline">
      <span class="input-group w-auto align-items-baseline">
        <span class="input-group-append mr-2">Per Page: </span>
        <b-form-select v-model="limit" :options="[5, 10, 15]" class="custom-select custom-select-sm" @change="getTableItems" />
      </span>
      <b-pagination :per-page="limit" :total-rows="totalCount" v-model="offset" @input="getTableItems"></b-pagination>
      <span>{{totalCount}} requests in {{Math.ceil(totalCount / limit)}} pages</span>
    </div>
    <create-request-modal @Created="modalClose"/>
    <edit-request-modal @Updated="modalClose" @Closed="selectedRequest = null" :selected-request="selectedRequest" v-if="selectedRequest"/>
    <chat-modal :chat-history="selectedRequest.chatHistory" :id="selectedRequest._id" v-if="selectedRequest" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Request } from '@/api/api'
import StatusTimeline from '@/components/StatusTimeline.vue'
import CreateRequestModal from '@/components/BookRequests/CreateRequestModal.vue'
import EditRequestModal from '@/components/BookRequests/EditRequestModal.vue'
import { api, formatDate } from '@/helper'
import { BRow } from 'bootstrap-vue'
import ChatModal from '@/components/ChatModal.vue'

export default Vue.extend({
  name: 'bookRequests',
  components: { ChatModal, StatusTimeline, CreateRequestModal, EditRequestModal },
  data () {
    return {
      requests: [] as Request[],
      selectedRequest: null as Request | null,
      totalCount: 0,
      offset: 1,
      limit: 10
    }
  },
  computed: {
    requestTableHeaders () {
      return [{ key: 'bookName', sortable: true },
        { key: 'author', sortable: true },
        { key: 'isbn', sortable: true },
        { key: 'bookType', sortable: true },
        { key: 'requestedDateTime', sortable: true },
        { key: 'status', sortable: true },
        { key: 'Actions', sortable: false }]
    },
    bookTypes () {
      return ['Book', 'Audiobook']
    }
  },
  methods: {
    formatDate,
    async getTableItems () {
      const data = (await api.bookRequest.bookRequestList({ requestedBy: this.$store.getters['user/user'].id, limit: this.limit.toString(), offset: (this.offset - 1).toString() })).data
      this.requests = data.requests
      this.totalCount = data.count
    },
    showStatusHistory (row : BRow) {
      this.selectedRequest = row.item
      row.toggleDetails()
    },
    async deleteRequest (id : string) {
      await api.bookRequest.bookRequestDelete(id)
      await this.getTableItems()
    },
    async modalClose () {
      this.selectedRequest = null
      await this.getTableItems()
    },
    startChat (row : BRow) {
      this.selectedRequest = row.item
      console.log(this.selectedRequest)
      this.$socket.client.connect()
      this.$socket.client.emit('join_request_chat', this.selectedRequest!._id!)
    }
  },
  async created () {
    await this.getTableItems()
  }
})
</script>
