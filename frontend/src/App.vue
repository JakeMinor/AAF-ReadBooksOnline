<template>
  <div>
    <navigation-bar></navigation-bar>
    <div class="container vh-75">
      <router-view />
    </div>
  </div>

</template>

<script lang="ts">
import Vue from 'vue'
import NavigationBar from '@/components/NavigationBar.vue'

export default Vue.extend({
  name: 'App',
  components: {
    NavigationBar
  }
})
</script>
