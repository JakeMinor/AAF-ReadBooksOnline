<template>
  <b-modal title="Edit Permission" id="EditPermissionModal" hide-header-close>
    <template #default>
      <ValidationObserver ref="observer">
        <b-form ref="requestForm" @submit.stop.prevent="updatePermission">
          <custom-input rules="required" v-model="permission.name" label="Name" />
          <custom-input v-model="permission.description" label="Description" class="mt-2" />
        </b-form>
      </ValidationObserver>
    </template>
    <template #modal-footer>
      <b-button variant="primary-outline" class="mr-auto" @click="closeModal">Cancel</b-button>
      <b-button variant="primary" @click="updatePermission">Update</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import { ValidationObserver } from 'vee-validate'
import { Permission, UpdatePermission } from '@/api/api'
import { api } from '@/helper'
export default Vue.extend({
  name: 'EditPermissionModal',
  components: { CustomInput, ValidationObserver },
  props: {
    selectedPermission: Object as () => Permission // The Permission to be updated.
  },
  data () {
    return {
      permission: { ...this.selectedPermission } // The Permission to be updated.
    }
  },
  methods: {
    /**
     * Make and API call to update a pre-existing permission.
     */
    async updatePermission () {
      // Validate the data.
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      // Format the permission data.
      const updatedPermission = {
        name: this.permission.name,
        description: this.permission.description
      } as UpdatePermission

      // Send data to the api.
      await api.admin.permissionUpdate(this.permission._id!, updatedPermission).catch(error => {
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
      this.$bvModal.hide('EditPermissionModal')

      // Resets the validation.
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })

      this.$emit('Closed')
    }
  }
})
</script>
