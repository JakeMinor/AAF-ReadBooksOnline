<template>
  <b-modal title="Edit Role" id="EditRoleModal" hide-header-close>
    <template #default>
      <ValidationObserver ref="observer">
        <b-form ref="requestForm" @submit.stop.prevent="updateRole">
          <custom-input rules="required" v-model="role.name" label="Name" />
          <custom-input v-model="role.description" label="Description" class="mt-2" />
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
    selectedRole: Object as () => Role,
    permissions: Array
  },
  data () {
    return {
      role: { ...this.selectedRole }
    }
  },
  methods: {
    async updateRole () {
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      const newPermissions = this.role.permissions!.map(permission => permission._id)

      const updateRole = {
        name: this.role.name,
        description: this.role!.description,
        permissions: newPermissions
      } as UpdateRole

      await api.admin.roleUpdate(this.role._id!, updateRole).catch(error => {
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
