<template>
  <b-modal title="Complete Request" id="completeRequestModal" hide-header-close>
    <template #default>
      <ValidationObserver ref="observer">
        <b-form ref="completeRequestForm" @submit.stop.prevent="completeRequest">
          <custom-input label="Book Name" v-model="request.bookName" rules="required" @keypress.enter="completeRequest"/>
          <custom-input label="Author" v-model="request.author" rules="required" class="mt-3" @keypress.enter="completeRequest"/>
          <custom-input label="Book Type" :options="bookTypes" v-model="request.bookType" rules="required" class="mt-3" @keypress.enter="completeRequest"/>
          <custom-input label="ISBN" v-model="request.isbn" rules="required" class="mt-3" @keypress.enter="completeRequest"/>
          <custom-input label="Price £" v-model="request.price" rules="required" class="mt-3" @keypress.enter="completeRequest"/>
        </b-form>
      </ValidationObserver>
    </template>
    <template #modal-footer>
      <b-button variant="primary-outline" class="mr-auto" @click="closeModal">Cancel</b-button>
      <b-button variant="primary" @click="completeRequest">Complete</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import { api, bookTypes } from '@/helper'
import { ValidationObserver } from 'vee-validate'
import { UpdateRequest, Request } from '@/api/api'
export default Vue.extend({
  name: 'CompleteRequestModal',
  components: { CustomInput, ValidationObserver },
  data () {
    return {
      request: { ...this.selectedRequest } // The Request which is to be completed.
    }
  },
  props: {
    selectedRequest: Object as () => Request // The Request which is to be completed.
  },
  computed: {
    bookTypes () { return bookTypes } // The available book types.
  },
  methods: {
    /**
     * Make an API call to complete a book request.
     */
    async completeRequest () {
      // Validate the data.
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      // Format the request data.
      const updatedRequest = {
        ...this.request,
        status: 'Awaiting Approval'
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

      // Close the modal.
      this.$emit('Completed')
      this.closeModal()
    },
    /**
     * Closes the modal.
     */
    closeModal () {
      // Closes the modal.
      this.$bvModal.hide('completeRequestModal')

      // Resets the validation.
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })

      this.$emit('Closed')
    }
  }
})
</script>
