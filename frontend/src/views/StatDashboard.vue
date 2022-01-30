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
      config: null as Config | null,
      requests: [] as Request[]
    }
  },
  computed: {
    pieChartData () {
      return statuses.map(status => {
        return this.$data.requests.reduce((count: number, request: Request) => (request.status === status ? count + 1 : count), 0)
      })
    },
    monthlySpendPercentage () {
      return (this.$data.config?.totalMonthlySpend / this.$data.config?.monthlySpendThreshold) * 100
    },
    monthlyCap () {
      return this.$data.config?.monthlySpendThreshold ?? 0
    },
    monthlySpend () {
      return this.$data.config.totalMonthlySpend ?? 0
    }
  },
  async created () {
    this.$data.config = api.admin.configList().then((res) => {
      return res.data[0]
    }).catch(error => this.$bvToast.toast(error.message, {
      title: 'Error',
      variant: 'danger',
      solid: true
    }))

    this.$data.requests = api.bookRequest.bookRequestList({
      offset: '0',
      limit: Number.MAX_VALUE.toString()
    }).then((res) => {
      return res.data.requests
    }).catch(error => this.$bvToast.toast(error.message, {
      title: 'Error',
      variant: 'danger',
      solid: true
    }))
  }
})
</script>
