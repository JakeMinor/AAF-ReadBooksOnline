<template>
  <b-modal title="Request More Information" id="moreInformationModal" hide-header-close>
    <template #default>
      <ValidationObserver ref="observer">
        <b-form ref="moreInformationForm" @submit.stop.prevent="requestMoreInformation">
          <custom-input label="More Information" v-model="moreInformation" type="text-area" rules="required" />
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
      moreInformation: null as string | null
    }
  },
  props: {
    requestId: String
  },
  methods: {
    async requestMoreInformation () {
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      const updatedRequest = {
        status: 'Additional Information Required',
        statusMessage: this.moreInformation
      } as UpdateRequest

      await api.bookRequest.bookRequestUpdate(this.requestId, updatedRequest).catch(error => {
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })
      this.closeModal()
      this.$emit('MoreInformationRequested')
    },
    closeModal () {
      this.$bvModal.hide('moreInformationModal')
      this.$emit('Closed')
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })
      this.moreInformation = null
    }
  }
})
</script>
