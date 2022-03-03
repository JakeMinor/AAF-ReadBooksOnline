<template>
  <div class="vh-100 d-flex align-items-center justify-content-center">
    <b-card class="w-50" title="Sign up to ReadBooks Online">
      <template #default>
        <b-input-group class="flex-column p-3">
          <custom-input id="Email" label="Email" v-model="email" rules="required|email" @keypress.enter="signUp"></custom-input>
          <custom-input id="Username" label="Username" v-model="username" class="mt-3" rules="required" @keypress.enter="signUp"></custom-input>
          <custom-input id="Password" label="Password" type="password" v-model="password" class="mt-3" rules="required" @keypress.enter="signUp"></custom-input>
          <b-button id="SignUp" variant="primary" class="mt-3" @click="signUp">Sign up</b-button>
          <span class="mt-4">Already have an account? <b-link id="SignIn" to="sign-in" class="link">Sign in!</b-link></span>
        </b-input-group>
      </template>
    </b-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { api } from '@/helper'
import CustomInput from '@/components/CustomInput.vue'
import { ValidationObserver } from "vee-validate";
export default Vue.extend({
  name: 'SignUp',
  components: {
    CustomInput
  },
  data () {
    return {
      email: '', // The Email of the users account.
      username: '', // The Username for the users account.
      password: '' // The Password for the users account.
    }
  },
  methods: {
    /**
     * Signs the user up to the system.
     */
    async signUp () {
      // Validate the data.
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      // Send the sign in credentials to the API.
      await api.user.signUpCreate({ email: this.email, username: this.username, password: this.password })
        // If successful, push the user to the sign in page.
        .then(() => { this.$router.push({ name: 'Sign In' }) })
        .catch(error => {
          // Catch any errors and display a toast informing the user.
          this.$bvToast.toast(error.message, {
            title: 'Error',
            variant: 'danger',
            solid: true
          })
        })
    }
  }
})
</script>
