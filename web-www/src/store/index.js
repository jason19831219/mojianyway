/**
 * @file store index
 * @author dora(doramart@qq.com)
 */

import Vue from 'vue'
import Vuex from 'vuex'
import Article from './modules/article'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    article: Article
  }
})
