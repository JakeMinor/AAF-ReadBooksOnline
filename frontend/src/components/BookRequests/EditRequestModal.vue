<template>
  <b-modal title="Edit Request" id="editModal" hide-header-close>
    <template #default>
      <ValidationObserver ref="observer">
        <b-form @submit.stop.prevent="updateRequest">
          <custom-input id="Book-Name-Input" label="Book Name" v-model="request.bookName" rules="required" @keypress.enter="updateRequest"/>
          <custom-input id="Author-Input" label="Author" v-model="request.author" rules="required" class="mt-3" @keypress.enter="updateRequest"/>
          <custom-input id="Book-Type-Input" label="Book Type" :options="bookTypes" v-model="request.bookType" rules="required" class="mt-3" @keypress.enter="updateRequest"/>
          <custom-input id="ISBN-Input" label="ISBN" v-model="request.isbn" class="mt-3" @keypress.enter="updateRequest"/>
        </b-form>
      </ValidationObserver>
    </template>
    <template #modal-footer>
      <b-button variant="primary-outline" class="mr-auto" @click="closeModal">Cancel</b-button>
      <b-button variant="primary" @click="updateRequest">Update</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import { api, bookTypes } from '@/helper'
import { UpdateRequest, Request } from '@/api/api'
import { ValidationObserver } from 'vee-validate'
import Store from '@/store'

export default Vue.extend({
  name: 'EditRequestModal',
  components: { CustomInput, ValidationObserver },
  data () {
    return {
      request: { ...this.selectedRequest } // The Request which is to be updated.
    }
  },
  props: {
    selectedRequest: Object as () => Request // The Request which is to be updated.
  },
  computed: {
    bookTypes () {
      return bookTypes // The available book types.
    }
  },
  methods: {
    /**
     * Make an API call to update a book request.
     */
    async updateRequest () {
      // Validate the data.
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      // Format the request data.
      const updatedRequest = {
        ...this.request,
        status: this.request.status === 'Additional Information Required' ? 'In Review' : 'Pending Review',
        statusMessage: 'Request has been updated.'
      } as UpdateRequest

      // Send the data to the api.
      await api.bookRequest.bookRequestUpdate(this.request._id!, updatedRequest).catch(error => {
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
      this.$emit('Updated')
      this.closeModal()
    },
    /**
     * Closes the modal.
     */
    closeModal () {
      // Closes the modal.
      this.$bvModal.hide('editModal')

      // Resets the validation.
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })

      this.$emit('Closed')
    }
  }
})
</script>
