<template xmlns:v-validate="http://www.w3.org/1999/xhtml">
  <!--<Toast :toastshow.sync="toastshow" :toasttext="toasttext"></Toast>-->
  <!--<validator name="validation_register1">-->
  <!--<div class="hello">-->
  <!--<h1>{{ msg }}</h1>-->
  <!--<input @invalid="telonInvalid" initial="off" detect-change="off" v-model="telphone" id="telphone" type="tel" class='phone-number' v-validate:telphone="['tel']"  placeholder='请输入手机号码'>-->
  <!--<button v-show="show" @click="getSmsCode">获取验证码</button>-->
  <!--<button v-show="!show" class="count">{{count}} s</button>-->
  <!--<p>-->
  <!--<input type="text" id="smscode" v-model="smscode">-->
  <!--<button v-show="show" @click="getSmsCode">登录</button>-->
  <!--<button v-show="!show" class="count">{{count}} s</button>-->
  <!--</p>-->
  <!--</div>-->
  <!--</validator>-->

  <!--<validator name="validation">-->
  <!--<input type="text" v-model='comment' id='comment' v-validate:comment="{ minlength: 3, maxlength: 15 }">-->
  <!--<div>-->
  <!--<span v-show="$validation.comment.minlength">不得少于3个字符</span>-->
  <!--<span v-show="$validation.comment.maxlength">不得大于15个字符</span>-->
  <!--</div>-->
  <!--</validator>-->

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
      <el-button @click="doReg('regForm')">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {mapGetters} from 'vuex'
import api from '../api'

export default {

  name: 'reg',
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
      // var mobilenumber = this.regForm.mobile
      this.$refs[formName].validateField('mobile', ref => {
        if (!ref) {
          let params = { mobile: this.regForm.mobile }
          api
            .post('users/getSmsCode', params)
            .then(result => {
              if (result.data.state === 'success') {
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
    doReg (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = this.regForm
          api
            .post('users/doReg', params)
            .then(result => {
              if (result.data.state === 'success') {
                localStorage.setItem('MOJI_TOKEN', result.token)
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
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

</style>
