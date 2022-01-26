<template>
  <div>
    <h1 class="font-color-black">Authorise Requests</h1>
    <b-table responsive striped hover :items="tableItems" :fields="tableHeaders" show-empty empty-text="No Request to Authorise.">
      <template #cell(requesteddatetime)="cell">
        {{ formatDate(cell.item.requestedDateTime) }}
      </template>
      <template #cell(price)="cell">
        {{ formatPrice(cell.item.price) }}
      </template>
      <template #cell(actions)="row">
        <div class="d-flex flex-column">
          <b-link class="mb-2" @click="authorise(true, row.item._id)">Approve</b-link>
          <b-link class="mb-2" @click="authorise(false, row.item._id)">Deny</b-link>
          <b-link class="mb-2" @click="showStatusHistory(row)">Status History <b-icon :icon="row.detailsShowing ? 'chevron-up' : 'chevron-down'" /></b-link>
        </div>
      </template>
      <template #row-details>
        <status-timeline v-if="selectedRequest" :selected-request="selectedRequest" />
      </template>
    </b-table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Request, UpdateRequest } from '@/api/api'
import { api, formatDate, formatPrice } from '@/helper'
import StatusTimeline from '@/components/StatusTimeline.vue'
import { BRow } from 'bootstrap-vue'
export default Vue.extend({
  name: 'AuthoriserRequests',
  components: { StatusTimeline },
  data () {
    return {
      tableItems: [] as Request[],
      selectedRequest: null as Request | null
    }
  },
  computed: {
    tableHeaders () {
      return ['bookName', 'author', 'isbn', 'bookType', 'requestedDateTime', 'price', 'Actions']
    }
  },
  methods: {
    formatPrice,
    formatDate,
    async getTableItems () {
      this.tableItems = (await api.bookRequest.bookRequestList({ status: 'Awaiting Approval' })).data
    },
    async authorise (state : boolean, requestId : string) {
      const updatedRequest = {
        authorised: state,
        status: state ? 'Purchased' : 'Denied'
      } as UpdateRequest

      await api.bookRequest.bookRequestUpdate(requestId, updatedRequest)
      await this.getTableItems()
    },
    showStatusHistory (row: BRow) {
      this.selectedRequest = row.item
      row.toggleDetails()
    }
  },
  async created () {
    await this.getTableItems()
  }
})
</script>
