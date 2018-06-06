<template>
  <el-form :model="regForm" status-icon :rules="this.regRule" ref="regForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="手机号" prop="mobile">
      <el-input type="number" v-model="regForm.mobile" auto-complete="off"></el-input>
      <el-button v-show="show" type="primary" @click="getSmsCode('regForm')">获取验证码</el-button>
      <el-button v-show="!show">{{count}} s</el-button>
    </el-form-item>
    <el-form-item label="验证码" prop="smsCode">
      <el-input type="number" v-model="regForm.smsCode" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="getToken('regForm')">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {mapGetters} from 'vuex'
import api from '../api'

export default {

  name: 'login',
  data () {
    return {
      show: true,
      count: 0
    }
  },
  computed: {
    ...mapGetters({
      regForm: 'frontend/user/regForm',
      regRule: 'frontend/user/regRule'
    })
  },
  methods: {
    getSmsCode (formName) {
      var mobile = this.$route.query.mobile
      console.log(mobile)
      this.$refs[formName].validateField('mobile', ref => {
        if (!ref) {
          let params = { mobile: this.regForm.mobile }
          api
            .post('users/getSmsCode', params)
            .then(result => {
              if (result.data.state === 'success') {
              } else {
                this.$message({
                  message: result.data.message,
                  type: 'error'
                })
              }
            })
            .catch(err => {
              this.$message.error(err.response.data.error)
            })
        }
      })
    },
    getToken (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = this.regForm
          api
            .post('users/auth', params)
            .then(result => {
              if (result.data.state === 'success') {
                localStorage.setItem('MOJI_ANYWAY_TOKEN', result.data.token)
                this.$message({
                  message: result.data.message,
                  type: 'success'
                  // onClose: () => {
                  //   window.location = '/'
                  // }
                })
              } else {
                this.$message({
                  message: result.data.message,
                  type: 'error'
                })
              }
            })
            .catch(err => {
              this.$message.error(err.response.data.error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
