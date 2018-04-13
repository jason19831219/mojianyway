<template>
  <div class="contentContainer">
    <div class="mainbody">
      <el-row :gutter="10">
        <el-col :xs="1" :sm="1" :md="1" :lg="1" :xl="5">
          <div class="grid-content bg-purple">&nbsp;</div>
        </el-col>
        <el-col :xs="22" :sm="22" :md="22" :lg="22" :xl="14" class="login-main">
          <div class="login-box">
            <el-form label-position="top" :model="adminLoginForm" :rules="adminLoginRule" ref="adminLoginForm" label-width="0px" class="demo-ruleForm login-container">
              <h3 class="title">
                <span>注册</span>
              </h3>
              <el-form-item prop="userName" label="用户名">
                <el-input placeholder="请填写用户名" v-model="adminLoginForm.userName"></el-input>
              </el-form-item>
              <el-form-item prop="password" label="密码">
                <el-input placeholder="请输入密码" type="password" v-model="adminLoginForm.password"></el-input>
              </el-form-item>
              <el-form-item class="submit-btn">
                <el-button  type="primary" @click="login('adminLoginForm')">登录</el-button>
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
import {createNamespacedHelpers} from 'vuex'
const {mapState} = createNamespacedHelpers('server/admin')

export default {
  name: 'adminAdd',
  metaInfo () {
    return {
      title: '管理员注册'
    }
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
      'adminLoginForm',
      'adminLoginRule'
    ])
  },
  methods: {
    login (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = this.adminLoginForm
          api
            .post('admin/login', params, true)
            .then(result => {
              if (result.data.state === 'success') {
                this.$message({
                  message: '登录成功',
                  type: 'success',
                  onClose: () => {
                    window.location = '/moji-admin/moji-list'
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
