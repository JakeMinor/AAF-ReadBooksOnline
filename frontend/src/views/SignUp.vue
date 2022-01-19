<template>
  <div class="h-100 d-flex align-items-center justify-content-center">
    <b-card class="w-75" title="Sign up to ReadBooks Online">
      <template #default>
        <b-input-group class="flex-column p-3">
          <custom-input label="Email" v-model="email"></custom-input>
          <custom-input label="Username" v-model="username"></custom-input>
          <custom-input label="Password" type="password" v-model="password"></custom-input>
          <custom-input label="Verify Password" type="password" v-model="verifyPassword"></custom-input>
          <b-button variant="primary" class="mt-3" @click="signIn">Sign up</b-button>
          <span class="mt-4">Already have an account? <b-link to="sign-in">Sign in!</b-link></span>
        </b-input-group>

      </template>
    </b-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Api from '@/helper'
import CustomInput from '@/components/CustomInput.vue'
export default Vue.extend({
  name: 'SignUp',
  components: {
    CustomInput
  },
  data () {
    return {
      email: '',
      username: '',
      password: '',
      verifyPassword: ''
    }
  },
  methods: {
    signIn () {
      Api.user.signUpCreate({ email: this.email, username: this.username, password: this.password, role: 'Client' })
      this.$router.push({ name: 'Sign In' })
    }
  }
})
</script>
