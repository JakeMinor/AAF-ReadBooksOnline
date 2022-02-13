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
      request: { ...this.selectedRequest },
      status: this.selectedRequest.status,
      information: null as string | null
    }
  },
  props: {
    selectedRequest: {
      type: Object as () => Request,
      required: true
    }
  },
  methods: {
    formatDate,
    getVariant (status : Status) {
      switch (status.status) {
        case 'Pending Review':
          return 'primary'
        case 'In Review':
          return 'info'
        case 'Additional Information Required':
          return 'warning'
        case 'Awaiting Approval':
          return 'dark'
        case 'Denied':
          return 'danger'
        case 'Purchased':
          return 'success'
      }
    },
    async sendAdditionalInformation () {
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      const updatedRequest = {
        status: 'In Review',
        statusMessage: this.information
      } as UpdateRequest

      await api.bookRequest.bookRequestUpdate(this.request._id!, updatedRequest)
        .catch(error => {
          this.$bvToast.toast(error.message, {
            title: 'Error',
            variant: 'danger',
            solid: true
          })
        })

      await Store.dispatch('user/getNotifications')

      this.$emit('AdditionalInformationSupplied')
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })
    }
  }
})
</script>
