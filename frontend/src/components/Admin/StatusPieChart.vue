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
      type: Array
    }
  },
  data () {
    return {
      options: {
        labels: [...statuses] as string[],
        noData: {
          text: 'No Requests in the system.'
        },
        dataLabels: {
          formatter: function (value, { seriesIndex, dataPointIndex, w }) {
            return `${w.config.series[seriesIndex]}`
          }
        },
        legend: {
          position: 'bottom'
        }
      } as ApexOptions
    }
  }
})
</script>
