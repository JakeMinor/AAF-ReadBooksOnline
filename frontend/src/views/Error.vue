<template>
  <div class="d-flex flex-column align-items-center">
    <error></error>
    <h3 class="mt-5">Uh oh, the page you requested doesn't exist!</h3>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Error from '@/assets/Error.svg'
export default Vue.extend({
  name: 'Error.vue',
  components: { Error }
})
</script>
