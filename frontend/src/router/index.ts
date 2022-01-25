import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Catalog from '@/views/Catalog.vue'
import BookRequests from '@/views/BookRequests.vue'
import SignIn from '@/views/SignIn.vue'
import SignUp from '@/views/SignUp.vue'
import Error from '@/views/Error.vue'
import store from '@/store/index'
import EmployeeRequests from '@/views/EmployeeRequests.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/catalog'
  },
  {
    path: '/my-requests',
    name: 'My Requests',
    component: BookRequests,
    meta: {
      roles: ['Client']
    }
  },
  {
    path: '/employee-requests',
    name: 'Employee',
    component: EmployeeRequests
  },
  {
    path: '/catalog',
    name: 'Catalog',
    component: Catalog
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
  },
  {
    path: '/error',
    name: 'Error',
    component: Error
  },
  {
    path: '*',
    redirect: '/error'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  console.log(to.name)
  console.log(document.cookie)
  if (document.cookie !== '') {
    const token = document.cookie.split('%20')[1]
    store.dispatch('user/getUser', token).then(() => next())

    if ((to.name === 'Sign In' || to.name === 'Sign Up') && store.getters['user/token'] !== '') {
      next({ name: 'Catalog' })
    }

    if (to.meta && Object.keys(to.meta).length !== 0) {
      if (!to.meta.roles.includes(store.getters['user/user'].role)) {
        next({ name: 'Error' })
      }
    }
    next()
  } else if ((to.name === 'Sign In' || to.name === 'Sign Up')) {
    next()
  } else {
    next({ name: 'Sign In' })
  }
})

export default router
