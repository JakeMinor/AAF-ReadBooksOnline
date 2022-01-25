<template>
<div class="mb-2">
  <label class="w-100">
    {{ label }}
    <ValidationProvider :name="label" :rules="rules" v-slot="{ errors }">
      <b-form-select v-if="options" :options="options" v-bind="$attrs" v-on="$listeners" :class="errors.length > 0 ? 'border-danger' : ''"></b-form-select>
      <b-form-input v-else :type="type" v-bind="$attrs" v-on="$listeners" :class="errors.length > 0 ? 'border-danger' : ''"></b-form-input>
      <span class="text-danger">{{ errors[0] }}</span>
    </ValidationProvider>
  </label>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ValidationProvider } from 'vee-validate'

export default Vue.extend({
  name: 'CustomInput',
  components: { ValidationProvider },
  props: {
    options: Array,
    type: String,
    label: String,
    rules: String
  }
})
</script>
