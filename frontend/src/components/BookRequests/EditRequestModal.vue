<template>
  <b-modal title="Edit Request" id="editModal" hide-header-close>
    <template #default>
      <ValidationObserver ref="observer">
        <b-form @submit.stop.prevent="updateRequest">
          <custom-input label="Book Name" v-model="request.bookName" rules="required" />
          <custom-input label="Author" v-model="request.author" rules="required" />
          <custom-input label="Book Type" :options="bookTypes" v-model="request.bookType" rules="required" />
          <custom-input label="ISBN" v-model="request.isbn" />
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
        status: 'Pending Review',
        statusMessage: 'Request has been updated.'
      } as UpdateRequest

      await api.bookRequest.bookRequestUpdate(this.request._id!, updatedRequest)

      this.$bvModal.hide('editModal')
      this.$emit('Updated')
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })
    },
    closeModal () {
      this.$bvModal.hide('editModal')
    }
  }
})
</script>
