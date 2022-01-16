<template>
<div>
  <label>
    {{label}}
    <b-form-select v-if="options" :options="options" v-bind="$attrs" v-on="$listeners"></b-form-select>
    <b-form-input v-else :type="type" v-bind="$attrs" v-on="$listeners"></b-form-input>
  </label>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'CustomInput',
  props: {
    options: Array,
    type: String,
    label: String
  }
})
</script>
