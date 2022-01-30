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
    permissionsOptions: {
      type: Array
    }
  },
  data () {
    return {
      newRole: {
        name: null as string | null,
        description: null as string | null,
        permissions: [] as Permission[]
      }
    }
  },
  methods: {
    async createRole () {
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      const role = {
        name: this.newRole.name,
        description: this.newRole.description,
        permissions: this.newRole.permissions.map(permission => permission._id)
      } as CreateRole

      await api.admin.roleCreate(role).catch(error => {
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
      this.$bvModal.hide('CreateRoleModal')
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })
      this.newRole.name = null
      this.newRole.description = null
      this.newRole.permissions = []
    }
  }
})
</script>
