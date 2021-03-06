<template>
  <el-dialog
    :title="'跨境出口申报详情'"
    :visible.sync="dialogVisible"
    width="80%"
    @close="handleClose"
  >
    <el-form label-width="auto">
      <el-row
        v-for="(rcol, k) in formConfig"
        :key="k"
      >
        <el-col
          v-if="rcol.type === 'title'"
          class="title"
        >
          {{ rcol.title }}
        </el-col>
        <el-col
          v-for="(col, key) in rcol.fields"
          v-else-if="rcol.type === 'fields'"
          :key="key"
          v-bind="col.colProps ? col.colProps : colProps"
        >
          <el-form-item
            v-if="col.prop.endsWith('Time')"
            :label="col.label"
          >
            {{ record[col.prop] | formatTime }}
          </el-form-item>
          <el-form-item
            v-else-if="['refund', 'deduct', 'compensationBuyer'].includes(col.prop)"
            :label="col.label"
          >
            {{ record[col.prop] | formatBoolean }}
          </el-form-item>
          <el-form-item
            v-else-if="col.isMoney"
            :label="col.label"
          >
            {{ record[col.prop] | formatMoney(record['currency']) }}
          </el-form-item>
          <el-form-item
            v-else-if="(col.prop || '').split('.').length > 1"
            :label="col.label"
          >
            {{ record | formatDeep(col.prop, col.defaultValue) }}
          </el-form-item>
          <el-form-item
            v-else
            :label="col.label"
          >
            {{ record[col.prop] || col.defaultValue || '' }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="default" @click="handleClose">
        关闭
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
// import * as API from './api'
import moment from 'moment'
// import { PayToolMap } from './config'

export default {
  filters: {
    formatTime: function (val) {
      return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''
    },
    formatBoolean: function (val) {
      return typeof val === 'boolean' ? (val === true ? '是' : '否') : ''
    },
    formatMoney: function (val, currency) {
      return val || val === 0 ? (val + ' ' + (currency || '')) : ''
    },
    formatDeep: function (record, prop, defaultValue) {
      const attrs = (prop || '').split('.')
      const res = attrs.reduce((pre, cur) => pre && (pre[cur] || pre[cur] === 0) ? pre[cur] : '', record || {})
      return res || defaultValue || ''
    },
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    dialogData: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      dialogVisible: false,
      record: {},
      colProps: {
        xs: 24,
        sm: 12,
        lg: 8,
        xl: 6,
      },
      // TODO 字段说明，所有pre_开头的prop字段，表示未定义的字段
      formConfig: [
        { type: 'title', title: '申报企业' },
        {
          type: 'fields',
          fields: [
            { prop: 'pre_amount', label: '申报电商企业:' },
            { prop: 'setNo', label: '集包单号:' },
            { prop: 'pre_arr.1.code', label: '小包件数:' },
            { prop: 'pre_transactionNo', label: '申报物流企业:' },
            { prop: 'waybillNo', label: '航空运单号:' },
            { prop: 'pre_refundTime', label: '支付企业代码:' },
            { prop: 'pre_deduct', label: '支付企业名称:' },
            { prop: 'pre_deductTime', label: '申报支付单号:' },
          ],
        },
        { type: 'title', title: '订单信息' },
        {
          type: 'fields',
          fields: [
            { prop: 'dewuOrderNo', label: '得物订单号:' },
            { prop: 'poizonOrderNo', label: 'POIZON订单号:' },
            { prop: 'sendContent.parcel.0.expressCompany', label: '平台发货物流公司:', defaultValue: '国际顺丰' },
            { prop: 'sendContent.parcel.0.logisticsNo', label: '平台发货物流单号:' },
            { prop: 'sendContent.parcel.0.shipper', label: '平台寄件人:' },
            { prop: 'sendContent.parcel.0.shipperPhone', label: '买家寄件电话:' },
            { prop: 'sendContent.parcel.0.shipperCountry', label: '平台寄件国家:' },
            { prop: 'sendContent.parcel.0.shipperAddress', label: '平台寄件地址:' },
            { prop: 'sendContent.parcel.0.consignee', label: '买家收货人:' },
            { prop: 'sendContent.parcel.0.consigneePhone', label: '买家收货电话:' },
            { prop: 'sendContent.parcel.0.consigneeCountry', label: '买家收货国家:' },
            { prop: 'sendContent.parcel.0.consigneeAddress', label: '买家收货地址:' },
            { prop: 'sendContent.parcel.0.totalPrice', label: '订单支付金额:', isMoney: true },
            { prop: 'pre_compensationBuyer', label: '商品申报金额:', isMoney: true },
            { prop: 'pre_compensationBuyer', label: '订单运费:', isMoney: true },
            { prop: 'sendContent.parcel.0.currency', label: '订单支付币种:' },
            { prop: 'pre_compensationBuyer', label: '订单净重:' },
            { prop: 'sendContent.parcel.0.skus.0.totalWeight', label: '订单毛重:' },
            { prop: 'sendContent.parcel.0.skus.0.sku', label: '商品货号:' },
            { prop: 'sendContent.parcel.0.skus.0.itemModel', label: '商品规格:' },
            { prop: 'pre_compensationBuyer', label: '商品条形码:' },
            { prop: 'sendContent.parcel.0.skus.0.itemName', label: '商品名称:' },
            { prop: 'sendContent.parcel.0.skus.0.hsCode', label: 'HS编码:' },
            { prop: 'pre_compensationBuyer', label: '销售单位:' },
            { prop: 'pre_compensationBuyer', label: '第一法定计量单位:' },
            { prop: 'pre_compensationBuyer', label: '第一法定数量:' },
            { prop: 'pre_compensationBuyer', label: '第二法定计量单位:' },
            { prop: 'pre_compensationBuyer', label: '第二法定数量:' },
          ],
        },
      ],
    }
  },
  watch: {
    visible: function (newVal) {
      this.dialogVisible = newVal
      if (newVal) {
        this.record = this.dialogData
        // this.getOrderDetail()
      } else {
        this.record = {}
      }
    },
  },
  methods: {
    getOrderDetail() {
      // const { sellerBiddingNo } = this.dialogData
      // if (!sellerBiddingNo) return
      // API.getOrderDetail({
      //   sellerBiddingNo,
      // }).then(res => {
      //   if (res.code === 200) {
      //     this.record = res.data
      //   }
      // })
    },
    // 关闭弹窗
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0px !important;
}
.title {
  font-size: 16px;
  font-weight: 600;
  padding: 16px 0px;
  border-bottom: 1px dotted #dcdfe6;
}
</style>
