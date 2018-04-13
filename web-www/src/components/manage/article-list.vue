<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%"
      ref="table">
      <el-table-column
        prop="author"
        label="作者"
        width="120">
      </el-table-column>
      <el-table-column
        prop="avatar"
        label="头像"
        sortable
        width="120">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" alt="" style="width: 50px;height: 50px">
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建日期"
        width="150">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        sortable
        label="更新时间"
        width="120">
      </el-table-column>
      <el-table-column
        prop="fromSite"
        sortable
        label="来自"
        width="120">
      </el-table-column>
      <el-table-column
        prop="imgSrc"
        label="图片地址"
        width="auto">
        <template slot-scope="scope">
          <span v-for="items in scope.row.imgSrc">
            <img :srcset="items[0]" style="height: 100px">
          </span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            v-if="!scope.row.sticky"
            @click="toggleSticky(scope.$index)"
            size="small">
            置顶
          </el-button>
          <el-button
            v-if="scope.row.sticky"
            @click="toggleSticky(scope.$index)"
            size="small">
            取消置顶
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
  </div>
</template>

<script>
import api from '@/api'
import ExTable from '../table'

export default {
  methods: {
    toggleSticky (index, rows) {
      this.list[index].sticky = !this.list[index].sticky
      let params = {
        articleId: this.list[index].id,
        sticky: this.list[index].sticky
      }
      api
        .post('article/updateArticle', params, true)
        .then(response => {
          console.log(response.data)
          if (response.data.state === 'success') {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: response.data.message,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.$message({
            type: 'error',
            message: err.toString()
          })
        })
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
      console.log(params)
      api
        .get('article/getList', params, true)
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
      totalCount: 0
    }
  },
  mounted: function () {
    this.getList()
  }
}
</script>
