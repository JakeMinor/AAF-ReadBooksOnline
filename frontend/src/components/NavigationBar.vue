<template>
  <div class="mb-4 shadow-sm" v-if="!hide">
    <b-navbar class="navbar">
      <h2 class="m-0">ReadBooks Online</h2>
      <b-collapse is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right @toggle="getNotifications">
            <template #button-content>
              Notifications ({{ notificationCount }})
            </template>
            <b-dropdown-item v-for="notification in userNotifications" :key="notification._id">
              <div class="d-flex" @click="dismissNotification(notification._id)">
                <span>{{ notification.message}}</span>
                <b-icon-x @click="dismissNotification(notification._id)"/>
              </div>
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown right class="font-spectral font-color-white" id="Username">
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
import { Notification } from '@/api/api'

export default Vue.extend({
  name: 'NavigationBar',
  data () {
    return {
      notifications: [] as Notification[], // Array of the users notifications.
      count: 0 // The total count of the notifications.
    }
  },
  computed: {
    /**
     * Get the user from the store.
     */
    user () {
      return store.getters['user/user']
    },
    /**
     * Checks if the user is an authoriser.
     */
    isAuthoriser () {
      return store.getters['user/isAuthoriser']
    },
    /**
     * Checks if the user is an employee.
     */
    isEmployee () {
      return store.getters['user/isEmployee']
    },
    /**
     * Checks if the user is a client.
     */
    isClient () {
      return store.getters['user/isClient']
    },
    /**
     * Checks if the user is an admin, allows access to the user management and site config.
     */
    isAdmin () {
      return store.getters['user/isAdmin']
    },
    /**
     * Gets the users notifications from the store.
     */
    userNotifications () {
      return store.getters['user/notifications'].notifications
    },
    /**
     * Gets the notification count from the store.
     */
    notificationCount () {
      return store.getters['user/notifications'].count
    },
    /**
     * Hides the modal if the user is on the sign in or sign up page.
     */
    hide () {
      return (this.$route.name === 'Sign In' || this.$route.name === 'Sign Up')
    }
  },
  methods: {
    /**
     * Signs the user out.
     */
    async signOut () {
      // Makes a call to the API to sign the user out.
      await api.user.signOutCreate().catch(error => {
        // Catch any errors and display a toast informing the user.
        this.$bvToast.toast(error.message, {
          title: 'Error',
          variant: 'danger',
          solid: true
        })
      })

      // Deletes the authentication token.
      await this.$store.dispatch('user/deleteToken')

      // Redirects the user to the sign in page.
      await this.$router.push({ name: 'Sign In' })
    },
    /**
     * Deletes a notification.
     * @param id - The ID of the notification which is to be deleted.
     */
    async dismissNotification (id : string) {
      // Makes a call to delete the notification.
      await api.notification.notificationDelete(id)

      // Update the list of notifications.
      await store.dispatch('user/getNotifications')
    },
    /**
     * Gets an updated list of the users notifications.
     */
    async getNotifications () {

      await store.dispatch('user/getNotifications')
    }
  },
  /**
   * Created hook which gets the users notifications.
   */
  async created () {
    await store.dispatch('user/getNotifications')
  }
})
</script>
