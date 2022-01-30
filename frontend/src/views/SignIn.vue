<template>
<div class="vh-100 d-flex align-items-center justify-content-center">
    <b-card class="w-50" title="Sign in to ReadBooks Online">
      <b-alert variant="danger" v-if="error">{{ error }}</b-alert>

      <template #default>
        <b-input-group class="flex-column p-3">
          <ValidationObserver ref="observer">
            <custom-input id="email" label="Email" v-model="email" rules="required|email"></custom-input>
            <custom-input label="Password" type="password" v-model="password" rules="required" class="mt-3"></custom-input>
          </ValidationObserver>
          <b-button variant="primary" class="mt-3" @click="signIn">Sign in</b-button>
          <span class="mt-4">New here? <b-link to="sign-up" class="link">Sign up!</b-link></span>
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
      email: '' as string,
      password: '' as string,
      error: ''
    }
  },
  methods: {
    async signIn () {
      const valid = await (this.$refs.observer as InstanceType<typeof ValidationObserver>).validate()
      if (!valid) {
        return
      }
      api.user.signInCreate({ email: this.email, password: this.password }).then(() => {
        this.$router.push({ name: 'Catalog' })
      }).catch(error => {
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
