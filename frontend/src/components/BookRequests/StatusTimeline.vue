<template>
  <b-card>
    <div>
      <h5 class="font-spectral">Status Timeline</h5>
      <b-alert v-for="status in statusHistory" :key="status._id" :variant="getVariant(status)" class="d-flex m-0" show>
        <div class="d-flex flex-column">
          <strong>Status updated to {{ status.status }}</strong>
          <span v-if="status.message" class="pt-3"> {{ status.message }}</span>
        </div>
        <strong class="ml-auto">{{ formatDate(status.date)}} By {{status.updatedBy.username}}</strong>
      </b-alert>
    </div>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Status, Statuses } from '@/api/api'
import { api, formatDate } from '@/helper'
export default Vue.extend({
  name: 'StatusTimeline',
  props: {
    statusHistory: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatDate,
    getVariant (status : Status) {
      switch (status.status) {
        case 'Pending Review':
          return 'primary'
        case 'In Review':
          return 'info'
        case 'Additional Information Required':
          return 'warning'
        case 'Additional Information Supplied':
          return 'dark'
        case 'Denied':
          return 'danger'
        case 'Purchased':
          return 'success'
      }
    }
  }
})
</script>
