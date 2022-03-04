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

// The available routes for web app.
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
      role: 'Client' // Only accessible if the user is a client.
    }
  },
  {
    path: '/employee-requests',
    name: 'EmployeeRequests',
    component: EmployeeRequests,
    meta: {
      role: 'Employee' // Only accessible if the user is an employee.
    }
  },
  {
    path: '/authoriser-requests',
    name: 'AuthoriserRequests',
    component: AuthoriserRequests,
    meta: {
      role: 'Authoriser' // Only accessible if the user is an authoriser.
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
      role: 'UserManager' // Only accessible if the user is a user manager.
    }
  },
  {
    path: '/admin/statistics',
    name: 'Statistics Dashboard',
    component: StatDashboard,
    meta: {
      role: 'UserManager' // Only accessible if the user is a user manager.
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
  /**
   * Bounces any unrecognised routes to the error page.
   */
  {
    path: '*',
    redirect: '/error'
  }
]

// Creates an instance of Vue Router with the routes defined above.
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Checks the user has been authenticated and authorised before entering a route.
router.beforeEach((to, from, next) => {
  // Checks if the user has an access token set in the cookie.
  if (document.cookie !== '') {
    // Gets the access token from the cookie.
    const token = document.cookie.split('%20')[1]

    // Gets the user and their notifications from the store using the token.
    store.dispatch('user/getUser', token).then(() => next())
    store.dispatch('user/getNotifications').then(() => next())

    // Checks if the user has a token and that they arent going to the sign in or sign up page.
    if ((to.name === 'Sign In' || to.name === 'Sign Up') && store.getters['user/token'] !== '') {
      next({ name: 'Catalog' })
    }

    // Checks if the route is protected by a role.
    if (to.meta && Object.keys(to.meta).length !== 0) {
      // Redirects the user to the Error page if they dont have the required role to access the route.
      if (!store.getters['user/user'].roles.some((role : Role) => role.name === to.meta?.role)) {
        next({ name: 'Error' })
      }
    }
    next()
  } else if ((to.name === 'Sign In' || to.name === 'Sign Up')) { // Allows the user to access the sign in and sign up page if they are unauthenticated.
    next()
  } else { // Redirects the user to the sign in page if they are unauthenticated.
    next({ name: 'Sign In' })
  }
})

export default router
