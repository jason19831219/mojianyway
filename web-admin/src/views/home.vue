<template>
  <el-row>
    <el-col :span="8" v-for="(o, index) in 2" :key="o" :offset="index > 0 ? 2 : 0">
      <el-card :body-style="{ padding: '0px' }">
        <img src="" class="image">
        <v-touch class="pos" v-on:panstart="onPanStart" v-on:panmove="onPanMove" v-on:panend="onPanEnd">
          <p :style="[position]" :data-left="position.left" :data-top="position.top">asdfasd</p>
        </v-touch>
        <div style="padding: 14px;">
          <span>好吃的汉堡</span>
          <div class="bottom clearfix">
            <time class="time"></time>
            <el-button type="text" class="button">操作按钮</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>

export default {

  name: 'home',
  data () {
    return {
      show: true,
      count: 0,
      position: {
        left: '0px',
        top: '0px'
      },
      originalposition: {
        left: '0',
        top: '0'
      }
    }
  },
  computed: {
  },
  methods: {
    onPanStart (data) {
      // this.originalposition.left = this.position.left
      // this.originalposition.top = this.position.top
      // console.log(this.originalposition.left + '  ' + this.originalposition.top)
      console.log(this.originalposition.left + '  ' + this.originalposition.top)
      console.log('start')
    },
    onPanMove (data) {
      this.position.left = (this.originalposition.left + data.deltaX) + 'px'
      this.position.top = (this.originalposition.top + data.deltaY) + 'px'
      console.log(this.position.left + '  ' + this.position.top)
    },
    onPanEnd (data) {
      this.originalposition.left = parseInt(this.position.left)
      this.originalposition.top = parseInt(this.position.top)
      console.log(this.originalposition.left + '  ' + this.originalposition.top)

      console.log('end')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  p{
    position: absolute;
  }
  .pos{
    position: relative;
  }
  .pos p{
    position: absolute;
  }
</style>
