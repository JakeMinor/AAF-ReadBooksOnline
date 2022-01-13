// import axios from 'axios'
// import Vue from 'vue'
// import VueFlashMessage from 'vue-flash-message'
// import 'vue-flash-message/dist/vue-flash-message.min.css'
//
// Vue.use(VueFlashMessage, {
//   messageOptions: {
//     timeout: 3000,
//     pauseOnInteract: true
//   }
// })
//
// const vm = new Vue()
// const baseUrl = 'http://localhost:3000/'
//
// const errorHandler = fn => (...params : String[]) =>
//   fn(...params).catch((error :) => {
//     vm.flash(`${error.response.status}: ${error.response.statusText}`, 'error')
//   })
//
// export const request = {
//   getAll: errorHandler(async () => {
//     return (await axios.get(`${baseUrl}/request/`)).data
//   })
// }
