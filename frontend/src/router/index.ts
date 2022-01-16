import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import BookRequests from '@/views/BookRequests.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/book-requests'
  },
  {
    path: '/book-requests',
    name: 'Book Requests',
    component: BookRequests
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
