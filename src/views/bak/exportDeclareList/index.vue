<template>
  <div class="content-container">
    <!-- 查询区域 -->
    <list-search
      ref="search"
      @search="handleSearch"
      @reset="handleReset"
    ></list-search>
    <!--表格区域-->
    <list-table
      :list="list"
      :loading="loading"
      :pagination="pagination"
      @curpageChange="handleCurpageChange"
    ></list-table>
  </div>
</template>

<script>
// 接口引入
import * as API from './api'
// 子组件引入
import ListTable from './list-table'
import ListSearch from './list-search'

export default {
  // 子组件声明
  components: {
    ListTable,
    ListSearch,
  },
  data() {
    return {
      loading: false,
      // 分页属性
      pagination: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
      },
      // ListTable 数据
      list: [],
    }
  },
  // 初始接口数据的请求不要放在created
  mounted() {
    this.$refs.search.handleSearch()
  },
  methods: {
    // 查询数据
    queryData(data = null) {
      if (!data) {
        data = this.$refs.search.getParams()
      }
      const params = {
        page: this.pagination.currentPage,
        pageSize: this.pagination.pageSize,
        ...data,
      }

      if (params.sendTime) {
        params.sendTimeBegin = params.sendTime.length ? new Date(params.sendTime[0]).getTime() : ''
        params.sendTimeEnd = params.sendTime.length > 1 ? new Date(params.sendTime[1]).getTime() : ''
        delete params.sendTime
      }

      API.getExprotOrderList(params, this).then(res => {
        if (res.code === 200) {
          console.log('res.data', res.data)
          this.list = res.data.rows || []
          this.pagination.total = Number(res.data.total)
        }
      }).catch(e => {
        // this.list = [
        //   {
        //     createTime: '2021-01-08T03:28:31.005Z',
        //     dewuOrderNo: 'string',
        //     id: 1,
        //     isDel: 0,
        //     maxRetryTimes: 0,
        //     modifyTime: '2021-01-08T03:28:31.005Z',
        //     page: 1,
        //     pageSize: 20,
        //     poizonOrderNo: 'string',
        //     predictRetryTime: '2021-01-08T03:28:31.005Z',
        //     queryResult: {
        //       code: 'string',
        //       message: 'string',
        //       remark: 'string',
        //       status: 'string',
        //     },
        //     sendContent: {
        //       bigbag: 'string',
        //       mawbno: 'string',
        //       parcel: [
        //         {
        //           consignee: 'string',
        //           consigneeAddress: 'string',
        //           consigneeCountry: 'string',
        //           consigneePhone: 'string',
        //           currency: 'string',
        //           logisticsNo: 'string',
        //           orderNo: 'string',
        //           shipper: 'string',
        //           shipperAddress: 'string',
        //           shipperCountry: 'string',
        //           shipperPhone: 'string',
        //           skus: [
        //             {
        //               currency: 'string',
        //               hsCode: 'string',
        //               itemBrand: 'string',
        //               itemEname: 'string',
        //               itemModel: 'string',
        //               itemName: 'string',
        //               itemUrl: 'string',
        //               price: 0,
        //               quantity: 0,
        //               sku: 'string',
        //               totalprice: 0,
        //             },
        //           ],
        //           totalPrice: 0,
        //           totalWeight: 0,
        //         },
        //       ],
        //     },
        //     sendResult: {
        //       code: 'string',
        //       message: 'string',
        //     },
        //     sendStatus: 0,
        //     sendTime: '2021-01-08T03:28:31.005Z',
        //     sendTimeBegin: '2021-01-08T03:28:31.005Z',
        //     sendTimeEnd: '2021-01-08T03:28:31.005Z',
        //     setNo: 'string',
        //     useRetryTimes: 0,
        //     waybillNo: 'string',
        //   },
        // ]
      })
    },
    // 刷新
    handleCurpageChange(currentPage) {
      this.pagination.currentPage = currentPage
      this.queryData()
    },
    // 搜索
    handleSearch(data) {
      this.pagination.currentPage = 1
      this.queryData(data)
    },
    // 重置
    handleReset(data) {
      this.pagination.currentPage = 1
      this.queryData(data)
    },
  },
}
</script>

<style lang="scss" scoped>
	.content-container {
    width: 100%;
    height: 100%;
    background: #ffffff;
    box-sizing: border-box;
    font-family: PingFangSC-Regular;
    padding: 30px;
  }
</style>
