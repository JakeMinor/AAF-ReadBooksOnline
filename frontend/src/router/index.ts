import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import BookRequests from '@/views/BookRequests.vue'
import SignIn from '@/views/SignIn.vue'
import SignUp from '@/views/SignUp.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/sign-in'
  },
  {
    path: '/book-requests',
    name: 'Book Requests',
    component: BookRequests
  },
  {
    path: '/sign-in',
    name: 'Sign In',
    component: SignIn
  },
  {
    path: '/sign-up',
    name: 'Sign Up',
    component: SignUp
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
