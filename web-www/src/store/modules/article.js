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
    imgSrc: [[]],
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
    state.list.forEach(function (value) {
      value.imgSrc.forEach(function (value, index, array) {
        array[index] = [(value[0].split(' '))[0]]
      })
    })
    console.log(state.list)
    state.listPageInfo = pageInfo
  },
  'HandleImageSuccess' (state, {index, path}) {
    if (!state.itemForm.imgSrc[index][0]) {
      state.itemForm.imgSrc.push([''])
    }
    state.itemForm.imgSrc.splice(index, 1, [path])
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
    state.itemForm.imgSrc.pop()
    const {data} = await api.post('article/addOne', {...state.itemForm}, true)
    if (data.state === 'success') {
      Message({
        message: '保存成功',
        type: 'success'
      })
    } else {
      Message({
        message: data.message,
        type: 'error'
      })
    }
  },
  async 'resetForm' ({commit, state}) {
    state.itemForm = {
      title: '',
      desc: '',
      author: '',
      authorAvatarSrc: '',
      imgSrc: [['']],
      fromSite: ''
    }
  },
  async 'updateOne' ({commit, state}) {
    console.log(state.itemForm.imgSrc)
    state.itemForm.imgSrc.forEach(function (value, index) {
      if (!value[0]) {
        console.log(index)
        state.itemForm.imgSrc.splice(index, 1)
      }
    })
    const {data} = await api.post('article/updateOne', {...state.itemForm}, true)
    if (data.state === 'success') {
      Message({
        message: '更新成功',
        type: 'success'
      })
    } else {
      Message({
        message: data.message,
        type: 'error'
      })
    }
  },
  async 'setForm' ({commit, state}, index) {
    state.itemForm = state.list[index]
    state.itemForm.author.replace(/\n/g, '').replace(/(^\s*)|(\s*$)/g, '')
    state.itemForm.imgSrc.push([])
  },
  async 'handleImageSuccess' ({commit, state}, data) {
    commit('HandleImageSuccess', {...data})
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
