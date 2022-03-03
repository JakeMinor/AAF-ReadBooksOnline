<template>
<div class="vh-100 d-flex align-items-center justify-content-center">
    <b-card class="w-50" title="Sign in to ReadBooks Online">
      <b-alert variant="danger" v-if="error">{{ error }}</b-alert>

      <template #default>
        <b-input-group class="flex-column p-3" id="SignInInputs">
          <ValidationObserver ref="observer">
            <custom-input id="Email" label="Email" v-model="email" rules="required|email" @keypress.enter="signIn"></custom-input>
            <custom-input id="Password" label="Password" type="password" v-model="password" rules="required" class="mt-3" @keypress.enter="signIn"></custom-input>
          </ValidationObserver>
          <b-button id="SignIn" variant="primary" class="mt-3" @click="signIn">Sign in</b-button>
          <span class="mt-4">New here? <b-link id="SignUp" to="sign-up" class="link">Sign up!</b-link></span>
        </b-input-group>
      </template>
    </b-card>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CustomInput from '@/components/CustomInput.vue'
import { ValidationObserver } from 'vee-validate'
import { api } from '@/helper'
export default Vue.extend({
  name: 'Login',
  components: {
    CustomInput,
    ValidationObserver
  },
  data () {
    return {
      email: '' as string, // The Email of the users account.
      password: '' as string, // The Password for the users account.
      error: '' // Any validation errors which may occur.
    }
  },
  methods: {
    /**
     * Authenticates the user in the system.
     */
    async signIn () {
      // Validate the data.
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }

      // Send the sign in credentials to the API.
      api.user.signInCreate({ email: this.email, password: this.password }).then(() => {
        // If successful, push the user to the catalog page.
        this.$router.push({ name: 'Catalog' })
      }).catch(error => {
        // Catch any errors and display a toast informing the user.
        this.$bvToast.toast(error.message, {
          title: 'Invalid email or password',
          variant: 'danger',
          solid: true
        })
      })
    }
  }
})
</script>
