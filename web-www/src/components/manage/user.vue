<template>
  <div>
    <div>
      <el-button size="small" type="primary" @click="handleAdd('itemForm')">添加</el-button>
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
        prop="sticky"
        label="是否置顶"
        width="150">
        <template slot-scope="scope">
          <i v-if="scope.row.sticky === true" class="el-icon-success icon-sticky-check"></i>
          <i v-else class="el-icon-circle-close-outline icon-sticky-check"></i>
        </template>
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
            <img :src="items[0]" style="height: 100px">
          </span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="320">
        <template slot-scope="scope">
          <el-button
            type="primary"
            @click="handleUpdate(scope.$index)"
            size="small">
            修改
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index)">删除
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
    <el-dialog :title="addFlag? '添加': '修改'" :visible.sync="DialogVisable">
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
          <el-upload class="image-upload-btn" action="/manage/uploads?type=images" :show-file-list="false"
                     :on-success="handleAvatarSuccess" :before-upload="beforeImageUpload">
            <img v-if="itemForm.authorAvatarSrc" :src="itemForm.authorAvatarSrc"/>
            <i v-else class="el-icon-plus image-upload-icon"></i>
          </el-upload>
        </el-form-item>
        <div>{{itemForm.authorAvatarSrc}}</div>

        <el-form-item label="上传图片" prop="imgSrc">
          <template slot-scope="scope">
          <span v-for="(item, index) in itemForm.imgSrc" :key="index">
            <el-upload class="image-upload-btn" action="/manage/uploads?type=images" :show-file-list="false"
                       :objectBind="index"
                       :on-success="handleImageSuccess" :before-upload="beforeImageUpload">
              <img v-if="itemForm.imgSrc[index][0]" :src="itemForm.imgSrc[index][0]"/>
              <i v-if="!itemForm.imgSrc[index][0]" class="el-icon-plus image-upload-icon"></i>
            </el-upload>
             <div>{{itemForm.imgSrc[index][0]}}</div>
          </span>
          </template>
        </el-form-item>

        <el-form-item label="置顶选项" prop="sticky">
          <el-checkbox v-model="itemForm.sticky">置顶</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="DialogVisable = false">取 消</el-button>
        <el-button v-if="addFlag" type="primary" @click="addOne()">添加</el-button>
        <el-button v-if="!addFlag" type="primary" @click="updateOne()">修改</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="NoticeVisable"
      width="30%"
      center>
      <span>确定执行删除？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="NoticeVisable = false">取 消</el-button>
    <el-button type="primary" @click="deleteOne()">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  props: {
    formState: Object
  },
  methods: {
    handleAvatarSuccess (res, file) {
      // this.itemForm.authorAvatarSrc = res.info.path
      this.$store.dispatch('server/article/handleAvatarSuccess', {path: res.info.path})
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
    handleImageSuccess (res, file, upload, index) {
      this.$store.dispatch('server/article/handleImageSuccess', {path: res.info.path, index: index})
    },
    handleAdd () {
      this.DialogVisable = true
      this.addFlag = true
      this.$store.dispatch('server/article/setForm', -1)
    },
    handleUpdate (index) {
      this.DialogVisable = true
      this.addFlag = false
      this.$store.dispatch('server/article/setForm', index)
    },
    handleDelete (index) {
      this.NoticeVisable = true
      this.$store.dispatch('server/article/setForm', index)
    },
    addOne () {
      this.$store.dispatch('server/article/addOne')
    },
    updateOne () {
      this.$store.dispatch('server/article/updateOne')
    },
    deleteOne () {
      this.$store.dispatch('server/article/deleteOne')
    },
    handleSizeChange (val) {
      this.$store.dispatch('server/article/setPageSize', val)
    },
    handleCurrentChange (val) {
      this.$store.dispatch('server/article/setPageNumber', val)
    }
  },
  components: {},
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
      DialogVisable: false,
      NoticeVisable: false,
      addFlag: false
    }
  },
  mounted () {
    this.$store.dispatch('server/article/getAll')
  }
}
</script>
<style scoped="scoped">
  .image-upload-btn {
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

  .image-upload-btn:hover {
    border-color: #409EFF;
  }

  .image-upload-icon {
    display: inline-block;
    font-size: 28px;
    color: #8c939d;
  }

  .image-upload-btn:hover .image-upload-icon {
    color: #409EFF;
  }

  .image-upload-btn img {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
  .icon-sticky-check{
    font-size: 24px;
    text-align: center;
  }
</style>
