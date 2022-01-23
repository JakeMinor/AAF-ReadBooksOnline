<template>
  <div>
    <h1 class="font-color-black">Catalog</h1>
    <catalog-item></catalog-item>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import CatalogItem from '@/components/CatalogItem.vue'
export default Vue.extend({
  name: 'Catalog',
  components: {
    CatalogItem
  }
})
</script>
