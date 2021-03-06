<template>
  <div class="main-container">
    <!-- 搜索区域 -->
    <el-form label-width="80px" :model="form">
      <el-row :gutter="20">
        <el-col v-bind="colProps">
          <el-form-item label="姓名" prop="trueName">
            <el-input v-model="form.trueName"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-bind="colProps">
          <el-form-item label="身份证" prop="buyerIdCardNo">
            <el-input v-model="form.buyerIdCardNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-bind="colProps">
          <el-form-item label="订单号" prop="orderNo">
            <el-input v-model="form.orderNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-bind="colProps">
          <el-form-item label="">
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
    <!-- table区域    -->
    <el-table :data="list" border style="width: 100%">
      <el-table-column prop="id" label="序号" width="100"></el-table-column>
      <el-table-column prop="orderNo" label="订单号"></el-table-column>
      <el-table-column prop="trueName" label="姓名"></el-table-column>
      <el-table-column prop="buyerIdCardNo" label="身份证号"></el-table-column>
      <el-table-column prop="amount" label="订单金额"></el-table-column>
      <el-table-column prop="status" label="校验状态"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="modifyTime" label="修改时间"></el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-row class="pagination" type="flex" justify="end">
      <el-pagination
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
  </div>
</template>
<script>
import * as API from './api'
import { deleteEmptyParam } from '@/utils'
export default {
  data() {
    return {
      colProps: {
        xs: 24,
        sm: 12,
        lg: 12,
        xl: 6,
      },
      form: {
        trueName: null,
        buyerIdCardNo: null,
        orderNo: null,
      },
      currentPage: 1,
      pageSize: 10,
      total: 0,
      list: [],
    }
  },
  mounted() {
    this.queryList()
  },
  methods: {
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
    queryList() {
      const parpam = Object.assign({}, this.form, {
        pageSize: this.pageSize,
        page: this.currentPage,
      })
      deleteEmptyParam(parpam)
      API.getLimitOrder(parpam).then(res => {
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
