<template>
  <div>
    <h1 class="font-color-black">My Requests</h1>
    <b-button class="mt-2 mb-2 ml-auto" variant="primary" v-b-modal.createModal>Create</b-button>
    <b-table responsive striped hover :items="requests" :fields="requestTableHeaders" show-empty empty-text="You have no requests, why not make one!">
      <template #cell(requesteddatetime)="cell">
        {{formatDate(cell.item.requestedDateTime)}}
      </template>
      <template #cell(status)="cell">
        {{cell.item.status}}
      </template>
      <template #cell(actions)="row">
        <div class="d-flex flex-column">
          <b-link class="mb-2" v-b-modal.editModal @click="selectedRequest = row.item" v-if="row.item.status === 'Pending Review' || row.item.status === 'Additional Information Required'">Edit</b-link>
          <b-link class="mb-2" @click="deleteRequest(row.item._id)" v-if="row.item.status === 'Pending Review'">Delete</b-link>
          <b-link class="mb-2" @click="showStatusHistory(row)">Status History <b-icon :icon="row.detailsShowing ? 'chevron-up' : 'chevron-down'" /></b-link>
        </div>
      </template>
      <template #row-details>
        <status-timeline v-if="selectedRequest" :selected-request="selectedRequest" @AdditionalInformationSupplied="getTableItems"/>
      </template>
    </b-table>
    <create-request-modal @Created="modalClose"/>
    <edit-request-modal @Updated="modalClose" @Closed="selectedRequest = null" :selected-request="selectedRequest" v-if="selectedRequest"/>
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
    }
  },
  async created () {
    await this.getTableItems()
  }
})
</script>
