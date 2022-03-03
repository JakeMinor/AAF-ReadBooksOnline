<template>
  <b-modal title="Create Request" id="createModal" hide-header-close>
      <template #default>
        <ValidationObserver ref="observer">
          <b-form ref="createRequestForm" @submit.stop.prevent="createRequest">
            <custom-input id="Book-Name-Input" label="Book Name" v-model="createForm.bookName" rules="required" @keypress.enter="createRequest"/>
            <custom-input id="Author-Input" label="Author" v-model="createForm.author" rules="required" class="mt-3" @keypress.enter="createRequest"/>
            <custom-input id="Book-Type-Input" label="Book Type" :options="bookTypes" v-model="createForm.bookType" rules="required" class="mt-3" @keypress.enter="createRequest"/>
            <custom-input id="ISBN-Input" label="ISBN" v-model="createForm.isbn" class="mt-3" @keypress.enter="createRequest"/>
          </b-form>
        </ValidationObserver>
      </template>
      <template #modal-footer>
        <b-button variant="primary-outline" class="mr-auto" @click="closeModal">Cancel</b-button>
        <b-button id="Create" variant="primary" @click="createRequest">Create</b-button>
      </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import { api, BookType, bookTypes } from '@/helper'
import { CreateRequest } from '@/api/api'
import { ValidationObserver } from 'vee-validate'
import Store from '../../store/index'

export default Vue.extend({
  name: 'CreateRequestModal',
  components: { CustomInput, ValidationObserver },
  data () {
    return {
      createForm: {
        bookName: null as string | null, // The name of the requested book.
        author: null as string | null, // The author of the requested book.
        bookType: null as BookType | null, // The type of the requested book.
        isbn: '' as string // The ISBN of the requested book.
      }
    }
  },
  computed: {
    bookTypes () {
      return bookTypes // The available book types.
    }
  },
  methods: {
    /**
     * Make an API call to create a new book request.
     */
    async createRequest () {
      // Validate the data.
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) { return }

      // Format the request data.
      const newRequest = {
        ...this.createForm,
        requestedBy: this.$store.getters['user/user'].id,
        requestedDateTime: new Date().toUTCString()
      } as CreateRequest

      // Send the data to the api.
      await api.bookRequest.bookRequestCreate(newRequest).catch(error => {
        // Catch any errors and display a toast informing the user.
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })

      // Get the users notifications from the api.
      await Store.dispatch('user/getNotifications')

      // Close the modal.
      this.closeModal()
      this.$emit('Created')
    },
    /**
     * Closes the modal.
     */
    closeModal () {
      // Closes the modal.
      this.$bvModal.hide('createModal')

      // Resets the validation.
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })

      // Reset the data.
      this.createForm.bookName = ''
      this.createForm.isbn = ''
      this.createForm.bookType = ''
      this.createForm.author = ''
    }
  }
})
</script>
