import Vue from 'vue'
import Router from 'vue-router'
import Reg from '../views/reg'
import Login from '../views/login'
// import Article from '../views/articles'
import Manage from '@/views/manage/index'
import menus from '@/config/menu-config'
Vue.use(Router)

// export default new Router({
//   mode: 'history',
//   routes: [
//     {
//       path: '/',
//       name: 'Home',
//       component: Reg
//     },
//     {
//       path: '/reg',
//       name: 'Reg',
//       component: Reg
//     },
//     {
//       path: '/login',
//       name: 'Login',
//       component: Login
//     },
//     {
//       path: '/moji-admin',
//       name: 'Manage',
//       component: Manage,
//       children: [
//         {
//           path: '',
//           component: ManageMain
//         },
//         {
//           path: 'moji-upload',
//           component: ManageMojiUpload
//         }
//       ]
//     }
//   ]
// })
//
//
var manageSubRouters = []
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
