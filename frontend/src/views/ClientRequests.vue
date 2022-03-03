<template>
  <div>
    <h1 class="font-color-black">My Requests</h1>
    <b-button id="Create-Request" class="mt-2 mb-2 ml-auto" variant="primary" v-b-modal.createModal>Create</b-button>
    <b-table responsive striped hover :items="filteredList" :fields="requestTableHeaders" :current-page="offset" :per-page="0" show-empty empty-text="You have no requests, why not make one!">
      <template #head(bookName)="head">
        {{ head.label }}
        <b-input id="Book-Name-Filter" v-model="filters.bookName" size="sm" class="mt-2" placeholder="Book Name..."></b-input>
      </template>
      <template #head(author)="head">
        {{ head.label }}
        <b-input id="Author-Filter" v-model="filters.author" size="sm" class="mt-2" placeholder="Author..."></b-input>
      </template>
      <template #head(isbn)="head">
        {{ head.label }}
        <b-input id="ISBN-Filter" v-model="filters.isbn" size="sm" class="mt-2" placeholder="ISBN..."></b-input>
      </template>
      <template #head(bookType)="head">
        {{ head.label }}
        <b-select id="Book-Type-Filter" :options="bookTypes" v-model="filters.bookType" size="sm" class="mt-2"></b-select>
      </template>
      <template #head(status)="head">
        {{ head.label }}
        <b-select id="Status-Filter" :options="statuses" v-model="filters.status" size="sm" class="mt-2"></b-select>
      </template>
      <template #cell(requesteddatetime)="cell">
        {{formatDate(cell.item.requestedDateTime)}}
      </template>
      <template #cell(status)="cell">
        {{cell.item.status}}
      </template>
      <template #cell(actions)="row">
        <div class="d-flex flex-column">
          <b-link id="Support-Chat" class="mb-2" v-b-modal.supportChatModal @click="startChat(row)">Support Chat</b-link>
          <b-link id="Edit-Request" class="mb-2" v-b-modal.editModal @click="selectedRequest = row.item" v-if="row.item.status === 'Pending Review' || row.item.status === 'Additional Information Required'">Edit</b-link>
          <b-link id="Delete-Request" class="mb-2" @click="deleteRequest(row.item._id)" v-if="row.item.status === 'Pending Review'">Delete</b-link>
          <b-link id="Status-History" class="mb-2" @click="showStatusHistory(row)">Status History <b-icon :icon="row.detailsShowing ? 'chevron-up' : 'chevron-down'" /></b-link>
        </div>
      </template>
      <template #row-details>
        <status-timeline v-if="selectedRequest" :selected-request="selectedRequest" @AdditionalInformationSupplied="getTableItems"/>
      </template>
    </b-table>
    <div class="d-flex justify-content-between align-items-baseline">
      <span class="input-group w-auto align-items-baseline">
        <span class="input-group-append mr-2">Per Page: </span>
        <b-form-select id="Pagination-Per-Page" v-model="limit" :options="[5, 10, 15]" class="custom-select custom-select-sm" @change="getTableItems" />
      </span>
      <b-pagination id="Pagination-Bar" :per-page="limit" :total-rows="totalCount" v-model="offset" @input="getTableItems"></b-pagination>
      <span id="Pagination-Details">{{totalCount}} requests in {{Math.ceil(totalCount / limit)}} pages</span>
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
import { api, BookType, Status, bookTypes, statuses, formatDate } from '@/helper'
import { BRow } from 'bootstrap-vue'
import ChatModal from '@/components/ChatModal.vue'

export default Vue.extend({
  name: 'bookRequests',
  components: { ChatModal, StatusTimeline, CreateRequestModal, EditRequestModal },
  data () {
    return {
      requests: [] as Request[], // The requests the client has made.
      selectedRequest: null as Request | null, // The currently selected request.
      filters: {
        bookName: '', // Filters the table by the book name.
        author: '', // Filters the table by the author name.
        isbn: '', // Filters the table by the books ISBN.
        bookType: '' as BookType, // Filters the table by the book type.
        status: '' as Status // Filters the table by the books status.
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
    requestTableHeaders () {
      return [{ key: 'bookName', sortable: true },
        { key: 'author', sortable: true },
        { key: 'isbn', sortable: true },
        { key: 'bookType', sortable: true },
        { key: 'requestedDateTime', sortable: true },
        { key: 'status', sortable: true },
        { key: 'Actions', sortable: false }]
    },
    /**
     * The available book types.
     */
    bookTypes () {
      return ['', ...bookTypes]
    },
    /**
     * The available statuses.
     */
    statuses () {
      return ['', ...statuses]
    },
    /**
     * Applies any filters and updates the table.
     */
    filteredList () {
      return this.$data.requests.filter((request : Request) =>
        request.bookName.includes(this.filters.bookName) &&
        request.author.includes(this.filters.author) &&
        request.bookType.includes(this.filters.bookType) &&
        request.status!.includes(this.filters.status) &&
        request.isbn?.includes(this.filters.isbn)
      )
    }
  },
  methods: {
    /**
     * The format price method from helper.ts
     */
    formatDate,
    /**
     * Gets the items which are to be displayed in the table.
     */
    async getTableItems () {
      // Makes an API call to get the request filtering by the requests the user has created and pagination filter.
      api.bookRequest.bookRequestList({ requestedBy: this.$store.getters['user/user'].id, limit: this.limit.toString(), offset: (this.offset - 1).toString() })
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
    },
    /**
     * Toggle the row details to show the status history.
     */
    showStatusHistory (row : BRow) {
      // Sets the selected request.
      this.selectedRequest = row.item

      // Displays the row details which contains the status history.
      row.toggleDetails()
    },
    /**
     * Delete the request.
     */
    async deleteRequest (id : string) {
      // Make an API call to delete the request.
      await api.bookRequest.bookRequestDelete(id)

      // Update the table items.
      await this.getTableItems()
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
