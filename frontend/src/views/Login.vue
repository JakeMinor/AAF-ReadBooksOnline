<template>
<div class="h-100 d-flex align-items-center justify-content-center">
    <b-card class="w-75" title="Sign in">
      <template #default>
        <b-input-group class="flex-column p-3">
          <custom-input label="Email" v-model="email"></custom-input>
          <custom-input label="Password" type="password" v-model="password"></custom-input>
          <b-button variant="primary" class="mt-3" @click="signIn">Sign in</b-button>
        </b-input-group>
      </template>
    </b-card>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import Api from '@/helper'
export default Vue.extend({
  name: 'Login',
  components: {
    CustomInput
  },
  data () {
    return {
      email: null as string | null,
      password: null as string | null
    }
  },
  methods: {
    signIn () {
      Api.user.signInCreate({ email: this.email, password: this.password })
    }
  }
})
</script>
