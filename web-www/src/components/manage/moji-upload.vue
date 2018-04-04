<template>
  <el-col :span="4" :offset="9"><div>
    <el-input placeholder="请输入moji的名称" v-model="mojiForm.name"></el-input>
    <el-input placeholder="请输入moji的作者" v-model="mojiForm.author"></el-input>
    <div>
      <span class="moji-upload-btn">
        <i v-if="!mojiForm.src" id="avatar-uploader-icon" class="el-icon-plus"></i>
        <img v-if="mojiForm.src" :src=mojiForm.src />
        <input @change="uploadImage" type="file" accept="image/*" name="image" />
      </span>
    </div>
    <el-button size="small" type="success" @click="saveMoji">保存moji</el-button>
  </div>
  </el-col>
</template>

<script>
import api from '@/api'

export default {
  name: 'moji-upload',
  data () {
    return {
      mojiForm: {
        src: '',
        name: '',
        description: '',
        author: ''
      },
      success: null,
      message: '',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=fuckReaquestHeader'
      }
    }
  },
  methods: {
    uploadImage: function (e) {
      var file = e.target.files[0]
      console.log(file)
      const isImage = (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg')
      const isLt2M = file.size / 1024 / 50 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 50k!')
        return
      }
      if (!isImage) {
        this.$message.error('只能上传图片！')
        return
      }
      var data = new FormData()
      data.append('image', file)

      var reader = new FileReader()

      reader.onload = (e) => {
        this.mojiForm.src = e.target.result
      }

      api
        .post('uploads?type=images', data, {headers: {'Content-Type': 'multipart/form-data'}}, true)
        .then(response => {
          if (response.data.state === 'success') {
            this.$message({
              message: response.data.message,
              type: 'success'
            })
            this.mojiForm.src = '/' + response.data.info.path
          } else {
            this.$message({
              message: response.data.message,
              type: 'error'
            })
          }
        }).catch(function (error) {
          console.log(error) // catch your error
        })
    },
    saveMoji: function (e) {
      var data = this.mojiForm
      api.post('moji/addOne', data, true)
        .then(result => {
          if (result.data.state === 'success') {
            this.$message({
              message: '保存成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: result.data.message,
              type: 'error'
            })
          }
        }).catch(err => {
          this.$message({
            message: err.toString(),
            type: 'error'
          })
        })
    }
  }
}
</script>

<style>

  body {
    margin: 0;
  }

  .image {
    width: 100%;
    height: 100%;
    margin-bottom: 40px;
  }

  .container {
    margin: 0 auto;
    width: 600px;
  }

  .navbar {
    width: 100%;
    cursor: default;
    background-color: #2CA8E5;
    height: 65px;
    display: flex;
    align-items: center;
    padding-left: 35px;
    margin-bottom: 50px;
  }

  .navbar-text {
    color: white;
    font-weight: bold;
  }

  .navbar-text a {
    color: white;
  }

  .moji-upload-btn {
    cursor: pointer;
    display: inline-block;
    text-align: center;
    white-space: nowrap;
    position: relative;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    width: 240px;
    height: 240px;
    overflow: hidden;
  }

  .moji-upload-btn:hover,
  .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }

  .moji-upload-btn img{
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
  }

  .moji-upload-btn input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    font-size: 100px;
    text-align: right;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    background: white;
    cursor: inherit;
  }

  .alert {
    padding: 15px;
    margin-bottom: 20px;
    border: 1px solid transparent;
    border-radius: 4px;
  }

  .alert-success {
    color: #3c763d;
    background-color: #dff0d8;
    border-color: #d6e9c6;
  }

  .alert-danger {
    color: #a94442;
    background-color: #f2dede;
    border-color: #ebccd1;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  #avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    line-height: 240px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
