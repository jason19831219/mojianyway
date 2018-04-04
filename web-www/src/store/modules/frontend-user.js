import api from '../../api'
import validatorUtil from '../../utils/validation'

const state = () => ({
  regForm: {
    mobile: '',
    smsCode: ''
  },
  regRule: {
    mobile: [
      {validator: validateMobile, trigger: 'blur'}
    ],
    smsCode: [
      {validator: validateSmsCode, trigger: 'blur'}
    ]
  // },
  // userList: {
  //   userInfo: {}
  // },
  // sessionState: {
  //   userInfo: {},
  //   logined: false
  // },
  // loginForm: {
  //   email: '',
  //   password: ''
  // },
  // regForm: {
  //   userName: '',
  //   email: '',
  //   password: '',
  //   confirmPassword: ''
  // },
  // userNotices: {
  //   docs: [],
  //   pageInfo: {}
  // },
  // userReplies: {
  //   docs: [],
  //   pageInfo: {}
  // },
  // userContents: {
  //   docs: [],
  //   pageInfo: {}
  // },
  // content: {
  //   formState: {
  //     edit: false,
  //     formData: {
  //       title: '',
  //       stitle: '',
  //       type: '',
  //       categories: [],
  //       sortPath: '',
  //       tags: [],
  //       keywords: '',
  //       sImg: '',
  //       discription: '',
  //       author: {},
  //       state: true,
  //       isTop: 0,
  //       clickNum: 0,
  //       comments: '',
  //       markDownComments: '',
  //       commentNum: 0,
  //       likeNum: 0,
  //       likeUserIds: '',
  //       from: '3'
  //     }
  //   },
  //   contentList: {
  //     pageInfo: {},
  //     docs: []
  //   },
  //   addContent: {
  //     state: '',
  //     err: {}
  //   }
  }
})

var validateMobile = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else {
    if (!validatorUtil.checkPhoneNum(value)) {
      callback(new Error('请输入正确的手机号'))
    }
    callback()
  }
}
var validateSmsCode = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机验证码'))
  } else {
    if (!validatorUtil.checkSmsCode(value)) {
      callback(new Error('请输入正确的手机验证码'))
    }
    callback()
  }
}

const mutations = {

  GETSmsCode (state, phoneNum) {
    console.log(phoneNum)
  },

  ReceiveSmsCode (state, { userInfo }) {
    console.log(state, userInfo)
  },

  UPTATEMobile (state, phoneNum) {
    state.mobile.phoneNum = phoneNum
  }

  // 'getUserList' (state, { userInfo }) {
  //   state.userList = {
  //     userInfo
  //   }
  // },
  // 'recevieSessionState' (state, { userInfo, logined }) {
  //   state.sessionState = {
  //     userInfo, logined
  //   }
  // },
  // 'getMobilrCode' (state, { formData }) {
  //   state.mobileNo = Object.assign({
  //     phoneNum: ''
  //   }, formData)
  // },
  // 'recevieUserLoginForm' (state, { formData }) {
  //   state.loginForm = Object.assign({
  //     email: '',
  //     password: ''
  //   }, formData)
  // },
  // 'recevieUserRegForm' (state, { formData }) {
  //   state.regForm = Object.assign({
  //     userName: '',
  //     email: '',
  //     password: '',
  //     confirmPassword: ''
  //   }, formData)
  // },
  // 'recevieUserNotices' (state, noticelist) {
  //   state.userNotices = noticelist
  // },
  // 'recevieUserReplies' (state, replylist) {
  //   state.userReplies = replylist
  // },
  // 'recevieUserContents' (state, contentlist) {
  //   state.userContents = contentlist
  // },
  // 'showContentForm' (state, formState) {
  //   state.content.formState.edit = formState.edit
  //   state.content.formState.formData = Object.assign({
  //     title: '',
  //     stitle: '',
  //     type: '',
  //     categories: [],
  //     sortPath: '',
  //     tags: [],
  //     keywords: '',
  //     sImg: '',
  //     discription: '',
  //     author: {},
  //     state: true,
  //     isTop: 0,
  //     clickNum: 0,
  //     comments: '',
  //     markDownComments: '',
  //     commentNum: 0,
  //     likeNum: 0,
  //     likeUserIds: '',
  //     from: '3'
  //   }, formState.formData)
  // }
}

const actions = {
  // async getSmsCode ({commit}, value) {
  //   const { data } = await api.post('users/getsmscode', { mobile: value })
  //   if (data.state === 'success') {
  //     commit('GETSmsCode', {
  //       ...data
  //     })
  //   }
  // },
  async getSmsCode ({ commit }, value) {
    const { data } = await api.post('users/getSmsCode', { mobile: value })
    if (data.state === 'success') {
      commit('ReceiveSmsCode', {
        ...data
      })
    }
  },
  async doReg ({ commit }, value) {
    const { data } = await api.post('users/doReg', { mobile: value })
    if (data.state === 'success') {
      commit('ReceiveSmsCode', {
        ...data
      })
    }
  }
  // async 'getSessionState' ({ commit, state }, config) {
  //   const { data } = await api.get('users/session')
  //   if (data.state === 'success') {
  //     commit('recevieSessionState', {
  //       ...config,
  //       ...data
  //     })
  //   }
  // },
  // async 'getMobilrCode' ({commit}, params) {
  //   commit('getMobilrCode', {
  //     ...params
  //   })
  // },
  // async 'regForm' ({commit}, params) {
  //   commit('recevieUserRegForm', {
  //     ...params
  //   })
  // },
  // async 'userNotices' ({
  //   commit
  // }, params) {
  //   const { data } = await api.get('users/getUserNotifys')
  //   commit('recevieUserNotices', data)
  // },
  // async 'userReplies' ({
  //   commit
  // }, params) {
  //   const { data } = await api.get('users/getUserReplies')
  //   commit('recevieUserReplies', data)
  // },
  // async 'userContents' ({
  //   commit
  // }, params) {
  //   const { data } = await api.get('users/getUserContents')
  //   commit('recevieUserContents', data)
  // },
  // async 'contentForm' ({
  //   commit
  // }, params) {
  //   commit('showContentForm', {
  //     edit: params.edit,
  //     formData: params.formData
  //   })
  // }
}

const getters = {
  'regForm' (state) {
    return state.regForm
  },
  'regRule' (state) {
    return state.regRule
    // 'getUserList' (state) {
    //   return state.userList
    // },
    // 'getSessionState' (state) {
    //   return state.sessionState
    // },
    // 'loginForm' (state) {
    //   return state.loginForm
    // },
    // 'loginForm' (state) {
    //   return state.loginForm
    // },
    // 'regForm' (state) {
    //   return state.regForm
    // },
    // 'noticelist' (state) {
    //   return state.userNotices
    // },
    // 'replylist' (state) {
    //   return state.userReplies
    // },
    // 'contentlist' (state) {
    //   return state.userContents
    // },
    // 'contentFormState' (state) {
    //   return state.content.formState
  }
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
