import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import { api } from './helper'
import VueApexCharts from 'vue-apexcharts'
import VueSocketIOExt from 'vue-socket.io-extended'
import './styles/style.scss'
import './validation'

import { io } from 'socket.io-client'

/**
 * Creates a connection to the API socket.
 */
const socket = io('http://localhost:3000')

Vue.use(VueApexCharts)
Vue.use(VueSocketIOExt, socket)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.config.productionTip = false

/**
 * Intercepts an axios requests and throws a Javascript error if the Axios requests reruns an error.
 */
api.instance.interceptors.response.use(response => response, (error) => {
  throw Error(error.response.data)
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
