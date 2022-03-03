<template>
  <b-modal title="Request More Information" id="moreInformationModal" hide-header-close>
    <template #default>
      <ValidationObserver ref="observer">
        <b-form ref="moreInformationForm" @submit.stop.prevent="requestMoreInformation">
          <custom-input label="More Information" v-model="moreInformation" type="text-area" rules="required" @keypress.enter="requestMoreInformation" />
        </b-form>
      </ValidationObserver>
    </template>
    <template #modal-footer>
      <b-button variant="primary-outline" class="mr-auto" @click="closeModal">Cancel</b-button>
      <b-button variant="primary" @click="requestMoreInformation">Request Information</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import { UpdateRequest } from '@/api/api'
import { api } from '@/helper'
import { ValidationObserver } from 'vee-validate'
export default Vue.extend({
  name: 'RequestMoreInformationModal',
  components: { CustomInput, ValidationObserver },
  data () {
    return {
      moreInformation: null as string | null // The additional information required for the request.
    }
  },
  props: {
    requestId: String // The ID of the selected request.
  },
  methods: {
    async requestMoreInformation () {
      // Validate the data.
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      // Format the request data.
      const updatedRequest = {
        status: 'Additional Information Required',
        statusMessage: this.moreInformation
      } as UpdateRequest

      // Send the data to the api.
      await api.bookRequest.bookRequestUpdate(this.requestId, updatedRequest).catch(error => {
        // Catch any errors and display a toast informing the user.
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })

      // Close the modal.
      this.closeModal()
      this.$emit('MoreInformationRequested')
    },
    /**
     * Closes the modal.
     */
    closeModal () {
      // Closes the modal.
      this.$bvModal.hide('moreInformationModal')

      // Resets the validation.
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })

      // Reset the data.
      this.moreInformation = null

      this.$emit('Closed')
    }
  }
})
</script>
