import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main/Main'
import Login from '@/components/login/Login'
import Register from '@/components/Register/Register'
import Admin from '@/components/Admin/Admin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/main',
      name: 'main',
      component: Main,
      meta: {
        for_auth: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: {
        for_guest: true
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: {
        for_guest: true
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: {
        for_auth: true
      }
    }
  ],
  linkActiveClass: 'active',
  mode: 'history'
})
