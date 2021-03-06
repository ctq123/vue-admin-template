<template>
  <div class="cross">
    <div class="cross-search">
      <el-form
        ref="searchForm"
        :model="searchForm"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col v-bind="colProps">
            <el-form-item label="订单号">
              <el-input v-model="searchForm.orderNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-bind="colProps">
            <el-form-item label="电商企业代码">
              <el-input v-model="searchForm.ebcCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-bind="colProps">
            <el-form-item label="电商企业名称">
              <el-input v-model="searchForm.ebcName"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-bind="colProps">
            <el-form-item label="清关状态">
              <el-select v-model="searchForm.status" clearable placeholder="请选择">
                <el-option
                  v-for="(item, index) in statusList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-bind="colProps">
            <el-form-item label="推送时间">
              <el-date-picker
                v-model="searchForm.timeArray"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col v-bind="colProps">
            <el-form-item label="">
              <el-button type="primary" @click="handleSearch">
                查询
              </el-button>
              <el-button @click="reset">
                重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="cross-table">
      <el-table :data="dataList" border style="width: 100%">
        <el-table-column prop="orderNo" min-width="200" label="订单号"></el-table-column>
        <el-table-column prop="ebcCode" min-width="120" label="电商企业代码"></el-table-column>
        <el-table-column prop="ebcName" min-width="200" label="电商企业名称"></el-table-column>
        <el-table-column prop="token" min-width="180" label="token"></el-table-column>
        <el-table-column prop="tokenKey" min-width="180" label="tokenKey"></el-table-column>
        <el-table-column prop="status" label="清关状态"></el-table-column>
        <el-table-column prop="note" min-width="200" label="返回信息"></el-table-column>
        <el-table-column label="推送时间" min-width="180">
          <template slot-scope="scope">
            <div>{{ handleTimestamp(scope.row.createTime) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row.orderNo)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="cross-pagination">
      <el-pagination
        :current-page.sync="searchForm.page"
        :page-size="searchForm.pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <coe-detail-dialog
      :visible="coeDetailDialog"
      :coe-detail="coeDetail"
      @close="handleDialogClose"
    ></coe-detail-dialog>
  </div>
</template>

<script>
import { STATUS_LIST } from './constant'
import moment from 'moment'
import * as API from './api'
import CoeDetailDialog from './coeDetailDialog'
import { deleteEmptyParam } from '@/utils'

export default {
  components: {
    CoeDetailDialog,
  },
  data() {
    return {
      colProps: {
        xs: 24,
        sm: 12,
        lg: 12,
        xl: 6,
      },
      statusList: STATUS_LIST,
      total: 0,
      searchForm: {
        page: 1,
        pageSize: 20,
        addTimeEnd: '',
        addTimeStart: '',
        ebcCode: '',
        ebcName: '',
        orderNo: '',
        status: '',
      },
      dataList: [],
      coeDetail: {},
      coeDetailDialog: false,
    }
  },
  methods: {
    handleSearch() {
      this.searchForm.page = 1
      this.getList()
    },
    getList() {
      if (this.searchForm.timeArray && this.searchForm.timeArray.length === 2) {
        this.searchForm.addTimeStart = String(
          parseInt(this.searchForm.timeArray[0].getTime() / 1000),
        )
        this.searchForm.addTimeEnd = String(
          parseInt(this.searchForm.timeArray[1].getTime() / 1000),
        )
      } else {
        this.searchForm.addTimeEnd = ''
        this.searchForm.addTimeStart = ''
      }
      const params = { ...this.searchForm }
      delete params.timeArray
      deleteEmptyParam(params)
      API.customsList(params).then(res => {
        if (res && res.data) {
          this.dataList = res.data.rows
          this.total = res.data.total
        }
      })
    },
    reset() {
      const page = this.searchForm.page
      this.searchForm = {
        page,
        pageSize: 20,
        addTimeEnd: '',
        addTimeStart: '',
        ebcCode: '',
        ebcName: '',
        orderNo: '',
        status: '',
      }
      this.getList()
    },
    handleDetail(orderNo) {
      API.coeDetail({ orderNo }).then(res => {
        if (res && res.data) {
          this.coeDetail = res.data
          this.coeDetailDialog = true
        }
      })
    },
    handleDialogClose() {
      this.coeDetail = {}
      this.coeDetailDialog = false
    },
    handleStatus(status) {
      let s = ''
      STATUS_LIST.some(v => {
        if (v.value === status) {
          s = v.label
          return true
        }
        return false
      })
      return s
    },
    handleTimestamp(timestamp) {
      return moment(Number(timestamp) * 1000).format('YYYY-MM-DD HH:mm:ss')
    },
    handleCurrentChange(val) {
      this.searchForm.page = val
      this.getList()
    },
  },
}
</script>

<style lang="scss" scoped>
.cross {
  width: 100%;
  height: 100%;
  background: #ffffff;
  box-sizing: border-box;
  font-family: PingFangSC-Regular;
  padding: 24px;
  &-table {
    width: 100%;
  }
  &-pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
  }
  /deep/.el-select {
    width: 100%;
  }
}
</style>
