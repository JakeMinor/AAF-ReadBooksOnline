<template>
  <b-modal title="Edit User" id="EditUserModal" hide-header-close>
    <template #default>
      <ValidationObserver ref="observer">
        <b-form ref="requestForm" @submit.stop.prevent="updateUser">
          <multiselect :options="roles" track-by="_id" label="name" :multiple="true"
                       v-model="user.roles" />
        </b-form>
      </ValidationObserver>
    </template>
    <template #modal-footer>
      <b-button variant="primary-outline" class="mr-auto" @click="closeModal">Cancel</b-button>
      <b-button variant="primary" @click="updateUser">Update</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationObserver } from 'vee-validate'
import { UpdateUser, User } from '@/api/api'
import { api } from '@/helper'
import Multiselect from 'vue-multiselect'

export default Vue.extend({
  name: 'EditUserModal',
  components: { ValidationObserver, Multiselect },
  props: {
    selectedUser: Object as () => User,
    roles: Array
  },
  data () {
    return {
      user: { ...this.selectedUser }
    }
  },
  methods: {
    async updateUser () {
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      const newRoles = this.user.roles!.map(role => role._id)

      const updateRole = {
        roles: newRoles
      } as UpdateUser

      await api.user.userUpdate(this.user._id!, updateRole).catch(error => {
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })
      this.closeModal()
      this.$emit('Updated')
    },
    closeModal () {
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })
      this.$bvModal.hide('EditRoleModal')
      this.$emit('Closed')
    }
  }
})
</script>
