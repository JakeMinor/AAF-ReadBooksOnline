<template>
  <b-card class="w-50">
    <h3>Request Statuses</h3>
    <apexcharts height="500px" :options="options" :series="data" type="pie" />
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { Config, Request } from '@/api/api'
import { api, statuses } from '@/helper'
import Apexcharts from 'vue-apexcharts'
import { ApexOptions } from 'apexcharts'
export default Vue.extend({
  name: 'StatusPieChart',
  components: { Apexcharts },
  props: {
    data: {
      type: Array // Array of data which is to be displayed on the pie chart.
    }
  },
  data () {
    return {
      // Pie Chart Options
      options: {
        labels: [...statuses] as string[], // The labels for the pie chart
        noData: {
          text: 'No Requests in the system.' // The message which is displayed when there is no data.
        },
        dataLabels: {
          formatter: function (value, { seriesIndex, dataPointIndex, w }) { // Adds a tooltip to the pie chart displaying the data.
            return `${w.config.series[seriesIndex]}`
          }
        },
        legend: {
          position: 'bottom' // Positions the tooltip at the bottom of the pie chart.
        }
      } as ApexOptions
    }
  }
})
</script>
