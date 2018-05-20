import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/login/Login'
import Register from '@/components/Register/Register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
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
    }
  ],
  mode: 'history'
})
