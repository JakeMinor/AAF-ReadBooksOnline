<template>
  <b-modal title="Edit Role" id="EditRoleModal" hide-header-close>
    <template #default>
      <ValidationObserver ref="observer">
        <b-form ref="requestForm" @submit.stop.prevent="updateRole">
          <custom-input rules="required" v-model="role.name" label="Name" />
          <custom-input v-model="role.description" label="Description" class="mt-2" />
          <label class="mt-2 mb-0">Permissions</label>
          <multiselect :options="permissions" track-by="_id" label="name" :multiple="true"
                       v-model="role.permissions" />
        </b-form>
      </ValidationObserver>
    </template>
    <template #modal-footer>
      <b-button variant="primary-outline" class="mr-auto" @click="closeModal">Cancel</b-button>
      <b-button variant="primary" @click="updateRole">Update</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import { ValidationObserver } from 'vee-validate'
import { Role, UpdateRole } from '@/api/api'
import { api } from '@/helper'
import Multiselect from 'vue-multiselect'
export default Vue.extend({
  name: 'EditRoleModal',
  components: { CustomInput, ValidationObserver, Multiselect },
  props: {
    selectedRole: Object as () => Role, // The Role to be updated.
    permissions: Array // The array of available permissions.
  },
  data () {
    return {
      role: { ...this.selectedRole } // The Role to be updated.
    }
  },
  methods: {
    /**
     * Make and API call to update a pre-existing Role.
     */
    async updateRole () {
      // Validate the data.
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      // Get the ID's from the selected permissions.
      const newPermissions = this.role.permissions!.map(permission => permission._id)

      // Format the role data.
      const updateRole = {
        name: this.role.name,
        description: this.role!.description,
        permissions: newPermissions
      } as UpdateRole

      // Send the data to the api.
      await api.admin.roleUpdate(this.role._id!, updateRole).catch(error => {
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
