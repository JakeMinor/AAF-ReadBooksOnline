<template>
  <b-card class="w-50">
    <h3>Monthly Spend</h3>
    <b-card-body class="h-100">
      <div class="d-flex align-items-center h-75 mt-3">
        <b-progress :max="100" show-progress animated class="w-100">
          <b-progress-bar :value="percentage" :label="`${percentage.toFixed(2)}%`"></b-progress-bar>
        </b-progress>
      </div>

      <div class="text-center d-flex mt-3 flex-column justify-content-end">
        <h5>Total Monthly Spend: £{{ monthlySpend }}</h5>
        <h5>Total Monthly Threshold: £{{ monthlyCap }}</h5>
      </div>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'MonthlySpendWidget',
  props: {
    percentage: Number, // The Percentage to be displayed in the progress bar.
    monthlySpend: Number, // The total monthly spend.
    monthlyCap: Number // The total monthly cap.
  }
})
</script>
