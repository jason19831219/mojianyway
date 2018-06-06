<template>
  <el-form :model="smsForm" :rules="smsFormRule" ref="smsForm">
    <el-form-item label="验证码" prop="smsCode">
      <el-input type="number" v-model="smsForm.smsCode" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button v-show="show" @click="getSmsCode('smsForm')">发送验证码</el-button>
      <el-button v-show="!show">{{count}} s</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="doLogin('smsForm')">验证</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import api from '@/api'
const {mapState} = createNamespacedHelpers('client/user')

export default {

  name: 'smscode-check',
  data () {
    return {
      show: true,
      count: 0
    }
  },
  computed: {
    // 在 `some/nested/module` 中查找
    ...mapState([
      'jwt_local_name',
      'mobileForm',
      'smsForm',
      'smsFormRule'
    ])
  },
  methods: {
    getSmsCode (formName) {
      var mobile = this.$route.query.mobile
      console.log(mobile)
      this.$refs[formName].validate(valid => {
        var params = {
          mobile: mobile
        }
        if (valid) {
          api
            .get('users/getSmsCode', params)
            .then(response => {
              if (response.data.state === 'success') {
                const TIME_COUNT = 60
                if (!this.timer) {
                  this.count = TIME_COUNT
                  this.show = false
                  this.timer = setInterval(() => {
                    if (this.count > 0 && this.count <= TIME_COUNT) {
                      this.count--
                    } else {
                      this.show = true
                      clearInterval(this.timer)
                      this.timer = null
                    }
                  }, 1000)
                }
                console.log(response.data.message)
              } else {
                this.$message.error(response.data.message)
              }
            })
            .catch(err => {
              this.$message.error(err.response.data.error)
            })
        }
      })
    },
    doLogin (formName) {
      var mobile = this.$route.query.mobile
      console.log(mobile)
      this.$refs[formName].validate(valid => {
        var params = {
          mobile: mobile,
          smsCode: this.smsForm.smsCode
        }
        if (valid) {
          api
            .post('users/getAuth', params)
            .then(response => {
              if (response.data.state === 'success') {
                localStorage.setItem(this.jwt_local_name, response.data.token)
                console.log(response.data.message)
              } else {
                this.$message.error(response.data.message)
              }
            })
            .catch(err => {
              this.$message.error(err.response.data.error)
            })
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
