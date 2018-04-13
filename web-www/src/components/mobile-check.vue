<template>
  <el-form :model="mobileForm" :rules="mobileFormRule" ref="mobileForm">
    <el-form-item label="手机号" prop="mobile">
      <el-input type="number" v-model="mobileForm.mobile" auto-complete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="mobileCheck('mobileForm')">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {createNamespacedHelpers} from 'vuex'
import api from '@/api'

const {mapState} = createNamespacedHelpers('client/user')

export default {

  name: 'login',
  data () {
    return {}
  },
  computed: {
    ...mapState([
      'mobileForm',
      'mobileFormRule'
    ])
  },
  methods: {
    mobileCheck (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api
            .post('users/mobileCheck', this.mobileForm)
            .then(response => {
              if (response.data.state === 'success') {
                this.$message({
                  message: response.data.message,
                  type: 'success',
                  onClose: () => {
                    if (response.data.message === '用户已存在') {
                      this.$router.push({path: '/reg-sms-check', query: this.mobileForm})
                    }
                  }
                })
              } else {
                this.$message({
                  type: 'error',
                  message: response
                })
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
