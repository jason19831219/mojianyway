import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login'
import MobileCheck from '../components/mobile-check'
import SmsCodeCheck from '../components/smscode-check'
import Home from '../views/home'
import VueTouch from 'vue-touch'

Vue.use(Router)
Vue.use(VueTouch, {name: 'v-touch'})

var routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/mobile-check',
    name: 'MobileCheck',
    component: MobileCheck
  },
  {
    path: '/reg-sms-check',
    name: 'SmsCodeCheck',
    component: SmsCodeCheck
  }
]

export default new Router({
  mode: 'history',
  routes
})
