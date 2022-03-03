<template>
  <b-modal title="Create Permission" id="CreatePermissionModal" hide-header-close>
    <template #default>
      <ValidationObserver ref="observer">
        <b-form ref="requestForm" @submit.stop.prevent="createPermission">
          <custom-input rules="required" v-model="newPermission.name" label="Name" />
          <custom-input v-model="newPermission.description" label="Description" class="mt-2" />
        </b-form>
      </ValidationObserver>
    </template>
    <template #modal-footer>
      <b-button variant="primary-outline" class="mr-auto" @click="closeModal">Cancel</b-button>
      <b-button variant="primary" @click="createPermission">Create</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import { ValidationObserver } from 'vee-validate'
import { CreatePermission } from '@/api/api'
import { api } from '@/helper'
export default Vue.extend({
  name: 'CreatePermissionModal',
  components: { CustomInput, ValidationObserver },
  data () {
    return {
      newPermission: {
        name: null as string | null, // Name of the permission.
        description: null as string | null // Description of the permission.
      }
    }
  },
  methods: {
    /**
     * Make an API call to create a new permission.
     */
    async createPermission () {
      // Validate the data.
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      // Format the permission data.
      const permission = {
        name: this.newPermission.name,
        description: this.newPermission.description
      } as CreatePermission

      // Send the data to the API.
      await api.admin.permissionCreate(permission).catch(error => {
        // Catch any errors and display a toast informing the user.
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })

      // Close the modal.
      this.closeModal()
      this.$emit('Created')
    },
    /**
     * Closes the modal.
     */
    closeModal () {
      // Closes the modal.
      this.$bvModal.hide('CreatePermissionModal')

      // Resets the validation.
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })

      // Reset the data.
      this.newPermission.name = null
      this.newPermission.description = null
    }
  }
})
</script>
