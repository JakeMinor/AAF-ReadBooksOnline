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
      request: { ...this.selectedRequest }
    }
  },
  props: {
    selectedRequest: Object as () => Request
  },
  computed: {
    bookTypes () { return bookTypes }
  },
  methods: {
    async completeRequest () {
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      const updatedRequest = {
        ...this.request,
        status: 'Awaiting Approval'
      } as UpdateRequest

      await api.bookRequest.bookRequestUpdate(this.request._id!, updatedRequest).catch(error => {
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })
      this.$emit('Completed')

      this.closeModal()
    },
    closeModal () {
      this.$bvModal.hide('completeRequestModal')
      this.$emit('Closed')
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })
    }
  }
})
</script>
