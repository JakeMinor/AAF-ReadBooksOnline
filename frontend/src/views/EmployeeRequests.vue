<template>
  <div>
    <h1 class="font-color-black">{{ page }}</h1>
    <b-form-group>
      <b-form-radio-group buttons button-variant="outline-primary" v-model="page" :options="pages" @change="getTableItems"/>
    </b-form-group>
    <b-table responsive striped hover :items="tableItems" :fields="tableHeaders">
      <template #cell(requesteddatetime)="cell">
        {{ formatDate(cell.item.requestedDateTime) }}
      </template>
      <template #cell(status)="cell">
        {{ cell.item.statusHistory[cell.item.statusHistory.length - 1].status }}
      </template>
      <template #cell(actions)="row">
        <div class="d-flex flex-column">
          <b-link class="pb-2" v-if="page === 'Unallocated Requests'" @click="allocate(row.item._id)">Allocate</b-link>
          <b-link class="pb-2" v-if="page === 'My Requests'" @click="openModal('completeRequestModal', row.item)">Complete Request</b-link>
          <b-link class="pb-2" v-if="page === 'My Requests'">Ask for more information</b-link>
        </div>
      </template>
    </b-table>
    <b-modal title="Complete Request" id="completeRequestModal" hide-header-close>
      <template #default>
        <b-form ref="editRequestForm" @submit.stop.prevent="completeRequest">
          <custom-input label="Book Name" v-model="selectedRequest.bookName" />
          <custom-input label="Author" v-model="selectedRequest.author" />
          <custom-input label="Book Type" :options="bookTypes" v-model="selectedRequest.bookType" />
          <custom-input label="ISBN" v-model="selectedRequest.isbn" />
          <custom-input label="Price £" type="number" v-model="selectedRequest.cost" />
        </b-form>
      </template>
      <template #modal-footer>
        <div>
          <b-button variant="primary-outline" @click="closeModal('completeRequestModal')">Cancel</b-button>
          <b-button variant="primary" @click="completeRequest">Complete Request</b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Request, UpdateRequest } from '@/api/api'
import { api, formatDate } from '@/helper'
import CustomInput from '@/components/CustomInput.vue'
type pages = 'Unallocated Requests' | 'My Requests'

export default Vue.extend({
  name: 'EmployeeRequests',
  components: {
    CustomInput
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
    }
  },
  methods: {
    formatDate,
    async getTableItems () {
      if (this.page === 'Unallocated Requests') {
        this.tableItems = (await api.bookRequest.bookRequestList({ assignedTo: 'null' })).data
      } else {
        this.tableItems = (await api.bookRequest.bookRequestList({ assignedTo: this.$store.getters['user/user'].id })).data
      }
    },
    async allocate (requestId : string) {
      const userToAllocate = {
        assignedTo: this.$store.getters['user/user'].id
      } as UpdateRequest
      await api.bookRequest.bookRequestUpdate(requestId, userToAllocate)
      await this.getTableItems()
    },
    async completeRequest () {
      const updatedRequest = {
        ...this.selectedRequest
      } as UpdateRequest
      await api.bookRequest.bookRequestUpdate(this.selectedRequest!._id!, updatedRequest)
      await this.getTableItems()
      this.closeModal('completeRequestModal')
    },
    openModal (modalId : string, item : Request) {
      this.selectedRequest = item
      this.$bvModal.show(modalId)
    },
    closeModal (modalId : string) {
      this.$bvModal.hide(modalId)
      this.selectedRequest = null
    }
  },
  async created () {
    await this.getTableItems()
  }
})
</script>
