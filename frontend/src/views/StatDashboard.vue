<template>
  <div class="d-flex">
    <status-pie-chart v-if="requests" :data="pieChartData" class="mr-3"/>
    <monthly-spend-widget v-if="config" :monthly-cap="monthlyCap" :monthly-spend="monthlySpend" :percentage="monthlySpendPercentage"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Config, Request } from '@/api/api'
import { api, statuses } from '@/helper'
import StatusPieChart from '@/components/Admin/StatusPieChart.vue'
import MonthlySpendWidget from '@/components/Admin/MonthlySpendWidget.vue'
export default Vue.extend({
  name: 'StatDashboard',
  components: { StatusPieChart, MonthlySpendWidget },
  data () {
    return {
      config: null as Config | null, // The config for the site.
      requests: [] as Request[] // All of the requests in the system.
    }
  },
  computed: {
    /**
     * Gets the total count of each status.
     */
    pieChartData () {
      return statuses.map(status => {
        return this.$data.requests.reduce((count: number, request: Request) => (request.status === status ? count + 1 : count), 0)
      })
    },
    /**
     * Gets a percentage of monthly spend threshold has been spent.
     */
    monthlySpendPercentage () {
      return (this.$data.config?.totalMonthlySpend / this.$data.config?.monthlySpendThreshold) * 100
    },
    /**
     * Gets the monthly spend threshold.
     */
    monthlyCap () {
      return this.$data.config?.monthlySpendThreshold ?? 0
    },
    /**
     * Gets the total monthly spend.
     */
    monthlySpend () {
      return this.$data.config.totalMonthlySpend ?? 0
    }
  },
  // Created hook which gets the config data and all of the requests.
  async created () {
    // Sends an API call to get the config data.
    api.admin.configList().then((res) => {
      // Sets the config data.
      this.$data.config = res.data[0]
    })
    // Catch any errors and display a toast informing the user.
    .catch(error => this.$bvToast.toast(error.message, {
      title: 'Error',
      variant: 'danger',
      solid: true
    }))

    // Sends an API call to get all the requests.
    api.bookRequest.bookRequestList({
      offset: '0',
      limit: Number.MAX_VALUE.toString()
    }).then((res) => {
      // Sets the requests data.
      this.$data.requests = res.data.requests
    })
    // Catch any errors and display a toast informing the user.
    .catch(error => this.$bvToast.toast(error.message, {
      title: 'Error',
      variant: 'danger',
      solid: true
    }))
  }
})
</script>
