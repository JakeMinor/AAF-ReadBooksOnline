<template>
  <div class="mb-4 shadow-sm">
    <b-navbar class="navbar">
      <h2 class="m-0">ReadBooks Online</h2>
      <b-collapse is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right class="font-spectral font-color-white">
            <template #button-content>
              {{ user.username }}
            </template>
            <b-dropdown-item v-if="isAuthoriser">Admin</b-dropdown-item>
            <b-dropdown-item @click="signOut">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div class="navbar-links" >
      <router-link class="pl-1 pr-3" to="/catalog">Catalog</router-link>
      <router-link v-if="isClient"  to="/my-requests">My Requests</router-link>
      <router-link class="pl-1 pr-3" v-if="isEmployee" to="/employee-requests">Requests</router-link>
      <router-link class="pl-1 pr-3" v-if="isAuthoriser" to="#">Review Requests</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import store from '../store/index'
import { api } from '@/helper'
export default Vue.extend({
  name: 'NavigationBar',
  computed: {
    user () {
      return store.getters['user/user']
    },
    isClient () {
      return (store.getters['user/user'].role === 'Client')
    },
    isEmployee () {
      return (store.getters['user/user'].role === 'Employee')
    },
    isAuthoriser () {
      return (store.getters['user/user'].role === 'Authoriser')
    }
  },
  methods: {
    async signOut () {
      await api.user.signOutCreate()
      await this.$store.dispatch('user/deleteToken')
      await this.$router.push({ name: 'Sign In' })
    }
  }
})
</script>
