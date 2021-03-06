import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main/Main'
import Login from '@/components/login/Login'
import Register from '@/components/Register/Register'
import Recovery from '@/components/Recovery/Recovery'
import Admin from '@/components/Admin/Admin'
import Tests from '@/components/Tests/Tests'
import CreateTest from '@/components/Tests/Teacher/CreateTest'
import Testing from '@/components/Tests/Student/Testing'

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
      path: '/recovery',
      name: 'recovery',
      component: Recovery,
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
    },
    {
      path: '/tests',
      name: 'tests',
      component: Tests,
      meta: {
        for_auth: true
      }
    },
    {
      path: '/tests/create',
      name: 'create-test',
      component: CreateTest,
      meta: {
        for_auth: true
      }
    },
    {
      path: '/tests/test/:id',
      name: 'test',
      component: CreateTest,
      meta: {
        for_auth: true,
        edit: true
      }
    },
    {
      path: '/tests/testing/:id',
      name: 'testing',
      component: Testing,
      meta: {
        for_auth: true
      }
    }
  ],
  linkActiveClass: 'active',
  mode: 'history'
})
