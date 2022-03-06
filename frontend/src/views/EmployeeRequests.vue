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
        <b-input v-model="filters.author" size="sm" class="mt-2" placeholder="Author..."></b-input>
      </template>
      <template #head(isbn)="head">
        {{ head.label }}
        <b-input v-model="filters.isbn" size="sm" class="mt-2" placeholder="ISBN..."></b-input>
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
      page: 'Unallocated Requests' as pages, // Sets the table to display unallocated requests.
      pages: ['Unallocated Requests', 'My Requests'] as pages[], // The different displays for the table.
      requests: [] as Request[], // The requests the client has made.
      selectedRequest: null as Request | null, // The currently selected request.
      filters: {
        bookName: '', // Filters the table by the book name.
        author: '', // Filters the table by the author name.
        bookType: '', // Filters the table by the book type.
        isbn: '' // Filters the table by the books ISBN.
      },
      totalCount: 0, // The total count of the requests displayed in the table.
      offset: 1, // The tables current page.
      limit: 10 // The amount of items to be shown on the table.
    }
  },
  computed: {
    /**
     * The headings for the table and if they are sortable fields.
     */
    tableHeaders () {
      return [{ key: 'bookName', sortable: true },
        { key: 'author', sortable: true },
        { key: 'isbn', sortable: true },
        { key: 'bookType', sortable: true },
        { key: 'requestedDateTime', sortable: true },
        { key: 'Actions', sortable: false }]
    },
    /**
     * The available book types.
     */
    bookTypes () {
      return ['', ...bookTypes]
    },
    /**
     * Applies any filters and updates the table.
     */
    filteredList () {
      return this.$data.requests.filter((request : Request) =>
        request.bookName.includes(this.filters.bookName) &&
        request.author.includes(this.filters.author) &&
        request.bookType.includes(this.filters.bookType) &&
        (request.isbn?.includes(this.filters.isbn) || '')
      )
    }
  },
  methods: {
    /**
     * The format date method from helper.ts
     */
    formatDate,
    /**
     * Gets the items which are to be displayed in the table.
     */
    async getTableItems () {
      // Displays unallocated requests if the table display is 'Unallocated Requests'
      if (this.page === 'Unallocated Requests') {
        // Makes an API call to get the request filtering by the Pending Review status and pagination filter.
        api.bookRequest.bookRequestList({ status: 'Pending Review', limit: this.limit.toString(), offset: (this.offset - 1).toString() })
          .then((res) => {
            // Sets the returned requests and count
            this.requests = res.data.requests
            this.totalCount = res.data.count
          })
          .catch(error => {
            // Catch any errors and display a toast informing the user.
            this.$bvToast.toast(error.message, {
              title: 'Error',
              variant: 'danger',
              solid: true
            })
          })
      } else {
        // Makes an API call to get requests which are assigned to the employee and where the status is In Review.
        api.bookRequest.bookRequestList({ assignedTo: this.$store.getters['user/user'].id, status: 'In Review', limit: this.limit.toString(), offset: (this.offset - 1).toString() })
          .then((res) => {
            // Sets the returned requests and count
            this.requests = res.data.requests
            this.totalCount = res.data.count
          })
          .catch(error => {
            // Catch any errors and display a toast informing the user.
            this.$bvToast.toast(error.message, {
              title: 'Error',
              variant: 'danger',
              solid: true
            })
          })
      }
    },
    /**
     * Allocates a request to an employee.
     * @param requestId - The ID of the request which is to be allocated.
     */
    async allocate (requestId : string) {
      // Format the request data.
      const userToAllocate = {
        assignedTo: this.$store.getters['user/user'].id,
        status: 'In Review'
      } as UpdateRequest

      // Send the data to the api.
      await api.bookRequest.bookRequestUpdate(requestId, userToAllocate)

      // Update the table items.
      await this.getTableItems()
    },
    /**
     * Toggle the row details to show the status history.
     */
    showStatusHistory (row: BRow) {
      // Sets the selected request.
      this.selectedRequest = row.item

      // Displays the row details which contains the status history.
      row.toggleDetails()
    },
    /**
     * Closes the modal.
     */
    async modalClose () {
      // Resets the selected request.
      this.selectedRequest = null

      // Update the table items.
      await this.getTableItems()
    },
    /**
     * Connects to chat room for a request.
     */
    startChat (row : BRow) {
      // Updates the selected request.
      this.selectedRequest = row.item

      // Connects to the client socket.
      this.$socket.client.connect()

      // Joins the request chat based on the request ID, this stops any unauthorised users from joining the chat.
      this.$socket.client.emit('join_request_chat', this.selectedRequest!._id!)
    }
  },
  /**
   * Created hook which gets the table items.
   */
  async created () {
    await this.getTableItems()
  }
})
</script>
