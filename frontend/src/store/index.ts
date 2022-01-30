import Vue from 'vue'
import Vuex from 'vuex'
import { getPayload, api } from '@/helper'
import { Role, User } from '@/api/api'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user: {
      namespaced: true,
      state: () => ({
        user: {} as User,
        token: ''
      }),
      mutations: {
        async parseUser (state, payload) {
          state.user = {
            id: payload.id,
            username: payload.username,
            email: payload.email,
            roles: payload.roles
          } as User
        },
        setToken (state, token) {
          state.token = token
        },
        deleteToken (state) {
          state.token = ''
        },
        setNotifications (state, notifications) {
          state.user.notifications = notifications
        }
      },
      actions: {
        async getUser ({ commit }, token : string) {
          commit('setToken', token)
          await commit('parseUser', getPayload(token))
        },
        deleteToken ({ commit }) {
          commit('deleteToken')
        },
        async getNotifications ({ commit }) {
          const notifications = (await api.user.notificationsDetail(this.getters['user/user'].id)).data
          commit('setNotifications', notifications)
        }
      },
      getters: {
        user: state => state.user,
        notifications: state => state.user.notifications,
        token: state => state.token,
        isClient: state => state.user.roles?.some((role: Role) => role.name === 'Client'),
        isEmployee: state => state.user.roles?.some((role: Role) => role.name === 'Employee'),
        isAuthoriser: state => state.user.roles?.some((role: Role) => role.name === 'Authoriser'),
        isAdmin: state => state.user.roles?.some((role : Role) => role.name === 'UserManager')
      }
    }
  }
})
