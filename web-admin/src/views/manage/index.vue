<template>
  <el-container>
    <el-header>Header</el-header>
    <el-container>
      <el-aside width="200px">
        <navmenu></navmenu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import NavMenu from '@/components/manage/NavMenu'
export default {
  name: 'index',
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
  },
  components: {
    'navmenu': NavMenu
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  body,
  header,
  section{
    background: white;
  }
</style>
