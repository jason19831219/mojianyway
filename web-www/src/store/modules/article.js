import api from '@/api'
import { Message } from 'element-ui'
// import validatorUtil from '@/utils/validation'
const state = () => ({
  msg: {
    type: 'success',
    content: '',
    count: 0
  },
  list: [],
  listPageInfo: {
    pageNumber: 1,
    pageSize: 10,
    totalItems: 0,
    nameReg: ''
  },
  itemForm: {
    title: '',
    desc: '',
    author: '',
    authorAvatarSrc: '',
    imgSrc: '',
    fromSite: ''
  },
  itemFormRule: {
    title: [
      {
        required: true,
        validator: (rule, value, callback) => {
          if (value === '') {
            callback(new Error('名字'))
          }
          callback()
        },
        trigger: 'blur'
      }
    ],
    imgSrc: [
      {
        required: true,
        trigger: 'blur'
      }
    ],
    author: [
      {
        trigger: 'blur'
      }
    ],
    desc: [
      {
        trigger: 'blur'
      }
    ]
  }
})

const mutations = {
  'receiveList' (state, {list, pageInfo}) {
    state.list = list
    state.listPageInfo = pageInfo
  }
}

const actions = {
  async 'getAll' ({commit, state}) {
    const {data} = await api.get('article/getAll', {...state.listPageInfo}, true)
    if (data.list && data.state === 'success') {
      commit('receiveList', {...data})
    }
  },
  async 'setPageSize' ({commit, dispatch, state}, val) {
    state.listPageInfo.pageSize = val
    dispatch('getAll')
  },
  async 'setPageNumber' ({commit, dispatch, state}, val) {
    state.listPageInfo.pageNumber = val
    dispatch('getAll')
  },
  async 'addOne' ({commit, state}) {
    const {data} = await api.post('article/addOne', {...state.itemForm}, true)
    if (data.state === 'success') {
      Message({
        message: '保存成功',
        type: 'success'
      })
    }
  }
}

const getters = {
  'list' (state) {
    return state.list
  },
  'listPageInfo' (state) {
    return state.listPageInfo
  },
  'itemForm' (state) {
    return state.itemForm
  },
  'itemFormRule' (state) {
    return state.itemFormRule
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
