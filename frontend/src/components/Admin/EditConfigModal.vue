<template>
  <b-modal title="Edit Config" id="EditConfigModal" hide-header-close>
    <template #default>
      <ValidationObserver ref="observer">
        <b-form ref="requestForm" @submit.stop.prevent="updateRole">
          <custom-input rules="required" type="number" v-model="config.spendThreshold" label="Spend Threshold" />
          <custom-input rules="required" type="number" v-model="config.monthlySpendThreshold" label="Monthly Spend Threshold" class="mt-2" />
          <custom-input rules="required" type="number" v-model="config.totalMonthlySpend" label="Total Monthly Spend" class="mt-2"/>
        </b-form>
      </ValidationObserver>
    </template>
    <template #modal-footer>
      <b-button variant="primary-outline" class="mr-auto" @click="closeModal">Cancel</b-button>
      <b-button variant="primary" @click="updateConfig">Update</b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import { ValidationObserver } from 'vee-validate'
import { Config, UpdateConfig } from '@/api/api'
import { api } from '@/helper'
export default Vue.extend({
  name: 'EditConfigModal',
  components: { CustomInput, ValidationObserver },
  props: {
    configData: Object as () => Config
  },
  data () {
    return {
      config: { ...this.configData }
    }
  },
  methods: {
    async updateConfig () {
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      const updatedConfig = {
        spendThreshold: this.config.spendThreshold,
        monthlySpendThreshold: this.config.monthlySpendThreshold,
        totalMonthlySpend: this.config.totalMonthlySpend
      } as UpdateConfig

      await api.admin.configUpdate(this.config._id, updatedConfig).catch(error => {
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
      this.$bvModal.hide('EditConfigModal')
      this.$emit('Closed')
    }
  }
})
</script>
