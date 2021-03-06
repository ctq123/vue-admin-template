<template>
  <div class="main-container">
    <!-- 搜索区域 -->
    <el-form label-width="80px" :model="form">
      <el-row :gutter="20">
        <el-col v-bind="colProps">
          <el-form-item label="姓名" prop="trueName">
            <el-input v-model="form.trueName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col v-bind="colProps">
          <el-form-item label="身份证" prop="id">
            <el-input v-model="form.buyerIdCardNo" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col v-bind="colProps">
          <el-form-item label=" ">
            <el-button type="primary" @click="search">
              搜索
            </el-button>
            <el-button @click="reset">
              重置
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- table区域 -->
    <el-table
      v-loading="loading"
      :data="list"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="序号" width="100"></el-table-column>
      <el-table-column prop="trueName" label="姓名"></el-table-column>
      <el-table-column prop="buyerIdCardNo" label="身份证号"></el-table-column>
      <el-table-column prop="customsAmount" label="已用额度"></el-table-column>
      <el-table-column label="身份证正面照">
        <template slot-scope="scope">
          <div @click="viewLarge(scope.row.frontIdCard)">
            <img style="max-height: 80px; float: left;margin-right: 10%" :src="scope.row.frontIdCard">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="身份证反面照">
        <template slot-scope="scope">
          <div @click="viewLarge(scope.row.oppositeIdCard)">
            <img style="max-height: 80px; float: left;margin-right: 10%" :src="scope.row.oppositeIdCard">
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="modifyTime" label="修改时间"></el-table-column>
      <el-table-column label="操作" fixed="right" width="100">
        <template slot-scope="{ row }">
          <el-button type="text" size="small" @click="showEditDialog(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-row class="pagination" type="flex" justify="end">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-row>
    <el-dialog
      title="查看大图"
      :visible.sync="viewLargeTag"
      @close="viewLargeClose"
    >
      <img style="width: 50%" :src="viewLargeUrl">
      <div slot="footer" class="dialog-footer">
        <el-button @click="viewLargeClose">
          关闭
        </el-button>
      </div>
    </el-dialog>
    <edit-dialog v-bind="dialogData" :edit-loading="editLoading" @handleCB="hideEditDialog"></edit-dialog>
  </div>
</template>

<script>
import * as API from './api'
import EditDialog from './editDialog.vue'
import { deleteEmptyParam } from '@/utils'

export default {
  components: {
    EditDialog,
  },
  data() {
    return {
      colProps: {
        xs: 24,
        sm: 12,
        lg: 8,
        xl: 6,
      },
      loading: false,
      form: {
        trueName: null,
        buyerIdCardNo: null,
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      list: [],
      editLoading: false,
      // 查看大图
      viewLargeTag: false,
      viewLargeUrl: '',
      dialogData: {
        visible: false,
        record: {},
      },
    }
  },
  mounted() {
    this.queryList()
  },
  methods: {
    showEditDialog(row) {
      this.dialogData = {
        visible: true,
        record: row,
      }
    },
    async hideEditDialog(data) {
      if (data) {
        // console.log("data", data)
        const { id, customsAmount: limitAmount, frontIdCard, oppositeIdCard } = data
        const params = {
          id,
          limitAmount,
        }
        if (frontIdCard !== undefined) {
          params.frontIdCard = frontIdCard
        }
        if (oppositeIdCard !== undefined) {
          params.oppositeIdCard = oppositeIdCard
        }
        const { code } = await API.editLimitCustoms(params)
        if (code === 200) {
          this.$message({
            message: '更改成功',
            type: 'success',
          })
          this.queryList()
        }
      }
      this.dialogData = {
        visible: false,
        record: {},
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.queryList()
    },
    search() {
      this.currentPage = 1
      this.queryList()
    },
    reset() {
      this.form = {}
      this.queryList()
    },
    // 查看大图
    viewLarge(url) {
      this.viewLargeTag = true
      this.viewLargeUrl = url
    },
    viewLargeClose() {
      this.viewLargeTag = false
      this.viewLargeUrl = ''
    },
    queryList() {
      const parpam = Object.assign({}, this.form, {
        pageSize: this.pageSize,
        page: this.currentPage,
      })
      deleteEmptyParam(parpam)
      API.getLimitCustoms(parpam).then(res => {
        if (res.code === 200) {
          this.list = res.data.rows
          this.total = Number(res.data.total)
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.main-container {
  width: 100%;
  height: 100%;
  background: #ffffff;
  box-sizing: border-box;
  font-family: PingFangSC-Regular;
  padding: 24px;
  .width-100 {
    width: 100%;
  }
  .pagination {
    margin-top: 24px;
  }
}
</style>
