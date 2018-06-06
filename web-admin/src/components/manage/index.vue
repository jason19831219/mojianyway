<template>
  <el-row class="tac">
    <el-col :span="24">
      <div>welcome</div>
    </el-col>
  </el-row>
</template>

<style scoped>
  .over-hide{
    overflow: hidden;
  }
</style>

<script>
import menu from '@/config/menu-config'

export default {
  data () {
    return {
      menu: menu
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  }
}
</script>
