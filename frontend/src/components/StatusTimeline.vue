<template>
  <b-card>
    <div>
      <h5 class="font-spectral">Status Timeline</h5>
      <b-alert v-for="status in request.statusHistory" :key="status._id" :variant="getVariant(status)" class="d-flex m-0" show>
        <div class="d-flex flex-column">
          <strong>Status updated to {{ status.status }}</strong>
          <span v-if="status.message" class="pt-3"> {{ status.message }}</span>
        </div>
        <strong class="ml-auto">{{ formatDate(status.date)}} By {{status.updatedBy.username}}</strong>
      </b-alert>
      <ValidationObserver ref="observer" v-if="status === 'Additional Information Required'" >
        <div class="d-flex mt-2">
          <custom-input id="Additional-Information" label="Additional Information" placeholder="Additional Information..." rules="required"
                        v-model="information" class="mt-1" @keypress.enter="sendAdditionalInformation"></custom-input>
          <b-button class="h-50 mt-4 mb-3 ml-2" @click="sendAdditionalInformation" variant="primary">Send</b-button>
        </div>
      </ValidationObserver>
    </div>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Request, Status, UpdateRequest } from '@/api/api'
import { api, formatDate } from '@/helper'
import CustomInput from '@/components/CustomInput.vue'
import { ValidationObserver } from 'vee-validate'
import Store from '@/store'
export default Vue.extend({
  name: 'StatusTimeline',
  components: { CustomInput, ValidationObserver },
  data () {
    return {
      request: { ...this.selectedRequest }, // The Request which has been selected.
      status: this.selectedRequest.status, // The selected requests status.
      information: null as string | null // The additional information which is to be added to the request.
    }
  },
  props: {
    // The Request which has been selected.
    selectedRequest: {
      type: Object as () => Request,
      required: true
    }
  },
  methods: {
    /**
     * Format Date function from helper.ts
     */
    formatDate,
    /**
     * Gets the variant to use for the b-alert
     * @param status - The current status of the status.
     */
    getVariant (status : Status) {
      switch (status.status) {
        // If the status is Pending review, it uses the primary bootstrap styling.
        case 'Pending Review':
          return 'primary'
        // If the status is In review, it uses the info bootstrap styling.
        case 'In Review':
          return 'info'
        // If the status is Additional Information Required, it uses the warning bootstrap styling.
        case 'Additional Information Required':
          return 'warning'
        // If the status is Awaiting Approval, it uses the dark bootstrap styling.
        case 'Awaiting Approval':
          return 'dark'
        // If the status is Denied, it uses the danger bootstrap styling.
        case 'Denied':
          return 'danger'
        // If the status is Purchased, it uses the success bootstrap styling.
        case 'Purchased':
          return 'success'
      }
    },
    /**
     * Saves additional information to the request.
     */
    async sendAdditionalInformation () {
      // Validate the data.
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      // Format the request data.
      const updatedRequest = {
        status: 'In Review',
        statusMessage: this.information
      } as UpdateRequest

      // Send the data to the api.
      await api.bookRequest.bookRequestUpdate(this.request._id!, updatedRequest)
        .catch(error => {
          // Catch any errors and display a toast informing the user.
          this.$bvToast.toast(error.message, {
            title: 'Error',
            variant: 'danger',
            solid: true
          })
        })

      // Gets the users notifications from the store.
      await Store.dispatch('user/getNotifications')

      this.$emit('AdditionalInformationSupplied')

      // Reset any validation.
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })
    }
  }
})
</script>
