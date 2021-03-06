import UmiRequest from '@my-util/umi-request'

/**
 * 跨境出口申报管理列表-查询列表
 * @param {*} params
 * @param {*} vm
 */
export const getExprotOrderList = (params, vm) =>
  UmiRequest.request({
    url: '/api/v1/h5/oversea/backend/export/exportList',
    params,
    vm,
    loadingKey: 'loading',
  })

// /**
//  * 跨境出口申报管理列表-查询申报详情
//  * @param {*} params
//  * @param {*} vm
//  */
// export const getOrderDetail = (params) =>
//   UmiRequest.request({
//     url: '/api/v1/h5/oversea/backend/getDetail',
//     params,
//   })
