<template>
  <b-modal title="Edit User" id="EditUserModal" hide-header-close>
    <template #default>
      <ValidationObserver ref="observer">
        <b-form ref="requestForm" @submit.stop.prevent="updateUser">
          <label class="mb-0">Roles</label>
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
    selectedUser: Object as () => User, // The User which is to be updated.
    roles: Array // The array of available roles.
  },
  data () {
    return {
      user: { ...this.selectedUser } // The User which is to be updated.
    }
  },
  methods: {
    /**
     * Make and API call to update a pre-existing User.
     */
    async updateUser () {
      // Validate the data.
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      // Get the ID's from the selected roles.
      const newRoles = this.user.roles!.map(role => role._id)

      // Format the role data.
      const updateRole = {
        roles: newRoles
      } as UpdateUser

      // Send the data to the api.
      await api.user.userUpdate(this.user._id!, updateRole).catch(error => {
        // Catch any errors and display a toast informing the user.
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })

      // Close the modal.
      this.closeModal()
      this.$emit('Updated')
    },
    /**
     * Closes the modal.
     */
    closeModal () {
      // Closes the modal.
      this.$bvModal.hide('EditRoleModal')

      // Resets the validation.
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })

      this.$emit('Closed')
    }
  }
})
</script>
