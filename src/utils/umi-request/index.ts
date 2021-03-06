import {
  GlobalHttpOptions,
  SingleHttpOptions,
} from './interface'
import { 
  RequestMethod, 
  RequestResponse, 
  ResponseError,
} from './umi-request.d'
import createExtendRequestInstance from './extend-request'
import UrlCache from './cache'

export default (function() {
  let globalHttpOption: GlobalHttpOptions = {}
  let umiInstance: RequestMethod | null = null
  let urlCache: UrlCache =  new UrlCache()

  function startFetch<T, R>(options: SingleHttpOptions) {

    return new Promise<RequestResponse<R>>((resolve, reject) => {
      if (!umiInstance) {
        return reject(new Error('请先进行实例化操作requestInit'))
      }
      
      const newOptions = {
        ...globalHttpOption,
        ...options
      }

      // 处理不传递method的情况（默认为get）
      if (!options.method) {
        if (options.hasOwnProperty('data')) {// post
          options.method = 'post'
        } else { // 默认为get方法
          options.method = 'get'
          if (!options.requestType) {
            options.requestType = 'form'
          }
        }
      } else {
        options.method = options.method.toLowerCase()
      }

      // 重复请求，拦截处理
      if (options.throttleTimeout > 0) {
        if (!urlCache.checkUrl({
          url: options.url,
          params: options.params || options.data || {},
          method: options.method
        }, options.throttleTimeout)) {
          return
        }
      }

      // 处理二次确认框
      if (options.confirmText && !options.confirmInstance) {
        if (typeof globalHttpOption.du.beforeRequestConfirmCB === 'function') {
          return resolve(globalHttpOption.du.beforeRequestConfirmCB(options))
        }
      }

      // 传递含有自定义属性的newOptions进去，在拦截器中会删除自定义属性，只保留umi-request原生属性
      // @ts-ignore
      return umiInstance[options.method](options.url, newOptions)
      .then((response: RequestResponse<R>) => {
        // 处理http status=200的情况
        // console.log("response>>>", response)
        // @ts-ignore
        const { code, status, data: responseData, msg } = response || {}
        const finalCode = code === undefined ? status : code
        
        if (finalCode === 0 || finalCode === 200) {
          if (
            globalHttpOption.du &&
            typeof globalHttpOption.du.successCallback === 'function'
          ) {
            globalHttpOption.du.successCallback(responseData, options)
          }
          resolve(response)
        } else {
          // 处理文件流
          if (options.responseType === 'blob' || options.getResponse === true) {// blob或者是getResponse=true
            // 后续待优化，这里无论成功还是失败都直接返回，在then中获取
            return resolve(response)
          }
          // 兼容处理（errorHandler和globalHttpOption.du.errorCallback）,防止重复进行错误处理
          // globalHttpOption.errorHandler优先级高于globalHttpOption.du.errorCallback
          if (
            !globalHttpOption.errorHandler &&
            globalHttpOption.du &&
            typeof globalHttpOption.du.errorCallback === 'function'
          ) {
            globalHttpOption.du.errorCallback(
              msg,
              options,
              response
            )
          }
          reject(response)
        } 
      }).catch(async (error: ResponseError) => {
        // 兼容处理（errorHandler和globalHttpOption.du.errorCallback）,防止重复进行错误处理
        // globalHttpOption.errorHandler优先级高于globalHttpOption.du.errorCallback
        const { response } = error
        if (response) {
          const resp: any = response
          try {
            if (!resp['data']) {
              // 能转化为json的情况
              resp['data'] = await response.clone().json()
            }
          } catch(err) {}

          if (globalHttpOption.errorHandler && 
            typeof globalHttpOption.errorHandler === 'function') {
              globalHttpOption.errorHandler(error)
          } else if (
            globalHttpOption.du &&
            typeof globalHttpOption.du.errorCallback === 'function'
          ) {
            globalHttpOption.du.errorCallback(
              resp['data'] ? resp['data'].msg : null,
              options,
              resp
            )
          }
          reject(resp)
        } else {
          reject(error)
        }
      })
    })
  }

  return {
    requestInit(options: GlobalHttpOptions): RequestMethod {
      if (!umiInstance) umiInstance = createExtendRequestInstance(options)
      if (options) globalHttpOption = options

      // 这里返回与否意义不大，request内部会直接使用umiInstance实例
      return umiInstance
    },
    request<T = any, R = any>(
      options: SingleHttpOptions
    ): Promise<RequestResponse<R>> {
      return startFetch<T, R>(options)
    }
  }
})()
