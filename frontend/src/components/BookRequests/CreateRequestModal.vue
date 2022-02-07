<template>
  <b-modal title="Create Request" id="createModal" hide-header-close>
      <template #default>
        <ValidationObserver ref="observer">
          <b-form ref="createRequestForm" @submit.stop.prevent="createRequest">
            <custom-input label="Book Name" v-model="createForm.bookName" rules="required" @keypress.enter="createRequest"/>
            <custom-input label="Author" v-model="createForm.author" rules="required" class="mt-3" @keypress.enter="createRequest"/>
            <custom-input label="Book Type" :options="bookTypes" v-model="createForm.bookType" rules="required" class="mt-3" @keypress.enter="createRequest"/>
            <custom-input label="ISBN" v-model="createForm.isbn" class="mt-3" @keypress.enter="createRequest"/>
          </b-form>
        </ValidationObserver>
      </template>
      <template #modal-footer>
        <b-button variant="primary-outline" class="mr-auto" @click="closeModal">Cancel</b-button>
        <b-button variant="primary" @click="createRequest">Create</b-button>
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
        bookName: null as string | null,
        author: null as string | null,
        bookType: null as BookType | null,
        isbn: '' as string
      }
    }
  },
  computed: {
    bookTypes () {
      return bookTypes
    }
  },
  methods: {
    async createRequest () {
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) { return }

      const newRequest = {
        ...this.createForm,
        requestedBy: this.$store.getters['user/user'].id,
        requestedDateTime: new Date().toUTCString()
      } as CreateRequest

      await api.bookRequest.bookRequestCreate(newRequest).catch(error => {
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })

      await Store.dispatch('user/getNotifications')

      this.closeModal()
      this.$emit('Created')
    },
    closeModal () {
      this.$bvModal.hide('createModal')
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })
      this.createForm.bookName = ''
      this.createForm.isbn = ''
      this.createForm.bookType = ''
      this.createForm.author = ''
    }
  }
})
</script>
