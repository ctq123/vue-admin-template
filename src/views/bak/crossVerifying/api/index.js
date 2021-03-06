import UmiRequest from '@du/umi-request'

/**
 * 跨境订单待校验列表-查询列表
 * @param {*} params
 * @param {*} vm
 */
export const getLimitOrder = (params, vm) =>
  UmiRequest.request({
    url: '/api/v1/h5/oversea/backend/getLimitOrder',
    params,
    vm,
    loadingKey: 'loading',
  })
