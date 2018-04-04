/**
 * @file store index
 * @author dora(doramart@qq.com)
 */

import Vue from 'vue'
import Vuex from 'vuex'
import fontendUser from './modules/frontend-user'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    frontend: {
      namespaced: true,
      modules: {
        user: fontendUser
      }
    }
  }
})
