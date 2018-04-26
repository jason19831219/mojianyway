<template>
  <div>
    <div>
      <el-button type="text" @click="showItemFrom('itemForm')">添加Article</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      ref="table">
      <el-table-column
        prop="title"
        label="主题"
        width="120">
      </el-table-column>
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
          <img :src="scope.row.authorAvatarSrc" alt="" style="width: 50px;height: 50px">
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建日期"
        width="150">
      </el-table-column>
      <el-table-column
        prop="updateDate"
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
          <span v-for="items in scope.row.imgSrc" :key="items.id">
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
      :current-page=listInfo.pageNumber
      :page-sizes="[10,20,50,100]"
      :page-size=listInfo.pageSize
      layout="total, sizes, prev, pager, next, jumper"
      :total=listInfo.totalItems>
    </el-pagination>
    <el-dialog title="添加Article" :visible.sync="DialogVisable">
      <el-form :model="itemForm" :rules="itemFormRule" ref="itemForm">
        <el-form-item label="article的名称" prop="title">
          <el-input placeholder="请输入article的名称" v-model="itemForm.title"></el-input>
        </el-form-item>
        <el-form-item label="article的来源" prop="fromSite">
          <el-input placeholder="请输入article的来源" v-model="itemForm.fromSite"></el-input>
        </el-form-item>
        <el-form-item label="article的作者" prop="author">
          <el-input placeholder="请输入article的作者" v-model="itemForm.author"></el-input>
        </el-form-item>
        <el-form-item label="上传作者头像" prop="authorAvatarSrc">
          <el-upload class="image-upload-btn" action="/manage/uploads?type=images" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="itemForm.authorAvatarSrc" :src="itemForm.authorAvatarSrc"/>
            <i v-else class="el-icon-plus image-upload-icon"></i>
          </el-upload>
        </el-form-item>
        <div>{{itemForm.authorAvatarSrc}}</div>
        <el-form-item label="上传图片" prop="imgSrc">
          <el-upload class="image-upload-btn" action="/manage/uploads?type=images" :show-file-list="false" :on-success="handleImageSuccess" :before-upload="beforeImageUpload">
            <img v-if="itemForm.imgSrc" :src="itemForm.imgSrc"/>
            <i v-else class="el-icon-plus image-upload-icon"></i>
          </el-upload>
        </el-form-item>
        <div>{{itemForm.imgSrc}}</div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="DialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="addOne()">保存article</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'
import { mapGetters } from 'vuex'

export default {
  props: {
    formState: Object
  },
  methods: {
    addOne () {
      this.$store.dispatch('server/article/addOne')
    },
    showItemFrom (formName) {
      this.DialogVisable = true
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields()
      }
    },
    handleAvatarSuccess (res, file) {
      this.itemForm.authorAvatarSrc = res.info.path
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error('上传图片只能是 JPG,PNG,GIF 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG || isGIF) && isLt2M
    },
    handleImageSuccess (res, file) {
      this.itemForm.imgSrc = res.info.path
    },
    beforeImageUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isPNG && !isGIF) {
        this.$message.error('上传图片只能是 JPG,PNG,GIF 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return (isJPG || isPNG || isGIF) && isLt2M
    },
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
      this.$store.dispatch('server/article/setPageSize', val)
    },
    handleCurrentChange (val) {
      this.$store.dispatch('server/article/setPageNumber', val)
    }
  },
  components: {
  },
  computed: {
    ...mapGetters({
      list: 'server/article/list',
      listInfo: 'server/article/listPageInfo',
      itemForm: 'server/article/itemForm',
      itemFormRule: 'server/article/itemFormRule'
    })
  },
  data () {
    return {
      DialogVisable: false
    }
  },
  mounted () {
    this.$store.dispatch('server/article/getAll')
  }
}
</script>
<style scoped="scoped">
  .image-upload-btn{
    cursor: pointer;
    text-align: center;
    white-space: nowrap;
    position: relative;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    width: 240px;
    height: 240px;
    line-height: 240px;
    overflow: hidden;
  }
  .el-upload--text {
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
  .image-upload-btn:hover{
    border-color: #409EFF;
  }
  .image-upload-icon {
    display: inline-block;
    font-size: 28px;
    color: #8c939d;
  }
  .image-upload-btn:hover .image-upload-icon{
    color: #409EFF;
  }
  .image-upload-btn img{
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
</style>
