<template>
  <div>
    <h1 class="font-color-black">My Requests</h1>
    <b-button class="mt-2 mb-2 ml-auto" variant="primary" v-b-modal.createModal>Create</b-button>
    <b-table responsive striped hover :items="requests" :fields="requestTableHeaders">
      <template #cell(requesteddatetime)="cell">
        {{formatDate(cell.item.requestedDateTime)}}
      </template>
      <template #cell(status)="cell">
        {{cell.item.status}}
      </template>
      <template #cell(actions)="row">
        <div class="d-flex flex-column">
          <b-link class="mb-2" v-b-modal.editModal @click="selectedRequest = row.item">Edit</b-link>
          <b-link class="mb-2" @click="deleteRequest(row.item._id)">Delete</b-link>
          <b-link class="mb-2" @click="showStatusHistory(row)">Progress <b-icon-chevron-down/></b-link>
        </div>
      </template>
      <template #row-details>
        <status-timeline :status-history="selectedRequest.statusHistory"/>
      </template>
    </b-table>
    <create-request-modal @Created="getTableItems"/>
    <edit-request-modal @Updated="getTableItems" :selected-request="selectedRequest" v-if="selectedRequest"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Request } from '@/api/api'
import StatusTimeline from '@/components/BookRequests/StatusTimeline.vue'
import CreateRequestModal from '@/components/BookRequests/CreateRequestModal.vue'
import EditRequestModal from '@/components/BookRequests/EditRequestModal.vue'
import { api, formatDate } from '@/helper'
import { BRow } from 'bootstrap-vue'

export default Vue.extend({
  name: 'bookRequests',
  components: { StatusTimeline, CreateRequestModal, EditRequestModal },
  data () {
    return {
      requests: [] as Request[],
      selectedRequest: null as Request | null
    }
  },
  computed: {
    requestTableHeaders () {
      return ['bookName', 'author', 'isbn', 'bookType', 'requestedDateTime', 'status', 'Actions']
    },
    bookTypes () {
      return ['Book', 'Audiobook']
    }
  },
  methods: {
    formatDate,
    async getTableItems () {
      this.requests = (await api.bookRequest.bookRequestList({ requestedBy: this.$store.getters['user/user'].id })).data
    },
    async showStatusHistory (row : BRow) {
      row.toggleDetails()
      row.detailsShowing ? this.selectedRequest = null : this.selectedRequest = row.item
    },
    async deleteRequest (id : string) {
      await api.bookRequest.bookRequestDelete(id)
      await this.getTableItems()
    }
  },
  async created () {
    await this.getTableItems()
  }
})
</script>
