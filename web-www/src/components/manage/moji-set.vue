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
      </el-table-column>
      <el-table-column
        label="mojis"
        width="auto">
        <template slot-scope="scope">
          <span class="moji-selection-btn" v-for="(item, index) in scope.row.mojis" :key="index">
            <i class="el-icon-plus avatar-uploader-icon"></i>
            <img v-if="mojiSrcItem.id === item.old" v-for="mojiSrcItem in mojiList" :key="mojiSrcItem.id"  :src="mojiSrcItem.src">
            <el-select v-model="item.new" @change="mojiChanged(scope.row._id, item.new, item.old)">
              <el-option
                :value="''"
                style="height: 100px;width: 300px; margin-bottom: 30px;">
                <span style="text-align: center; height: 100px;line-height: 100px!important;">删除</span>
              </el-option>
              <el-option
                v-for="item in mojiList"
                :key="item.id"
                :label="item.id"
                :value="item.id"
                style="height: 100px;width: 300px; margin-bottom: 30px;">
                <span style="float: left; height: 100px;line-height: 100px!important;">{{ item.id }}</span>
                <span style="float: right; height: 100px;">
                  <img :src="item.src" style="height: 100px;">
                </span>
              </el-option>
            </el-select>
          </span>
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
    },
    mojiChanged (mojiSetId, newMojiItemId, oldMojiItemId) {
      let params = {
        'mojiSeIid': mojiSetId,
        'oldMojiItemId': oldMojiItemId || '',
        'newMojiItemId': newMojiItemId || ''
      }
      api
        .post('mojiSet/updateMojiItem', params, true)
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
    }
  },
  computed: {
    ...mapGetters({
      list: 'server/mojiSet/mojiSetList',
      listInfo: 'server/mojiSet/mojiSetListPageInfo',
      addForm: 'server/mojiSet/addForm',
      mojiSetAddRule: 'server/mojiSet/mojiSetAddRule',
      mojiList: 'server/moji/list'
    })
  },
  component: {},
  data () {
    return {
      DialogVisable: false,
      addMojiItem: '',
      newMojiItemId: '',
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      value: ''
    }
  },
  mounted () {
    this.$store.dispatch('server/mojiSet/getMojiSetList')
    this.$store.dispatch('server/moji/getAll')
  }
}
</script>
<style>
  .moji-selection-btn {
    cursor: pointer;
    display: inline-block;
    text-align: center;
    white-space: nowrap;
    position: relative;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    width: 100px;
    height: 100px;
    overflow: hidden;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 100%;
    height: 100%;
    line-height: 100px!important;
    text-align: center;
  }

  .moji-selection-btn:hover,
  .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }

  .moji-selection-btn img {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
  }

  .moji-selection-btn .el-select {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    font-size: 100px;
    opacity: 0;
    outline: none;
    background: white;
    cursor: inherit;
  }
</style>
