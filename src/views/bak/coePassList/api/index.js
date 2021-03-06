import UmiRequest from '@du/umi-request'

/**
 * COE清关放行列表-查询列表
 * @param {*} params
 * @param {*} vm
 */
export const customsList = (params, vm) =>
  UmiRequest.request({
    url: '/api/v1/h5/oversea/backend/customsList',
    params,
    vm,
    loadingKey: 'loading',
  })

/**
 * COE清关放行列表-获取COE详情
 * @param {*} params
 * @param {*} vm
 */
export const coeDetail = (params, vm) =>
  UmiRequest.request({
    url: '/api/v1/h5/oversea/backend/coeDetail',
    params,
    vm,
    loadingKey: 'loading',
  })
