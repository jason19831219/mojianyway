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
        <div class="imgSrc">{{addForm.src}}</div>
        <div slot="footer" class="dialog-footer">
            <XButton class="primary-button" type="primary" @click.native="getFaceTest()">检测</XButton>
        </div>
    </div>
</template>

<script>
import api from '../../api'
import {AlertModule, XButton} from 'vux'
import {fabric} from 'fabric'
import $ from 'jquery'

export default {
  methods: {
    uploadImage: function (e) {
      var boxElementWidth = $('#fabricBox').width()
      var boxElementHeight = $('#fabricBox').height()
      var canvas = new fabric.Canvas('fabricCanvas', {
        selection: false,
        width: boxElementWidth,
        height: boxElementHeight
      })
      canvas.clear()
      var file = e.target.files[0]
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
      var data = new FormData()
      data.append('image', file)

      // var reader = new FileReader()
      //
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

      api
        .post('uploads?type=images', data, {headers: {'Content-Type': 'multipart/form-data'}}, true)
        .then(response => {
          if (response.data.state === 'success') {
            this.addForm.src = response.data.info.path
            // var imgElement = document.getElementById('faceImg')
            // var boxElement = document.getElementById('fabricBox')
            // if (imgElement.width > boxElement.width) {
            //   imgElement.width = boxElement.width
            // }
            // console.log($('#faceImg').attr('src'))
            // // var screenImage = $('#faceImg')
            //
            // $('<img>') // Make in memory copy of image to avoid css issues
            //   .attr('src', '/public/upload/images/img20180516173524.jpeg')
            //   .load(function () {
            //     // var width = this.width // Note: $(this).width() will not
            //     // var height = this.height // work for in memory images.
            //     console.log(this)
            //   })
          } else {
            AlertModule.show({
              title: 'failure',
              content: 'failure'
            })
          }
        }).catch(function (error) {
          console.log(error) // catch your error
        })
    },
    makeLine: function (coords) {
      return new fabric.Line(coords, {
        stroke: 'rgba(82,219,89,100)',
        strokeWidth: 1,
        selectable: false
      })
    },
    getFaceTest: function () {
      console.log($('#faceImg').attr('src'))
      var image = new Image()
      image.src = $('#faceImg').attr('src')
      var realImageWidth = image.width
      // var realImageHeight = image.height

      var boxElementWidth = $('#fabricBox').width()
      var boxElementHeight = $('#fabricBox').height()
      var rate = 1
      console.log(realImageWidth)
      // if (realImageWidth > boxElementWidth) {
      //   rate = realImageWidth / boxElementWidth
      // } else {
      rate = realImageWidth / boxElementWidth
      // }
      api.post('startAipFace', {path: this.addForm.src}, true)
        .then(result => {
          if (result.data.state === 'success') {
            var canvas = new fabric.Canvas('fabricCanvas', {
              selection: false,
              width: boxElementWidth,
              height: boxElementHeight
            })
            // fabric.Image.fromURL(this.addForm.src, (oImg) => {
            //   oImg.scale(1 / rate)
            //   console.log(1 / rate)
            //   canvas.add(oImg)
            //
            // })
            var list = result.data.info[0].landmark72
            list.forEach((value, key) => {
              if (key < list.length - 1 && key !== 12 && key !== 21 && key !== 29 && key !== 38 && key !== 46 && key !== 57) {
                var line = this.makeLine([value.x / rate, value.y / rate, list[key + 1].x / rate, list[key + 1].y / rate])
                console.log(value.x)
                canvas.add(line)
              }
            })
            // fabric.Image.fromURL(this.addForm.src, function (img) {
            //   var oImg = img.set({left: 0, top: 0}).scale(0.25)
            //   canvas.add(oImg)
            // })
            // var canvas = document.getElementById('canvas')
            // var ctx = canvas.getContext('2d')
            // ctx.clearRect(0, 0, canvas.width, canvas.height)
            // ctx.fillStyle = 'black'
            // ctx.font = '20px Georgia'
            // ctx.fillText('japsodnfwief', 10, 50)
          } else {

          }
        }).catch(err => {
          console.log(err)
        })
    }
  },
  computed: {},
  components: {
    XButton
  },
  data () {
    return {
      addForm: {
        src: ''
      }
    }
  }
}
</script>
<style>
    * {
        margin: 0;
        padding: 0;
        border: 0;
        line-height: 0;
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
