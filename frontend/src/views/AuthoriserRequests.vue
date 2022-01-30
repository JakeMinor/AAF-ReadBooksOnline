<template>
  <div>
    <h1 class="font-color-black">Authorise Requests</h1>
    <b-table responsive striped hover :items="requests" :fields="tableHeaders" :current-page="offset" :per-page="0" show-empty empty-text="No Request to Authorise.">
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
    <div class="d-flex justify-content-between align-items-baseline">
      <span class="input-group w-auto align-items-baseline">
        <span class="input-group-append mr-2">Per Page: </span>
        <b-form-select v-model="limit" :options="[5, 10, 15]" class="custom-select custom-select-sm"
                       @change="getTableItems" />
      </span>
      <b-pagination :per-page="limit" :total-rows="totalCount" v-model="offset" @input="getTableItems"></b-pagination>
      <span>{{ totalCount }} requests in {{ Math.ceil(totalCount / limit) }} pages</span>
    </div>
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
      requests: [] as Request[],
      selectedRequest: null as Request | null,
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
        { key: 'price', sortable: true },
        { key: 'Actions', sortable: false }]
    }
  },
  methods: {
    formatPrice,
    formatDate,
    async getTableItems () {
      const data = api.bookRequest.bookRequestList({ status: 'Awaiting Approval', limit: this.limit.toString(), offset: (this.offset - 1).toString() })
        .then((res) => {
          this.requests = res.data.requests
          this.totalCount = res.data.count
        })
        .catch(error => {
          this.$bvToast.toast(error.message, {
            title: 'Error',
            variant: 'danger',
            solid: true
          })
        })
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
