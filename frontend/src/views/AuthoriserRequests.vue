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
          <b-link class="mb-2" @click="authorise(true, row)">Approve</b-link>
          <b-link class="mb-2" @click="authorise(false, row)">Deny</b-link>
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
      requests: [] as Request[], // The requests which are assigned to the authoriser.
      selectedRequest: null as Request | null, // The selected request.
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
        { key: 'price', sortable: true },
        { key: 'Actions', sortable: false }]
    }
  },
  methods: {
    /**
     * The format price method from helper.ts
     */
    formatPrice,
    /**
     * The format date method from helper.ts
     */
    formatDate,
    /**
     * Gets the items which are to be displayed in the table.
     */
    async getTableItems () {
      // Makes an API call to get the request filtering by the Awaiting Approval status and pagination filter.
      api.bookRequest.bookRequestList({ status: 'Awaiting Approval', limit: this.limit.toString(), offset: (this.offset - 1).toString() })
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
     * Updates the requested to be Purchased or Denied.
     */
    async authorise (state : boolean, row : BRow) {
      // Format the request data.
      const updatedRequest = {
        price: state ? row.item.price : 0,
        authorised: state,
        status: state ? 'Purchased' : 'Denied'
      } as UpdateRequest

      // Send the data to the api.
      await api.bookRequest.bookRequestUpdate(row.item._id, updatedRequest)

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
