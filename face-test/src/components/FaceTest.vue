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
        <loading :show="show1" text=""></loading>
    </div>
</template>

<script>
import api from '../../api'
import {AlertModule, XButton, Loading, TransferDomDirective as TransferDom} from 'vux'
import {fabric} from 'fabric'
import $ from 'jquery'

export default {
  directives: {
    TransferDom
  },
  methods: {
    uploadImage: function (e) {
      this.show1 = true
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
          this.show1 = false
          if (response.data.state === 'success') {
            this.addForm.src = response.data.info.path
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
      this.show1 = true
      var image = new Image()
      image.src = $('#faceImg').attr('src')
      var realImageWidth = image.width

      var boxElementWidth = $('#fabricBox').width()
      var boxElementHeight = $('#fabricBox').height()
      var rate = 1
      rate = realImageWidth / boxElementWidth
      api.post('startAipFace', {path: this.addForm.src}, true)
        .then(result => {
          this.show1 = false
          if (result.data.state === 'success') {
            var canvas = new fabric.Canvas('fabricCanvas', {
              selection: false,
              width: boxElementWidth,
              height: boxElementHeight
            })
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
