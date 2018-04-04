<template>
  <div class="contentContainer">
    <div class="mainbody">
      <el-row :gutter="10">
        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="5">
          <div class="grid-content bg-purple">&nbsp;</div>
        </el-col>
        <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="14" class="login-main">
          <div class="login-box">
            <el-form label-position="top" :model="adminAddForm" :rules="regRules" ref="adminAddForm" label-width="0px" class="demo-ruleForm login-container">
              <h3 class="title">
                <span>注册</span>
              </h3>
              <el-form-item prop="userName" label="用户名">
                <el-input placeholder="请填写用户名" v-model="adminAddForm.userName"></el-input>
              </el-form-item>
              <el-form-item prop="password" label="密码">
                <el-input placeholder="请输入密码" type="password" v-model="adminAddForm.password"></el-input>
              </el-form-item>
              <el-form-item prop="confirmPassword" label="重复密码">
                <el-input placeholder="请确认密码" type="password" v-model="adminAddForm.passwordConfirmed"></el-input>
              </el-form-item>
              <el-form-item prop="mobile" label="手机号">
                <el-input placeholder="请填写手机号" v-model="adminAddForm.mobile"></el-input>
              </el-form-item>
              <el-form-item class="submit-btn">
                <el-button  type="primary" @click="submitRegForm('adminAddForm')">注册</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="5">
          <div class="grid-content bg-purple">&nbsp;</div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import validatorUtil from '@/utils/validation'

export default {
  name: 'adminAdd',
  metaInfo () {
    return {
      title: '管理员注册'
    }
  },
  data () {
    return {
      adminAddForm: {
        userName: '',
        password: '',
        passwordConfirmed: '',
        mobile: ''
      },
      regRules: {
        userName: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (!validatorUtil.checkUserName(value)) {
                callback(new Error('5-12个英文字符!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (!validatorUtil.checkPwd(value)) {
                callback(new Error('6-12位，只能包含字母、数字和下划线!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        passwordConfirmed: [
          {
            required: true,
            message: '请确认密码',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (value !== this.adminAddForm.password) {
                callback(new Error('两次输入密码不一致!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            message: '请确认手机号',
            trigger: 'blur'
          },
          {
            validator: (rule, value, callback) => {
              if (!validatorUtil.checkPhoneNum(value)) {
                callback(new Error('请确认正确的手机号!'))
              } else {
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submitRegForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = this.adminAddForm
          api
            .post('adminUser/addOne', params, true)
            .then(result => {
              if (result.data.state === 'success') {
                this.$message({
                  message: '恭喜，注册成功，请重新登录！',
                  type: 'success',
                  onClose: () => {
                    window.location = '/moji-admin'
                  }
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
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  beforeMount () {
    // this.$store.dispatch('simplePage');
  }
}
</script>

<style>

</style>
