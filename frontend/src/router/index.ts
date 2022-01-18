import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import BookRequests from '@/views/BookRequests.vue'
import Login from '@/views/Login.vue'

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
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
