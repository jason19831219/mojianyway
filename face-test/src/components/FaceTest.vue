<template>
    <div style="width: 100%; position:relative;">
        <div class="moji-upload-btn" id="moji-upload-btn">
            <x-icon v-if="!addForm.src" type="ios-plus-empty" class="avatar-uploader-icon"></x-icon>
            <img v-if="addForm.src" :src=addForm.src id="faceImg"/>

            <div id="fabricBox">
                <canvas id="fabricCanvas"></canvas>
            </div>
            <input @change="uploadImage" type="file" accept="image/*" name="image"/>
        </div>
        <div :model="detail.location"></div>
        <!--<div class="imgSrc">{{addForm.src}}</div>-->
        <div slot="footer" class="dialog-footer">
            <XButton class="primary-button" type="primary" @click.native="getFaceTest()">检测</XButton>
        </div>
        <loading :show="show1" text=""></loading>
    </div>
</template>

<script>
import api from '../../api'
import {AlertModule, XButton, Loading, TransferDomDirective as TransferDom} from 'vux'
import {fabric} from 'fabric'
import $ from 'jquery'
import Exif from 'exif-js'
export default {
  directives: {
    TransferDom
  },
  methods: {
    uploadImage: function (e) {
      // this.show1 = true
      var boxElementWidth = $('#fabricBox').width()
      var boxElementHeight = $('#fabricBox').height()
      var canvas = new fabric.Canvas('fabricCanvas', {
        selection: false,
        width: boxElementWidth,
        height: boxElementHeight
      })
      canvas.clear()

      var files = e.target.files
      var file
      if (files && files.length > 0) {
        file = files[0]
      }
      const isImage = (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg')
      const isLt2M = file.size / 1024 / 1024 / 2 < 2
      if (!isLt2M) {
        AlertModule.show({
          title: 'more than 2M',
          content: 'more than 2M'
        })
        return
      }
      if (!isImage) {
        AlertModule.show({
          title: 'VUX is Cool',
          content: 'only image'
        })
        return
      }
      // var reader = new FileReader()
      // reader.onload = (e) => {
      //   console.log('sdfsdf')
      //   var image = new Image()
      //   image.src = e.target.result
      //   image.onload = function (e) {
      //     var width = this.width
      //     var height = this.height
      //     console.log('asdfasd' + width, height)
      //   }
      //   this.addForm.src = e.target.result
      // }

      this.imgPreview(file)

      // var data = new FormData()
      // data.append('image', file)
      // api
      //   .post('uploads?type=images', data, {headers: {'Content-Type': 'multipart/form-data'}}, true)
      //   .then(response => {
      //     this.show1 = false
      //     if (response.data.state === 'success') {
      //       this.addForm.src = response.data.info.path
      //       var image = new Image()
      //       image.src = this.addForm.src
      //
      //       image.onload = () => {
      //         this.addForm.realImageWidth = image.width
      //       }
      //     } else {
      //       AlertModule.show({
      //         title: 'failure',
      //         content: 'failure'
      //       })
      //     }
      //   }).catch(function (error) {
      //     this.show1 = false
      //     console.log(error) // catch your error
      //   })
    },
    imgPreview (file) {
      let self = this
      let Orientation
      // 去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file, function () {
        Orientation = Exif.getTag(this, 'Orientation')
      })
      // 看支持不支持FileReader
      if (!file || !window.FileReader) return

      if (/^image/.test(file.type)) {
        // 创建一个reader
        let reader = new FileReader()
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file)
        // 读取成功后的回调
        reader.onloadend = function () {
          let result = this.result
          let img = new Image()
          img.src = result
          // 判断图片是否大于100K,是就直接上传，反之压缩图片
          // if (this.result.length <= (100 * 1024)) {
          //   self.headerImage = this.result
          //   self.postImg()
          // } else {
          img.onload = function () {
            let data = self.compress(img, Orientation)
            // self.headerImage = data

            AlertModule.show({
              title: 'failure',
              content: data
            })
            self.postImg(data)
          }
        }
      }
    },
    postImg (rawdata) {
      var data = {
        imgData: rawdata
      }
      api
        .post('uploads?type=images', data, true)
        .then(response => {
          this.show1 = false
          if (response.data.state === 'success') {
            this.addForm.src = response.data.info.path
            var image = new Image()
            image.src = this.addForm.src

            image.onload = () => {
              this.addForm.realImageWidth = image.width
            }
          } else {
            AlertModule.show({
              title: 'failure',
              content: 'failure'
            })
          }
        }).catch(function (error) {
          this.show1 = false
          console.log(error) // catch your error
        })
    },
    rotateImg (img, direction, canvas) {
      // 最小与最大旋转方向，图片旋转4次后回到原方向
      const minStep = 0
      const maxStep = 3
      if (img == null) return
      // img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height
      let width = img.width
      let step = 2
      if (step == null) {
        step = minStep
      }
      if (direction === 'right') {
        step++
        // 旋转到原位置，即超过最大值
        step > maxStep && (step = minStep)
      } else {
        step--
        step < minStep && (step = maxStep)
      }
      // 旋转角度以弧度值为参数
      let degree = step * 90 * Math.PI / 180
      let ctx = canvas.getContext('2d')
      switch (step) {
        case 0:
          canvas.width = width
          canvas.height = height
          ctx.drawImage(img, 0, 0)
          break
        case 1:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, 0, -height)
          break
        case 2:
          canvas.width = width
          canvas.height = height
          ctx.rotate(degree)
          ctx.drawImage(img, -width, -height)
          break
        case 3:
          canvas.width = height
          canvas.height = width
          ctx.rotate(degree)
          ctx.drawImage(img, -width, 0)
          break
      }
    },
    compress (img, Orientation) {
      let canvas = document.createElement('canvas')
      let ctx = canvas.getContext('2d')
      // 瓦片canvas
      // let tCanvas = document.createElement('canvas')
      // let tctx = tCanvas.getContext('2d')
      let initSize = img.src.length
      let width = img.width
      let height = img.height
      canvas.width = width
      canvas.height = height
      //        铺底色
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, width, height)
      if (Orientation !== '' && Orientation !== 1) {
        switch (Orientation) {
          case 6:// 需要顺时针（向左）90度旋转
            this.rotateImg(img, 'left', canvas)
            break
          case 8:// 需要逆时针（向右）90度旋转
            this.rotateImg(img, 'right', canvas)
            break
          case 3:// 需要180度旋转
            this.rotateImg(img, 'right', canvas)// 转两次
            this.rotateImg(img, 'right', canvas)
            break
        }
      }
      // 进行最小压缩
      let ndata = canvas.toDataURL('image/jpeg', 0.1)
      console.log('压缩前：' + initSize)
      console.log('压缩后：' + ndata.length)
      console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + '%')
      // tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
      return ndata
    },
    makeLine: function (coords) {
      return new fabric.Line(coords, {
        stroke: 'rgba(82,219,89,100)',
        strokeWidth: 1,
        selectable: false
      })
    },
    getFaceTest: function () {
      this.show1 = true
      var boxElementWidth = $('#fabricBox').width()
      var boxElementHeight = $('#fabricBox').height()
      var rate = 1
      rate = this.addForm.realImageWidth / boxElementWidth
      api.post('startAipFace', {path: this.addForm.src}, true)
        .then(result => {
          this.show1 = false
          if (result.data.state === 'success') {
            var canvas = new fabric.Canvas('fabricCanvas', {
              selection: false,
              width: boxElementWidth,
              height: boxElementHeight
            })
              this.detail = result.data.info[0]
            var list = result.data.info[0].landmark72
            list.forEach((value, key) => {
              if (key < list.length - 1 && key !== 12 && key !== 21 && key !== 29 && key !== 38 && key !== 46 && key !== 57) {
                var line = this.makeLine([value.x / rate, value.y / rate, list[key + 1].x / rate, list[key + 1].y / rate])
                canvas.add(line)
              }
            })
          } else {

          }
        }).catch(err => {
          this.show1 = false
          console.log(err)
        })
    }
  },
  computed: {},
  components: {
    XButton,
    Loading
  },
  data () {
    return {
      show1: false,
      addForm: {
        src: '',
        realImageWidth: ''
      },
      detail: ''
    }
  }
}
</script>
<style>
    * {
        margin: 0;
        padding: 0;
        border: 0;
    }

    .moji-upload-btn {
        cursor: pointer;
        position: relative;
        text-align: center;
        white-space: nowrap;
        position: relative;
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        width: 90%;
        margin-left: 5%;
        min-height: 300px;
        overflow: hidden;
    }

    .imgSrc {
        font-size: 24px;
        line-height: 24px;
        overflow: hidden;
    }

    .moji-upload-btn img {
        width: 100%;
        height: auto;
    }

    .moji-upload-btn:hover,
    .avatar-uploader-icon:hover {
        border-color: #409EFF;
    }

    .moji-upload-btn input[type=file],
    #fabricBox {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        outline: none;
        cursor: inherit;
        text-align: center;
    }
    /*#fabricCanvas{*/
        /*border: 10px solid black;*/
    /*}*/

    .canvas-container {
        display: inline-block;
    }

    input {
        filter: alpha(opacity=0);
        opacity: 0;
    }

    .avatar-uploader-icon {
        position: absolute;
        top: 50%;
        margin-left: -17px;
        margin-top: -17px;
        left: 50%;
        font-size: 34px;
        color: #8c939d;
        display: inline-block;
        vertical-align: middle;
        text-align: center;
    }

    .primary-button {
        width: 90% !important;
        margin-top: 20px;
    }
</style>
