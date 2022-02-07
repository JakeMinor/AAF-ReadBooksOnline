<template>
  <b-modal title="Edit Request" id="editModal" hide-header-close>
    <template #default>
      <ValidationObserver ref="observer">
        <b-form @submit.stop.prevent="updateRequest">
          <custom-input label="Book Name" v-model="request.bookName" rules="required" @keypress.enter="updateRequest"/>
          <custom-input label="Author" v-model="request.author" rules="required" class="mt-3" @keypress.enter="updateRequest"/>
          <custom-input label="Book Type" :options="bookTypes" v-model="request.bookType" rules="required" class="mt-3" @keypress.enter="updateRequest"/>
          <custom-input label="ISBN" v-model="request.isbn" class="mt-3" @keypress.enter="updateRequest"/>
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
      request: { ...this.selectedRequest }
    }
  },
  props: {
    selectedRequest: Object as () => Request
  },
  computed: {
    bookTypes () {
      return bookTypes
    }
  },
  methods: {
    async updateRequest () {
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      const updatedRequest = {
        ...this.request,
        status: this.request.status === 'Additional Information Required' ? 'In Review' : 'Pending Review',
        statusMessage: 'Request has been updated.'
      } as UpdateRequest

      await api.bookRequest.bookRequestUpdate(this.request._id!, updatedRequest).catch(error => {
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })

      await Store.dispatch('user/getNotifications')

      this.$emit('Updated')
      this.closeModal()
    },
    closeModal () {
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })
      this.$bvModal.hide('editModal')
      this.$emit('Closed')
    }
  }
})
</script>
