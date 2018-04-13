import Vue from 'vue'
import Router from 'vue-router'
import Reg from '../views/reg'
import Login from '../views/login'
import MobileCheck from '../components/mobile-check'
import SmsCodeCheck from '../components/smscode-check'
import AdminLogin from '../components/manage/admin-login'
// import Article from '../views/articles'
import Manage from '@/views/manage/index'
import menus from '@/config/menu-config'
Vue.use(Router)

var manageSubRouters = [{
  path: `/`,
  component: AdminLogin
}]
menus.forEach((item) => {
  item.sub.forEach((sub) => {
    manageSubRouters.push({
      path: `${sub.path}`,
      name: sub.name,
      component: () => import(`@/components/manage/${sub.componentName}`)
    })
  })
})

console.log(manageSubRouters)

var routes = [
  {
    path: '/',
    name: 'Home',
    component: Reg
  },
  {
    path: '/reg',
    name: 'Reg',
    component: Reg
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
  },
  {
    path: '/moji-admin',
    name: 'Manage',
    component: Manage,
    children: manageSubRouters
  }
]

console.log(routes)

export default new Router({
  mode: 'history',
  routes
})
