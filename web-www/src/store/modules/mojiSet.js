const state = () => ({
  mojiSetList: [],
  mojiSetAddForm: {
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
}

const actions = {
}

const getters = {
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
