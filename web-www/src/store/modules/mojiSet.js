import api from '@/api'
const state = () => ({
  mojiSetList: [],
  mojiSetListPageInfo: {
    pageNumber: 1,
    pageSize: 10,
    totalItems: 0,
    nameReg: ''
  },
  addForm: {
    name: '',
    desc: '',
    author: ''
  },
  mojiSetAddRule: {
    name: [
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
  'receiveMojiSetList' (state, {
    list,
    pageInfo
  }) {
    state.mojiSetList = list
    state.mojiSetListPageInfo = pageInfo
    console.log(state.mojiSetList)
  }
}

const actions = {
  async 'getMojiSetList' ({
    commit,
    state
  }) {
    console.log(state.mojiSetListPageInfo.pageSize)
    const {
      data
    } = await api.get('mojiSet/getList', {
      ...state.mojiSetListPageInfo
    }, true)
    if (data.list && data.state === 'success') {
      commit('receiveMojiSetList', {
        ...data
      })
    }
  },
  async 'setPageSize' ({
    commit,
    dispatch,
    state
  }, val) {
    state.mojiSetListPageInfo.pageSize = val
    dispatch('getMojiSetList')
  },
  async 'setPageNumber' ({
    commit,
    dispatch,
    state
  }, val) {
    state.mojiSetListPageInfo.setPageNumber = val
    dispatch('getMojiSetList')
  },
  async 'addMojiSetOne' ({
    commit,
    state
  }) {
    const {
      data
    } = await api.get('mojiSet/addOne', {
      ...state.mojiSetListPageInfo
    }, true)
    if (data.list && data.state === 'success') {
    }
  }
}

const getters = {
  'mojiSetList' (state) {
    return state.mojiSetList
  },
  'mojiSetListPageInfo' (state) {
    return state.mojiSetListPageInfo
  },
  'addForm' (state) {
    return state.addForm
  },
  'mojiSetAddRule' (state) {
    return state.mojiSetAddRule
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
