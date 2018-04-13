<template>
  <div>
    <div>
      <el-button type="text" @click="DialogVisable = true">添加MOJI SET</el-button>
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
        width="120">
        <template slot-scope="scope">
          <img :src="'http://127.0.0.1:8080'+scope.row.src" style="height: 100px">
        </template>
      </el-table-column>
      <el-table-column
        prop="mojis"
        label="mojis"
        width="auto">
        <template slot-scope="scope">
          <span v-for="item in scope.row.mojis" :key="item.id">
            <img :src="item.id" style="height: 100px">
          </span>
        </template>
        <span class="moji-upload-btn">
        <i id="avatar-uploader-icon" class="el-icon-plus"></i>
        <el-select v-model="addMojiItem" placeholder="请选择">
        <el-option
      v-for="item in mojiList"
      :key="item.id"
      :label="item.name"
      :value="item.src">
      <span style="float: left">{{ item.id }}</span>
      <img style="float: right; color: #8492a6; font-size: 13px" src="item.value">>
    </el-option>
  </el-select>
      </span>
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
      :total=listInfo.totalItems>
    </el-pagination>
    <el-dialog title="添加moji set" :visible.sync="DialogVisable">
      <el-form :model="addForm" :rules="mojiSetAddRule" ref="addForm">
        <el-form-item label="MojiSetName" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="MojiSetDesc" prop="desc">
          <el-input v-model="addForm.desc" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="MojiSetAuthor" prop="author">
          <el-input v-model="addForm.author" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="DialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="mojiSetAddOne('addForm')">确定添加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'
import {mapGetters} from 'vuex'

export default {
  methods: {
    deleteRow (index, rows) {
      rows.splice(index, 1)
    },
    handleSizeChange (val) {
      this.$store.dispatch('server/mojiSet/setPageSize', val)
    },
    handleCurrentChange (val) {
      this.$store.dispatch('server/mojiSet/setPageNumber', val)
      this.$store.dispatch('server/mojiSet/getMojiSetList')
    },
    mojiSetAddOne (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = this.addForm
          api
            .post('mojiSet/addOne', params, true)
            .then(result => {
              if (result.data.state === 'success') {
                this.$message({
                  message: '恭喜,添加成功！',
                  type: 'success'
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
    ...mapGetters({
      list: 'server/mojiSet/mojiSetList',
      listInfo: 'server/mojiSet/mojiSetListPageInfo',
      addForm: 'server/mojiSet/addForm',
      mojiSetAddRule: 'server/mojiSet/mojiSetAddRule',
      mojiList: 'server/moji/list',
    })
  },
  component: {},
  data () {
    return {
      DialogVisable: false,
      addMojiItem: ''
    }
  },
  mounted () {
    this.$store.dispatch('server/mojiSet/getMojiSetList')
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
</style>
