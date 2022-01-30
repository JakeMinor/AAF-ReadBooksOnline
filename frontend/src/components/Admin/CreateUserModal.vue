<template>
  <b-modal title="Create User" id="CreateUserModal" hide-header-close>
    <template #default>
      <ValidationObserver ref="observer">
        <b-form ref="requestForm" @submit.stop.prevent="createUser">
          <custom-input label="Username" rules="required" v-model="newUser.username" />
          <custom-input label="Email" rules="required|email" v-model="newUser.email" class="mt-2"/>
          <custom-input label="Password" rules="required" type="password" v-model="newUser.password" class="mt-2"/>
        </b-form>
      </ValidationObserver>
    </template>
    <template #modal-footer>
      <b-button variant="primary-outline" class="mr-auto" @click="closeModal">Cancel</b-button>
      <b-button variant="primary" @click="createUser">Create</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { CreateUser } from '@/api/api'
import CustomInput from '@/components/CustomInput.vue'
import { ValidationObserver } from 'vee-validate'
import { api } from '@/helper'
export default Vue.extend({
  name: 'CreateUserModal',
  components: {
    CustomInput,
    ValidationObserver
  },
  data () {
    return {
      newUser: {
        username: null as string | null,
        email: null as string | null,
        password: null as string | null
      }
    }
  },
  methods: {
    async createUser () {
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()

      if (!valid) {
        return
      }
      const user = {
        ...this.newUser
      } as CreateUser

      await api.user.userCreate(user).catch(error => {
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })
      this.closeModal()
      this.$emit('Created')
    },
    closeModal () {
      this.$bvModal.hide('CreateUserModal')
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })
      this.newUser.username = null
      this.newUser.password = null
      this.newUser.email = null
    }
  }
})
</script>
