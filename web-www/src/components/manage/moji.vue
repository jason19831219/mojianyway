<template>
  <div>
    <div>
      <el-button type="text" @click="DialogVisable = true">添加moji</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      min-height="100%"
      ref="table">
      <el-table-column
        prop="name"
        label="名称"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        fixed
        prop="createDate"
        label="创建日期"
        width="150">
      </el-table-column>
      <el-table-column
        prop="author"
        label="作者"
        width="120">
      </el-table-column>
      <el-table-column
        prop="updateDate"
        sortable
        label="更新时间"
        width="120">
      </el-table-column>
      <el-table-column
        prop="src"
        label="图片地址"
        width="600">
        <template slot-scope="scope">
          <img :src="'http://127.0.0.1:8080'+scope.row.src" style="height: 100px">
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            @click="deleteRow(scope.$index, table)"
            type="text"
            size="small">
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page=listInfo.pageNumber
      :page-sizes="[10,20,50,100]"
      :page-size=listInfo.pageSize
      layout="total, sizes, prev, pager, next, jumper"
      :total=listInfo.totalCount>
    </el-pagination>
    <el-dialog title="添加moji set" :visible.sync="addDialogVisable">
      <el-form :model="addForm" :rules="addRule" ref="addForm">
        <el-input placeholder="请输入moji的名称" v-model="addForm.name"></el-input>
        <el-input placeholder="请输入moji的作者" v-model="addForm.author"></el-input>
        <span class="moji-upload-btn">
          <i v-if="!addForm.src" id="avatar-uploader-icon" class="el-icon-plus"></i>
          <img v-if="addForm.src" :src=addForm.src />
          <input @change="uploadImage" type="file" accept="image/*" name="image" />
        </span>
        <div>{{addForm.src}}</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="saveMoji('mojiSetaddForm')">保存moji</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'
import { mapGetters } from 'vuex'

export default {
  methods: {
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    handleSizeChange (val) {
      this.$store.dispatch('server/moji/setPageSize', val)
    },
    handleCurrentChange (val) {
      this.$store.dispatch('server/moji/setPageNumber', val)
    },
    uploadImage: function (e) {
      var file = e.target.files[0]
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
        this.addForm.src = e.target.result
      }

      api
        .post('uploads?type=images', data, {headers: {'Content-Type': 'multipart/form-data'}}, true)
        .then(response => {
          if (response.data.state === 'success') {
            this.$message({
              message: response.data.message,
              type: 'success'
            })
            this.addForm.src = '/' + response.data.info.path
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
      var data = this.addForm
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
  },
  computed: {
    ...mapGetters({
      list: 'server/moji/list',
      listInfo: 'server/moji/listPageInfo',
      addForm: 'server/moji/addForm',
      addRule: 'server/moji/addRule'
    })
  },
  component: {
  },
  data () {
    return {
      addDialogVisable: false
    }
  },
  mounted () {
    this.$store.dispatch('server/moji/getAll')
  }
}
</script>
<style>
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
  #avatar-uploader-icon:hover {
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
  #avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    line-height: 240px;
    text-align: center;
  }
</style>
