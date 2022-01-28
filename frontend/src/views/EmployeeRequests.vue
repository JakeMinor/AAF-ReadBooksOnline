<template>
  <div>
    <h1 class="font-color-black">{{ page }}</h1>
    <b-form-group>
      <b-form-radio-group buttons button-variant="outline-primary" v-model="page" :options="pages" @change="getTableItems"/>
    </b-form-group>
    <b-table responsive striped hover :items="filteredList" :fields="tableHeaders" :current-page="offset" :per-page="0" show-empty :empty-text="page === 'Unallocated Requests' ? 'No requests to allocate.' : 'You have no requests allocated to you.'">
      <template #head(bookName)="head">
        {{head.label}}
        <b-input v-model="filters.bookName" size="sm" class="mt-2" placeholder="Book Name..."></b-input>
      </template>
      <template #head(author)="head">
        {{ head.label }}
        <b-input v-model="filters.bookName" size="sm" class="mt-2" placeholder="Author..."></b-input>
      </template>
      <template #head(isbn)="head">
        {{ head.label }}
        <b-input v-model="filters.bookName" size="sm" class="mt-2" placeholder="ISBN..."></b-input>
      </template>
      <template #head(bookType)="head">
        {{ head.label }}
        <b-select :options="bookTypes" v-model="filters.bookType" size="sm" class="mt-2"></b-select>
      </template>
      <template #cell(requesteddatetime)="cell">
        {{ formatDate(cell.item.requestedDateTime) }}
      </template>
      <template #cell(status)="cell">
        {{ cell.item.status }}
      </template>
      <template #cell(actions)="row">
        <div class="d-flex flex-column">
          <b-link class="pb-2" v-if="page === 'Unallocated Requests'" @click="allocate(row.item._id)">Allocate</b-link>
          <b-link class="pb-2" v-if="page === 'My Requests'" v-b-modal.supportChatModal @click="startChat(row)">Support Chat</b-link>
          <b-link class="pb-2" v-if="page === 'My Requests'" v-b-modal.completeRequestModal @click="selectedRequest = row.item">Complete Request</b-link>
          <b-link class="pb-2" v-if="page === 'My Requests'" v-b-modal.moreInformationModal @click="selectedRequest = row.item">Ask for more information</b-link>
          <b-link class="mb-2" @click="showStatusHistory(row)">Status History <b-icon :icon="row.detailsShowing ? 'chevron-up' : 'chevron-down'" /></b-link>
        </div>
      </template>
      <template #row-details>
        <status-timeline v-if="selectedRequest" :selected-request="selectedRequest" @AdditionalInformationSupplied="getTableItems" />
      </template>
    </b-table>
    <div class="d-flex justify-content-between align-items-baseline">
      <span class="input-group w-auto align-items-baseline">
        <span class="input-group-append mr-2">Per Page: </span>
        <b-form-select v-model="limit" :options="[5, 10, 15]" class="custom-select custom-select-sm"
                       @change="getTableItems" />
      </span>
      <b-pagination :per-page="limit" :total-rows="totalCount" v-model="offset" @input="getTableItems"></b-pagination>
      <span>{{ totalCount }} requests in {{ Math.ceil(totalCount / limit) }} pages</span>
    </div>
    <request-more-information-modal v-if="selectedRequest" :request-id="selectedRequest.id" @MoreInformationRequested="modalClose" @closed="selectedRequest = null"/>
    <complete-request-modal v-if="selectedRequest" :selected-request="selectedRequest" @Completed="modalClose" @Closed="selectedRequest = null"/>
    <chat-modal :chat-history="selectedRequest.chatHistory" :id="selectedRequest._id" v-if="selectedRequest"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Request, Requests, UpdateRequest } from '@/api/api'
import { api, formatDate, bookTypes, BookType } from '@/helper'
import { BRow } from 'bootstrap-vue'
import StatusTimeline from '@/components/StatusTimeline.vue'
import RequestMoreInformationModal from '@/components/EmployeeRequests/RequestMoreInformationModal.vue'
import CompleteRequestModal from '@/components/EmployeeRequests/CompleteRequestModal.vue'
import ChatModal from '@/components/ChatModal.vue'
type pages = 'Unallocated Requests' | 'My Requests'

export default Vue.extend({
  name: 'EmployeeRequests',
  components: {
    ChatModal,
    RequestMoreInformationModal,
    CompleteRequestModal,
    StatusTimeline
  },
  data () {
    return {
      page: 'Unallocated Requests' as pages,
      pages: ['Unallocated Requests', 'My Requests'] as pages[],
      requests: [] as Request[],
      selectedRequest: null as Request | null,
      filters: {
        bookName: '',
        author: '',
        isbn: '',
        bookType: ''
      },
      totalCount: 0,
      offset: 1,
      limit: 10
    }
  },
  computed: {
    tableHeaders () {
      return [{ key: 'bookName', sortable: true },
        { key: 'author', sortable: true },
        { key: 'isbn', sortable: true },
        { key: 'bookType', sortable: true },
        { key: 'requestedDateTime', sortable: true },
        { key: 'Actions', sortable: false }]
    },
    bookTypes () {
      return ['', ...bookTypes]
    },
    filteredList () {
      return this.$data.requests.filter((request : Request) =>
        request.bookName.includes(this.filters.bookName) &&
        request.author.includes(this.filters.author) &&
        request.isbn?.includes(this.filters.isbn) &&
        request.bookType.includes(this.filters.bookType)
      )
    }
  },
  methods: {
    formatDate,
    async getTableItems () {
      let data = {} as Requests
      if (this.page === 'Unallocated Requests') {
        data = (await api.bookRequest.bookRequestList({ status: 'Pending Review', limit: this.limit.toString(), offset: (this.offset - 1).toString() })).data
      } else {
        data = (await api.bookRequest.bookRequestList({ assignedTo: this.$store.getters['user/user'].id, status: 'In Review', limit: this.limit.toString(), offset: (this.offset - 1).toString() })).data
      }
      this.requests = data.requests
      this.totalCount = data.count
    },
    async allocate (requestId : string) {
      const userToAllocate = {
        assignedTo: this.$store.getters['user/user'].id,
        status: 'In Review'
      } as UpdateRequest
      await api.bookRequest.bookRequestUpdate(requestId, userToAllocate)
      await this.getTableItems()
    },
    showStatusHistory (row: BRow) {
      this.selectedRequest = row.item
      row.toggleDetails()
    },
    async modalClose () {
      this.selectedRequest = null
      await this.getTableItems()
    },
    startChat (row : BRow) {
      this.selectedRequest = row.item
      this.$socket.client.connect()
      this.$socket.client.emit('join_request_chat', this.selectedRequest!._id!)
    }
  },
  async created () {
    await this.getTableItems()
  }
})
</script>
