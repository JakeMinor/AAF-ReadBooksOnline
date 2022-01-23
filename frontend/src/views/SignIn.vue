<template>
<div class="vh-100 d-flex align-items-center justify-content-center">
    <b-card class="w-75" title="Sign in to ReadBooks Online">
      <template #default>
        <b-input-group class="flex-column p-3">
          <custom-input label="Email" v-model="email"></custom-input>
          <custom-input label="Password" type="password" v-model="password"></custom-input>
          <b-button variant="primary" class="mt-3" @click="signIn">Sign in</b-button>
          <span class="mt-4">New here? <b-link to="sign-up">Sign up!</b-link></span>
        </b-input-group>
      </template>
    </b-card>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import { api } from '@/helper'
export default Vue.extend({
  name: 'Login',
  components: {
    CustomInput
  },
  data () {
    return {
      email: '' as string,
      password: '' as string
    }
  },
  methods: {
    async signIn () {
      await api.user.signInCreate({ email: this.email, password: this.password })
      await this.$router.push({ name: 'Catalog' })
    }
  }
})
</script>
