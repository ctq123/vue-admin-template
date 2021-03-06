import { 
  extend,
} from './umi-request.es'
import { 
  RequestMethod,
} from './umi-request.d'
import { GlobalHttpOptions, RequestConfig, HttpOptions } from './interface'
import signs from './signs'
// import { filterInvalidProperty } from './util'

/**
 * 添加签名sign
 * @param config 
 */
function setSignBeforeRequest(config: RequestConfig): RequestConfig {
  let { url, options } = config
  if (options.du && !options.isDelSign) {
    // if (options.noSign || options.du.noSign) {// 单个请求的noSign或者全局noSign
    //   config = signs.addNoSign({ url, options })
    // } else {
    //   // 统一加sign
    //   config = signs.addSign({ url, options }, options.du.secretKey)
    // }
    config = signs.addSign({ url, options }, options.du.secretKey)
  }
  return config
}

// /**
//  * 过滤参数无效属性值
//  * @param config 
//  */
// function filterInvalidParamsBeforeRequest(config: RequestConfig): RequestConfig {
//   const { url, options } = config
//   const newOptions = { ...options }
//   const { du, data, params, filterInvalidParams } = newOptions
//   // 是否需要过滤无效属性值
//   if (filterInvalidParams === true || 
//     (filterInvalidParams !== false && du && du.filterInvalidParams)
//     ) {
//     // 过滤无效属性值集合
//     let invalidParams = ['', undefined, null]
//     if (newOptions.invalidParams && newOptions.invalidParams.length) {// 针对特殊情况，过滤自定义集合
//       invalidParams = newOptions.invalidParams
//     }
//     // 默认过滤['', undefined, null]
//     const dataType = Object.prototype.toString.call(data)
//     const paramsType = Object.prototype.toString.call(params)
//     if (dataType === '[object Object]') {
//       filterInvalidProperty(newOptions.data, invalidParams)
//     } else if (paramsType === '[object Object]') {
//       filterInvalidProperty(newOptions.params, invalidParams)
//     }
//   }
//   return {
//     url,
//     options: newOptions,
//   }
// }

/**
 * 过滤\u00A0\u0020\u3000字符
 * 会改变params
 * @param config 
 */
function filterParams(config: RequestConfig): RequestConfig {
  const { options } = config
  const dataType = Object.prototype.toString.call(options.data)
  const paramsType = Object.prototype.toString.call(options.params)
  if (dataType === '[object Object]') {
    const jsonStr = JSON.stringify(options.data)
    if (/[\u00A0\u0020\u3000]/g.test(jsonStr)) {// 只有包含特殊字符，才修改入参
      options.data = JSON.parse(jsonStr.replace(/[\u00A0\u0020\u3000]/g, ' '))
    }
  } else if (paramsType === '[object Object]') {
    const jsonStr = JSON.stringify(options.params)
    if (/[\u00A0\u0020\u3000]/g.test(jsonStr)) {// 只有包含特殊字符，才修改入参
      options.params = JSON.parse(jsonStr.replace(/[\u00A0\u0020\u3000]/g, ' '))
    }
  }
  return config
}

/**
 * 创建extend实例
 * @param options 
 */
function createExtendRequestInstance(options: GlobalHttpOptions): RequestMethod {
  const { du, ...extendOptions } = options
  // @ts-ignore
  const extendRequest: RequestMethod = extend({
    ...extendOptions,
  })

  // request请求拦截器
  extendRequest.interceptors.request.use((url: string, options: HttpOptions) => {
    let config = { url, options }

    if (!options) {
      return config
    }
    
    if (options.du && typeof options.du.beforeRequestCB === 'function') {
      options.du.beforeRequestCB(options)
    }

    // 验签之前先过滤特殊转义空格（注意：会改变params）
    config = filterParams(config)

    // // 改变options.params或options.data，过滤无效属性值
    // config = filterInvalidParamsBeforeRequest(config)
    // 改变url或options，添加sign
    config = setSignBeforeRequest(config)
    // // 剔除自定义属性
    // const { url: newUrl, options: newOptions } = config
    // const { 
    //   url: originUrl,
    //   noSign,
    //   msg,
    //   showSuccessTips,
    //   filterInvalidParams,
    //   invalidParams,
    //   du,
    //   ...umiOptions
    // } = newOptions
    return config
  })

  // request响应拦截器
  extendRequest.interceptors.response.use(async (response: any, options: any) => {
    // 返回后处理回调
    if (options.du && typeof options.du.afterResponseCB === 'function') {
      options.du.afterResponseCB(options)
    }
    return response
  })

  return extendRequest
}

export default createExtendRequestInstance