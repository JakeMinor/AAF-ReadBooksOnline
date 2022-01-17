<template>
  <div>
    <b-button class="mt-2 mb-2" variant="primary" v-b-modal.createModal>Create</b-button>
    <b-table striped hover :items="requestTableItems" :fields="requestTableHeaders">
      <template #cell(actions)="cellData">
        <div class="d-flex flex-column">
          <b-link @click="openEditModal(cellData.item)">Edit</b-link>
          <b-link @click="deleteRequest(cellData.item._id)">Delete</b-link>
        </div>
      </template>
    </b-table>
    <b-modal title="Create Request" id="createModal">
      <template #default>
        <b-form ref="createRequestForm" @submit.stop.prevent="createRequest">
          <custom-input label="Book Name" v-model="createForm.bookName" />
          <custom-input label="Author" v-model="createForm.author" />
          <custom-input label="Book Type" :options="bookTypes" v-model="createForm.bookType"/>
          <custom-input label="ISBN" v-model="createForm.isbn"/>
        </b-form>
      </template>
      <template #modal-footer>
        <div>
          <b-button variant="primary-outline" @click="closeModal">Cancel</b-button>
          <b-button variant="primary" @click="createRequest">Create</b-button>
        </div>
      </template>
    </b-modal>
    <b-modal title="Edit Request" id="editModal">
      <template #default>
        <b-form ref="editRequestForm" @submit.stop.prevent="editRequest">
          <custom-input label="Book Name" v-model="createForm.bookName" />
          <custom-input label="Author" v-model="createForm.author" />
          <custom-input label="Book Type" :options="bookTypes" v-model="createForm.bookType" />
          <custom-input label="ISBN" v-model="createForm.isbn" />
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
import Api from '../helper'
export default Vue.extend({
  name: 'bookRequests',
  components: { CustomInput },
  data () {
    return {
      requests: [] as Request[],
      id: '',
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
    closeModal () {
      this.$bvModal.hide('createModal')
      this.$bvModal.hide('editModal')
      this.id = ''
      this.createForm.bookName = ''
      this.createForm.isbn = ''
      this.createForm.bookType = ''
      this.createForm.author = ''
    },
    openEditModal (item : Request) {
      this.id = item._id ?? ''
      this.createForm.bookName = item.bookName
      this.createForm.author = item.author
      this.createForm.bookType = item.bookType
      this.createForm.isbn = item.isbn ?? ''
      this.$bvModal.show('editModal')
    },
    async editRequest () {
      // validate Form
      const updatedRequest = {
        ...this.createForm
      } as UpdateRequest
      await Api.bookRequest.bookRequestUpdate(this.id, updatedRequest)
      this.requests = (await Api.bookRequest.bookRequestList()).data // CHANGE BACKEND TO RETURN UPDATED LIST
      this.$bvModal.hide('editModal')
    },
    async createRequest () {
      // validate form
      const newRequest = {
        ...this.createForm,
        status: 'Pending Review',
        requestedBy: '61dee6027a1e2c5a5a45f3ad', // UPDATE TO CURRENT USER WHEN AUTH IS DONE
        requestedDateTime: new Date().toUTCString()
      } as CreateRequest
      this.requests = (await Api.bookRequest.bookRequestCreate(newRequest)).data
      this.$bvModal.hide('createModal')
    },
    async deleteRequest (id : string) {
      await Api.bookRequest.bookRequestDelete(id)
      this.requests = (await Api.bookRequest.bookRequestList()).data // CHANGE BACKEND TO RETURN UPDATED LIST
    }
  },
  async created () {
    this.requests = (await Api.bookRequest.bookRequestList()).data
  }
})
</script>
