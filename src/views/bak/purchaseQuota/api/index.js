import UmiRequest from '@du/umi-request'

/**
 * 跨境购买额度列表-查询列表
 * @param {*} params
 * @param {*} vm
 */
export const getLimitCustoms = (params, vm) =>
  UmiRequest.request({
    url: '/api/v1/h5/oversea/backend/getLimitCustoms',
    params,
    vm,
    loadingKey: 'loading',
  })

/**
 * 跨境购买额度列表-编辑额度
 * @param {*} params
 * @param {*} vm
 */
export const editLimitCustoms = (params, vm) =>
  UmiRequest.request({
    url: '/api/v1/h5/oversea/backend/limitCustoms',
    data: params,
    vm,
    loadingKey: 'editLoading',
  })
