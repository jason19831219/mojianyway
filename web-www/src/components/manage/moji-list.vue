<template>
  <div>
    <el-table
      :data="mojiList"
      style="width: 100%"
      min-height="100%"
      :search-method="handleSearch" ref="table">
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
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            @click="deleteRow(scope.$index, tableData4)"
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
      :current-page="currentPage4"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
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
    }
  },
  component: {
    ExTable
  },
  data () {
    return {
      mojiList: []
    }
  },
  mounted: function () {
    let params = {
      nameReg: 'moji'
    }
    api
      .get('moji/getList', params, true)
      .then(response => {
        if (response.data.state === 'success') {
          this.mojiList = response.data.docs
          const pagination = this.$refs.table.pagination
          pagination.total = 10
        } else {
          this.$message({
            message: response.data.message,
            type: 'error'
          })
        }
      })
      .catch(err => {
        this.$message.error(err.response.data.error)
      })
  }
}
</script>
