<template>
  <div>
    <div>
      <el-button type="text" @click="addDialogVisable = true">添加moji Set</el-button>
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
        prop="desc"
        label="描述"
        width="120">
      </el-table-column>
      <el-table-column
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
        prop="avatar"
        label="avatar"
        width="auto">
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
      <el-form :model="mojiSetAddForm" :rules="mojiSetAddRule" ref="mojiSetAddForm">
        <el-form-item label="MojiSetName" prop="name">
          <el-input v-model="mojiSetAddForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="MojiSetDesc" prop="desc">
          <el-input v-model="mojiSetAddForm.desc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="MojiSetAuthor" prop="author">
          <el-input v-model="mojiSetAddForm.author" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="mojiSetAddOne('mojiSetAddForm')">确定添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'
import {createNamespacedHelpers} from 'vuex'
const {mapState} = createNamespacedHelpers('server/mojiSet')

export default {
  methods: {
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.pageNumber = val
      this.getList()
    },
    getList () {
      let params = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        nameReg: ''
      }
      api
        .get('mojiSet/getList', params, true)
        .then(response => {
          console.log(response.data)
          if (response.data.state === 'success') {
            this.list = response.data.list
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
    mojiSetAddOne (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = this.mojiSetAddForm
          api
            .post('mojiSet/addOne', params, true)
            .then(result => {
              if (result.data.state === 'success') {
                this.$message({
                  message: '恭喜,添加成功！',
                  type: 'success',
                  onClose: () => {
                    window.location = '/moji-admin'
                  }
                })
              } else {
                this.$message({
                  message: result.data.message,
                  type: 'error'
                })
              }
            })
            .catch(err => {
              this.$message.error(err.response.data.error)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  },
  computed: {
    ...mapState([
      'mojiSetAddForm',
      'mojiSetAddRule'
    ])
  },
  component: {
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
