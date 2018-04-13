<template>
  <div>
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
      :current-page=pageNumber
      :page-sizes="[10,20,50,100]"
      :page-size=pageSize
      layout="total, sizes, prev, pager, next, jumper"
      :total=totalCount>
    </el-pagination>
    <el-dialog title="添加moji set" :visible.sync="addDialogVisable">
      <el-form :model="mojiAddForm" :rules="mojiAddRule" ref="mojiAddForm">
        <i v-if="!mojiAddForm.src" id="avatar-uploader-icon" class="el-icon-plus"></i>
        <img v-if="mojiAddForm.src" :src=mojiAddForm.src />
        <input @change="uploadImage" type="file" accept="image/*" name="image" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMoji('mojiSetAddForm')">保存moji</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'
import ExTable from '../table'

export default {
  methods: {
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
    },
    getList () {
      let params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        nameReg: ''
      }
      api
        .get('moji/getList', params, true)
        .then(response => {
          console.log(response.data)
          if (response.data.state === 'success') {
            this.list = response.data.docs
            this.totalCount = response.data.pageInfo.totalItems
          } else {
            this.$message({
              message: response.data.message,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message.error(err.toString())
        })
    },
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
  },
  component: {
    ExTable
  },
  data () {
    return {
      list: [],
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      addDialogVisable: false
    }
  },
  mounted: function () {
    this.getList()
  }
}
</script>
