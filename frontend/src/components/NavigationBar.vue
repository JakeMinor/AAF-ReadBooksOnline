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
            <b-dropdown-item v-if="isAdmin" :to="{ name: 'Admin' }">Admin</b-dropdown-item>
            <b-dropdown-item @click="signOut">Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <div class="navbar-links" >
      <router-link class="ml-1 mr-3 align-self-center" :to="{ name: 'Catalog' }">Catalog</router-link>
      <b-nav-item-dropdown text="Requests" class="list-unstyled font-color-black">
        <b-dropdown-item :to="{ name: 'ClientRequests' }" v-if="isClient">Requests</b-dropdown-item>
        <b-dropdown-item :to="{ name: 'EmployeeRequests' }" v-if="isEmployee">Work on Requests</b-dropdown-item>
        <b-dropdown-item :to="{ name: 'AuthoriserRequests' }" v-if="isAuthoriser">Authorise Requests</b-dropdown-item>
      </b-nav-item-dropdown>
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
    isAuthoriser () {
      return store.getters['user/isAuthoriser']
    },
    isEmployee () {
      return store.getters['user/isEmployee']
    },
    isClient () {
      return store.getters['user/isClient']
    },
    isAdmin () {
      return store.getters['user/isAdmin']
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
