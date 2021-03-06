<template>
  <div class="card-list">
    <el-table
      v-loading="loading"
      :data="list"
      border
      max-height="630"
      style="width: 100%"
    >
      <el-table-column
        v-for="(col, index) in columnsConfig"
        :key="index"
        align="center"
        v-bind="col"
      >
        <template slot-scope="{ row }">
          <div v-if="col.prop.endsWith('Time')">
            {{ row[col.prop] | formatTime }}
          </div>
          <div v-else-if="col.filter">
            {{ row[col.prop] | formatStr(col.prop) }}
          </div>
          <div v-else-if="(col.prop || '').split('.').length > 1">
            {{ row | formatDeep(col.prop, col.defaultValue) }}
          </div>
          <div v-else>
            {{ row[col.prop] || col.defaultValue || '' }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        width="120"
        label="操作"
        align="center"
        fixed="right"
      >
        <template slot-scope="{ row }">
          <el-button
            type="text"
            size="small"
            @click="showDetailDialog(row)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页区域-->
    <el-row class="pagination" type="flex" justify="end">
      <el-pagination
        layout="total, prev, pager, next, jumper"
        v-bind="pagination"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
    <list-detail-dialog
      v-bind="detailDialog"
      @close="hideDetailDialog"
    ></list-detail-dialog>
  </div>
</template>

<script>
// 接口引入
import * as API from './api'
import ListDetailDialog from './list-detail-dialog'
import moment from 'moment'
import { TradeStatusMap } from './config'

export default {
  filters: {
    formatTime: function (val) {
      return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    formatDeep: function (record, prop, defaultValue) {
      const attrs = (prop || '').split('.')
      const res = attrs.reduce((pre, cur) => pre && (pre[cur] || pre[cur] === 0) ? pre[cur] : '', record || {})
      return res || defaultValue || ''
    },
    formatStr: function (val, prop) {
      switch (prop) {
        case 'sendStatus':
          return val || val === 0 ? TradeStatusMap[val] : ''
      }
      return val
    },
  },
  components: {
    ListDetailDialog,
  },
  // 父组件传参
  props: {
    list: {
      type: Array,
      required: true,
    },
    pagination: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 表格列配置
      columnsConfig: [
        { prop: 'dewuOrderNo', label: '得物订单号', minWidth: 180 },
        { prop: 'poizonOrderNo', label: 'POIZON订单号', minWidth: 120 },
        { prop: 'setNo', label: '集包号', minWidth: 150 },
        // { prop: 'productName', label: '清关物流代码', minWidth: 250 },
        { prop: 'waybillNo', label: '航空运单号', minWidth: 150 },
        { prop: 'sendContent.expressCompany', label: '物流公司', minWidth: 180, defaultValue: '东航' },
        { prop: 'sendContent.mawbno', label: '运单号', minWidth: 180 },
        { prop: 'sendStatus', label: '申报状态', minWidth: 180, filter: true },
        // { prop: 'payTime', label: '订单支付时间', minWidth: 180 },
        { prop: 'sendTime', label: '申报时间', minWidth: 180 },
      ],
      detailDialog: {
        visible: false,
        dialogData: {},
      },
    }
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.$emit('curpageChange', currentPage)
    },
    showDetailDialog(row) {
      this.detailDialog = {
        visible: true,
        dialogData: row,
      }
    },
    hideDetailDialog() {
      this.detailDialog = {
        visible: false,
        dialogData: {},
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.pagination {
  margin-top: 24px;
}
</style>
