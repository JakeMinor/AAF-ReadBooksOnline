<template>
  <b-modal title="Create Role" id="CreateRoleModal" hide-header-close>
    <template #default>
      <ValidationObserver ref="observer">
        <b-form ref="requestForm" @submit.stop.prevent="createRole">
          <custom-input rules="required" v-model="newRole.name" label="Name" />
          <custom-input v-model="newRole.description" label="Description" class="mt-2"/>
          <label class="w-100 mb-0 mt-2">Permissions</label>
          <multiselect :options="permissionsOptions" track-by="_id" label="name" :multiple="true" v-model="newRole.permissions"/>
        </b-form>
      </ValidationObserver>
    </template>
    <template #modal-footer>
      <b-button variant="primary-outline" class="mr-auto" @click="closeModal">Cancel</b-button>
      <b-button variant="primary" @click="createRole">Create</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import { CreateRole, Permission } from '@/api/api'
import Multiselect from 'vue-multiselect'
import { ValidationObserver } from 'vee-validate'
import { api } from '@/helper'
export default Vue.extend({
  name: 'CreateRoleModal',
  components: {
    CustomInput,
    Multiselect,
    ValidationObserver
  },
  props: {
    // Different permissions the user can choose from.
    permissionsOptions: {
      type: Array
    }
  },
  data () {
    return {
      newRole: {
        name: null as string | null, // The name of the new role.
        description: null as string | null, // The description of the new role.
        permissions: [] as Permission[] // The permissions which are to be added to the role.
      }
    }
  },
  methods: {
    /**
     * Make an API call to create a new role.
     */
    async createRole () {
      // Validate the data.
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      // Format the role data.
      const role = {
        name: this.newRole.name,
        description: this.newRole.description,
        permissions: this.newRole.permissions.map(permission => permission._id)
      } as CreateRole

      // Send the data to the api.
      await api.admin.roleCreate(role).catch(error => {
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
      this.$bvModal.hide('CreateRoleModal')

      // Resets the validation.
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })

      // Reset the data.
      this.newRole.name = null
      this.newRole.description = null
      this.newRole.permissions = []
    }
  }
})
</script>
