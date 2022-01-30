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
        name: null as string | null,
        description: null as string | null
      }
    }
  },
  methods: {
    async createPermission () {
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      const permission = {
        name: this.newPermission.name,
        description: this.newPermission.description
      } as CreatePermission

      await api.admin.permissionCreate(permission).catch(error => {
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
      this.$bvModal.hide('CreatePermissionModal')
      this.$nextTick(() => {
        (this.$refs.observer as InstanceType<typeof ValidationObserver>).reset()
      })
      this.newPermission.name = null
      this.newPermission.description = null
    }
  }
})
</script>
