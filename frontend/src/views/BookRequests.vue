<template>
  <div>
    <h1 class="font-color-black">My Requests</h1>
    <b-button class="mt-2 mb-2 ml-auto" variant="primary" v-b-modal.createModal>Create</b-button>
    <b-table responsive striped hover :items="requestTableItems" :fields="requestTableHeaders">
      <template #cell(requesteddatetime)="cell">
        {{formatDate(cell.item.requestedDateTime)}}
      </template>
      <template #cell(status)="cell">
        {{cell.item.statusHistory[cell.item.statusHistory.length - 1].status}}
      </template>
      <template #cell(actions)="row">
        <div class="d-flex flex-column">
          <b-link class="pb-2" @click="openEditModal(row.item)">Edit</b-link>
          <b-link class="pb-2" @click="deleteRequest(row.item._id)">Delete</b-link>
          <b-link class="pb-2" @click="showStatusHistory(row)">Progress <b-icon-chevron-down/></b-link>
        </div>
      </template>
      <template #row-details>
        <status-timeline :status-history="selectedRequest.statusHistory"/>
      </template>
    </b-table>
    <b-modal title="Create Request" id="createModal" hide-header-close>
      <template #default>
        <b-form ref="createRequestForm" @submit.stop.prevent="createRequest">
          <custom-input label="Book Name" v-model="createForm.bookName" />
          <custom-input label="Author" v-model="createForm.author" />
          <custom-input label="Book Type" :options="bookTypes" v-model="createForm.bookType"/>
          <custom-input label="ISBN" v-model="createForm.isbn"/>
        </b-form>
      </template>
      <template #modal-footer>
        <b-button variant="primary-outline" class="mr-auto" @click="closeModal">Cancel</b-button>
        <b-button variant="primary" @click="createRequest">Create</b-button>
      </template>
    </b-modal>
    <b-modal title="Edit Request" id="editModal" hide-header-close>
      <template #default>
        <b-form ref="editRequestForm" @submit.stop.prevent="editRequest">
          <custom-input label="Book Name" v-model="selectedRequest.bookName" />
          <custom-input label="Author" v-model="selectedRequest.author" />
          <custom-input label="Book Type" :options="bookTypes" v-model="selectedRequest.bookType" />
          <custom-input label="ISBN" v-model="selectedRequest.isbn" />
        </b-form>
      </template>
      <template #modal-footer>
        <div>
          <b-button variant="primary-outline" @click="closeModal">Cancel</b-button>
          <b-button variant="primary" @click="editRequest">Update</b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Request, CreateRequest, UpdateRequest } from '@/api/api'
import CustomInput from '../components/CustomInput.vue'
import StatusTimeline from '@/components/StatusTimeline.vue'
import { api, formatDate } from '@/helper'
import { BRow } from 'bootstrap-vue'

export default Vue.extend({
  name: 'bookRequests',
  components: { CustomInput, StatusTimeline },
  data () {
    return {
      requests: [] as Request[],
      selectedRequest: null as Request | null,
      createForm: {
        bookName: '',
        author: '',
        bookType: '',
        isbn: ''
      }
    }
  },
  computed: {
    requestTableItems () {
      return this.$data.requests
    },
    requestTableHeaders () {
      return ['bookName', 'author', 'isbn', 'bookType', 'requestedDateTime', 'status', 'Actions']
    },
    bookTypes () {
      return ['Book', 'Audiobook']
    }
  },
  methods: {
    formatDate,
    closeModal () {
      this.$bvModal.hide('createModal')
      this.$bvModal.hide('editModal')
      this.selectedRequest = null
      this.createForm.bookName = ''
      this.createForm.isbn = ''
      this.createForm.bookType = ''
      this.createForm.author = ''
    },
    openEditModal (item : Request) {
      this.selectedRequest = item
      this.$bvModal.show('editModal')
    },
    async showStatusHistory (row : BRow) {
      row.toggleDetails()
      row.detailsShowing ? this.selectedRequest = null : this.selectedRequest = row.item
    },
    async editRequest () {
      // validate Form
      const updatedRequest = {
        ...this.selectedRequest
      } as UpdateRequest
      await api.bookRequest.bookRequestUpdate(this.selectedRequest!._id ?? '', updatedRequest)
      this.requests = (await api.bookRequest.bookRequestList({ requestedBy: this.$store.getters['user/user'].id })).data // CHANGE BACKEND TO RETURN UPDATED LIST
      this.$bvModal.hide('editModal')
    },
    async createRequest () {
      // validate form
      const newRequest = {
        ...this.createForm,
        requestedBy: this.$store.getters['user/user'].id,
        requestedDateTime: new Date().toUTCString()
      } as CreateRequest
      await api.bookRequest.bookRequestCreate(newRequest)
      this.requests = (await api.bookRequest.bookRequestList({ requestedBy: this.$store.getters['user/user'].id })).data
      this.$bvModal.hide('createModal')
    },
    async deleteRequest (id : string) {
      await api.bookRequest.bookRequestDelete(id)
      this.requests = (await api.bookRequest.bookRequestList({ requestedBy: this.$store.getters['user/user'].id })).data // CHANGE BACKEND TO RETURN UPDATED LIST
    }
  },
  async created () {
    this.requests = (await api.bookRequest.bookRequestList({ requestedBy: this.$store.getters['user/user'].id })).data
  }
})
</script>
