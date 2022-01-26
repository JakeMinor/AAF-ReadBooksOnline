<template>
  <div>
    <h1 class="font-color-black">{{ page }}</h1>
    <b-form-group>
      <b-form-radio-group buttons button-variant="outline-primary" v-model="page" :options="pages" @change="getTableItems"/>
    </b-form-group>
    <b-table responsive striped hover :items="tableItems" :fields="tableHeaders" show-empty :empty-text="page === 'Unallocated Requests' ? 'No requests to allocate.' : 'You have no requests allocated to you.'">
      <template #cell(requesteddatetime)="cell">
        {{ formatDate(cell.item.requestedDateTime) }}
      </template>
      <template #cell(status)="cell">
        {{ cell.item.status }}
      </template>
      <template #cell(actions)="row">
        <div class="d-flex flex-column">
          <b-link class="pb-2" v-if="page === 'Unallocated Requests'" @click="allocate(row.item._id)">Allocate</b-link>
          <b-link class="pb-2" v-if="page === 'My Requests'" v-b-modal.completeRequestModal @click="selectedRequest = row.item">Complete Request</b-link>
          <b-link class="pb-2" v-if="page === 'My Requests'" v-b-modal.moreInformationModal @click="selectedRequest = row.item">Ask for more information</b-link>
          <b-link class="mb-2" @click="showStatusHistory(row)">Status History <b-icon :icon="row.detailsShowing ? 'chevron-up' : 'chevron-down'" /></b-link>
        </div>
      </template>
      <template #row-details>
        <status-timeline v-if="selectedRequest" :selected-request="selectedRequest" @AdditionalInformationSupplied="getTableItems" />
      </template>
    </b-table>
    <request-more-information-modal v-if="selectedRequest" :request-id="selectedRequest.id" @MoreInformationRequested="modalClose" @closed="selectedRequest = null"/>
    <complete-request-modal v-if="selectedRequest" :selected-request="selectedRequest" @Completed="modalClose" @Closed="selectedRequest = null"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Request, UpdateRequest } from '@/api/api'
import { api, formatDate, bookTypes } from '@/helper'
import { BRow } from 'bootstrap-vue'
import StatusTimeline from '@/components/StatusTimeline.vue'
import RequestMoreInformationModal from '@/components/EmployeeRequests/RequestMoreInformationModal.vue'
import CompleteRequestModal from '@/components/EmployeeRequests/CompleteRequestModal.vue'
type pages = 'Unallocated Requests' | 'My Requests'

export default Vue.extend({
  name: 'EmployeeRequests',
  components: {
    RequestMoreInformationModal,
    CompleteRequestModal,
    StatusTimeline
  },
  data () {
    return {
      page: 'Unallocated Requests' as pages,
      pages: ['Unallocated Requests', 'My Requests'] as pages[],
      tableItems: [] as Request[],
      selectedRequest: null as Request | null
    }
  },
  computed: {
    tableHeaders () {
      return ['bookName', 'author', 'isbn', 'bookType', 'requestedDateTime', 'Actions']
    },
    bookTypes () {
      return bookTypes
    }
  },
  methods: {
    formatDate,
    async getTableItems () {
      if (this.page === 'Unallocated Requests') {
        this.tableItems = (await api.bookRequest.bookRequestList({ status: 'Pending Review' })).data
      } else {
        this.tableItems = (await api.bookRequest.bookRequestList({ assignedTo: this.$store.getters['user/user'].id, status: 'In Review' })).data
      }
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
    }
  },
  async created () {
    await this.getTableItems()
  }
})
</script>
