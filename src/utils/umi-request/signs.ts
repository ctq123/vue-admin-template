import { RequestConfig, IObecjt } from './interface'
import { parseTokenDraft } from '@my-util/utils'

function addNoSign(config: RequestConfig): RequestConfig {
  config.url =
    config.url.indexOf('?') > -1
      ? config.url + `&noSign=true`
      : config.url + `?noSign=true`

  return config
}

/**
 * @description: 请求拦截器加上sign方法
 * @param {type}
 * @return:
 */
function addSign(
  config: RequestConfig,
  secretKey: string = '048a9c4943398714b356a696503d2d36'
): RequestConfig {
  const { options, url } = config
  const newOptions: IObecjt = { ...options }
  let newUrl = url
  const { data, params={}, du, isDebugSign=false } = newOptions
  const dataType = Object.prototype.toString.call(data)
  const paramsType = Object.prototype.toString.call(params)
  // 优先获取自定义生成sign函数
  const generateSign = du && du.generateSign ? du.generateSign : parseTokenDraft
  
  // 上传文件流，直接返回
  if (dataType === '[object FormData]' || paramsType === '[object FormData]') {
    return config
  }

  if (dataType === '[object Object]') {
    const sign = secretKey ? generateSign(data, secretKey, isDebugSign) : generateSign(data, secretKey, isDebugSign)
    newUrl = url + `?sign=${sign}`
  } else if (paramsType === '[object Object]') {
    const sign = secretKey ? generateSign(params, secretKey, isDebugSign) : generateSign(params, secretKey, isDebugSign)
    newOptions.params['sign'] = sign
  }

  return {
    url: newUrl,
    options: newOptions
  }
}

export default { addSign, addNoSign }
