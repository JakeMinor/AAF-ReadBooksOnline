import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Catalog from '@/views/Catalog.vue'
import ClientRequests from '@/views/ClientRequests.vue'
import EmployeeRequests from '@/views/EmployeeRequests.vue'
import AuthoriserRequests from '@/views/AuthoriserRequests.vue'
import SignIn from '@/views/SignIn.vue'
import SignUp from '@/views/SignUp.vue'
import Error from '@/views/Error.vue'
import store from '@/store/index'
import UserManagement from '@/views/UserManagement.vue'
import StatDashboard from '@/views/StatDashboard.vue'
import { Role } from '@/api/api'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/catalog'
  },
  {
    path: '/client-requests',
    name: 'ClientRequests',
    component: ClientRequests,
    meta: {
      role: 'Client'
    }
  },
  {
    path: '/employee-requests',
    name: 'EmployeeRequests',
    component: EmployeeRequests,
    meta: {
      role: 'Employee'
    }
  },
  {
    path: '/authoriser-requests',
    name: 'AuthoriserRequests',
    component: AuthoriserRequests,
    meta: {
      role: 'Authoriser'
    }
  },
  {
    path: '/catalog',
    name: 'Catalog',
    component: Catalog
  },
  {
    path: '/admin',
    name: 'Admin',
    component: UserManagement,
    meta: {
      role: 'UserManager'
    }
  },
  {
    path: '/admin/statistics',
    name: 'Statistics Dashboard',
    component: StatDashboard,
    meta: {
      role: 'UserManager'
    }
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
  if (document.cookie !== '') {
    const token = document.cookie.split('%20')[1]
    store.dispatch('user/getUser', token).then(() => next())
    store.dispatch('user/getNotifications').then(() => next())
    if ((to.name === 'Sign In' || to.name === 'Sign Up') && store.getters['user/token'] !== '') {
      next({ name: 'Catalog' })
    }

    if (to.meta && Object.keys(to.meta).length !== 0) {
      if (!store.getters['user/user'].roles.some((role : Role) => role.name === to.meta?.role)) {
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
