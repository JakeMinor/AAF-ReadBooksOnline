<template>
  <div class="mb-4 shadow-sm">
    <b-navbar class="navbar">
      <h2 class="m-0">ReadBooks Online</h2>
      <b-collapse is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right @toggle="getNotifications">
            <template #button-content>
              Notifications ({{count}})
            </template>
            <b-dropdown-item v-for="notification in notis" :key="notification._id">
              <div class="d-flex">
                <span>{{ notification.message}}</span>
                <b-icon-x @click="dismissNotification(notification._id)"/>
              </div>
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown right class="font-spectral font-color-white">
            <template #button-content>
              {{ user.username }}
            </template>
            <b-dropdown-item v-if="isAdmin" :to="{ name: 'Admin' }">Admin</b-dropdown-item>
            <b-dropdown-item v-if="isAdmin" :to="{ name: 'Statistics Dashboard' }">Statistics</b-dropdown-item>
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
import { mapState } from 'vuex'
import { Notification } from '@/api/api'

export default Vue.extend({
  name: 'NavigationBar',
  data () {
    return {
      notifications: [] as Notification[],
      count: 0
    }
  },
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
    },
    ...mapState(['user/user']),
    notis () {
      return this.$data.notifications
    }
  },
  methods: {
    async signOut () {
      await api.user.signOutCreate().catch(error => {
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })
      await this.$store.dispatch('user/deleteToken')
      await this.$router.push({ name: 'Sign In' })
    },
    async dismissNotification (id : string) {
      await api.notification.notificationDelete(id)
      this.$data.notifications = (await api.user.notificationsDetail(store.getters['user/user'].id).catch(error => {
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })).data
      this.$data.count = this.$data.notifications.length
    },
    async getNotifications () {
      this.$data.notifications = (await api.user.notificationsDetail(store.getters['user/user'].id).catch(error => {
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })).data
      this.$data.count = this.$data.notifications.length
    }
  }
})
</script>
