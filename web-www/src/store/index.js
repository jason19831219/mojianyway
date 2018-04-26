/**
 * @file store index
 * @author dora(doramart@qq.com)
 */

import Vue from 'vue'
import Vuex from 'vuex'
import User from './modules/user'
import Admin from './modules/admin'
import Moji from './modules/moji'
import MojiSet from './modules/mojiSet'
import Article from './modules/article'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    client: {
      namespaced: true,
      modules: {
        user: User
      }
    },
    server: {
      namespaced: true,
      modules: {
        admin: Admin,
        moji: Moji,
        mojiSet: MojiSet,
        article: Article
      }
    }
  }
})
