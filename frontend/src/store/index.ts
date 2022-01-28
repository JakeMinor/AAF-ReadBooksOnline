import Vue from 'vue'
import Vuex from 'vuex'
import { getPayload } from '@/helper'
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
        parseUser (state, payload) {
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
        }
      },
      actions: {
        getUser ({ commit }, token : string) {
          commit('setToken', token)
          commit('parseUser', getPayload(token))
        },
        deleteToken ({ commit }) {
          commit('deleteToken')
        }
      },
      getters: {
        user: state => state.user,
        token: state => state.token,
        isClient: state => state.user.roles?.some((role: Role) => role.name === 'Client'),
        isEmployee: state => state.user.roles?.some((role: Role) => role.name === 'Employee'),
        isAuthoriser: state => state.user.roles?.some((role: Role) => role.name === 'Authoriser'),
        isAdmin: state => state.user.roles?.some((role : Role) => role.name === 'UserManager')
      }
    }
  }
})
