import Vue from 'vue'
import Vuex from 'vuex'
import { getPayload, api } from '@/helper'
import { Role, User } from '@/api/api'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user: {
      namespaced: true, // Splits the store into modules.
      state: () => ({
        user: {} as User, // The current user that is signed in.
        notifications: [] as Notification[], // The current users notifications.
        notificationsCount: 0, // The total count of the current users notifications.
        token: '' // The current users authentication token.
      }),
      mutations: {
        /**
         * Saves the user data from the tokens payload into the store.
         */
        parseUser (state, payload) {
          state.user = {
            id: payload.id,
            username: payload.username,
            email: payload.email,
            roles: payload.roles
          } as User
        },
        /**
         * Saves the users authentication token into the store.
         */
        setToken (state, token) {
          state.token = token
        },
        /**
         * Saves the users notifications into the store.
         */
        setNotifications (state, notifications) {
          state.notifications = notifications
          state.notificationsCount = notifications.length
        },
        /**
         * Deletes the users authentication token from the store.
         */
        deleteToken (state) {
          state.token = ''
        }
      },
      actions: {
        /**
         * Triggers the Set Token and Parse User mutations.
         */
        getUser ({ commit }, token : string) {
          commit('setToken', token)
          commit('parseUser', getPayload(token))
        },
        /**
         * Gets the users notifications from the api and triggers the Set Notification mutation.
         */
        async getNotifications ({ commit }) {
          const id = this.getters['user/user'].id
          const notifications = await api.user.notificationsDetail(id)
          commit('setNotifications', notifications.data)
        },
        /**
         * Triggers the Delete Token mutation.
         */
        deleteToken ({ commit }) {
          commit('deleteToken')
        }
      },
      getters: {
        /**
         * Gets the users notifications from the store.
         */
        notifications: state => { return { notifications: state.notifications, count: state.notificationsCount } },
        /**
         * Gets the user from the store.
         */
        user: state => state.user,
        /**
         * Gets the users authentication token from the store.
         */
        token: state => state.token,
        /**
         * Checks if the user has the client role.
         */
        isClient: state => state.user.roles?.some((role: Role) => role.name === 'Client'),
        /**
         * Checks if the user has the employee role.
         */
        isEmployee: state => state.user.roles?.some((role: Role) => role.name === 'Employee'),
        /**
         * Checks if the user has the authoriser role.
         */
        isAuthoriser: state => state.user.roles?.some((role: Role) => role.name === 'Authoriser'),
        /**
         * Checks if the user has the user manager role.
         */
        isAdmin: state => state.user.roles?.some((role : Role) => role.name === 'UserManager')
      }
    }
  }
})
