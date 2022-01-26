<template>
  <div>
    <h1 class="font-color-black">{{ page }}</h1>
    <b-form-group>
      <b-form-radio-group buttons button-variant="outline-primary" v-model="page" :options="pages" @change="getTableItems"/>
    </b-form-group>
    <b-table responsive striped hover :items="requests" :fields="tableHeaders" :current-page="offset" :per-page="0" show-empty :empty-text="page === 'Unallocated Requests' ? 'No requests to allocate.' : 'You have no requests allocated to you.'">
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Request, Requests, UpdateRequest } from '@/api/api'
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
      requests: [] as Request[],
      selectedRequest: null as Request | null,
      totalCount: 0,
      offset: 1,
      limit: 10
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
    }
  },
  async created () {
    await this.getTableItems()
  }
})
</script>
