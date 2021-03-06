import { 
  RequestOptionsInit,
  RequestMethod,
} from './umi-request.d'

interface DuConfig {
  secretKey?: string
  // 是否需要过滤无效属性值，默认['', undefined, null]（针对普遍情况）
  filterInvalidParams?: boolean,
  // 请求前回调
  beforeRequestCB?: (options: any) => void,
  // 请求后回调
  afterResponseCB?: (options: any) => void,
  // 成功回调
  successCallback?: (any: any, DuHttpOptions: SingleHttpOptions) => void
  // 失败回调
  errorCallback?: (
    errmsg: string, 
    options: SingleHttpOptions,
    Response: any
  ) => void
  // 二次确认框
  beforeRequestConfirmCB?: (options: any) => any,
  // 自定义生成sign函数
  generateSign?: (params: object, secretKey?: string) => string
}

/**
 * 单个请求的配置项
 *
 * @export
 * @interface SingleHttpOptions
 * @template T
 */
export interface SingleHttpOptions extends RequestOptionsInit {
  url: string
  showSuccessTips?: boolean
  showFailTips?: boolean
  // 是否去除sign这个字段，不经过验签（不走网关）
  isDelSign?: boolean
  // 验签是否需要debug
  isDebugSign?: boolean
  msg?: string
  // 频繁请求的间隔时间
  throttleTimeout?: number
  // 二次确认框提示信息
  confirmText?: string
  // 二次确认框实例
  confirmInstance?: any,
  // 二次确认框回调
  confirmDone?: () => void,
  // 是否需要过滤无效属性值（针对特殊情况）
  filterInvalidParams?: boolean
  // 无效属性值集合，默认['', undefined, null]（针对特殊情况）
  invalidParams?: Array<any>
}

/**
 * 初始化的配置项
 */
export interface GlobalHttpOptions extends RequestOptionsInit {
  du?: DuConfig
}

/**
 * SingleHttpOptions和GlobalHttpOptions的集合
 */
export interface HttpOptions extends RequestOptionsInit {
  url?: string
  showSuccessTips?: boolean
  showFailTips?: boolean
  // 是否去除sign这个字段，不经过验签（不走网关）
  isDelSign?: boolean
  // 验签是否需要debug
  isDebugSign?: boolean
  msg?: string
  // 二次确认框提示信息
  confirmText?: string
  // 二次确认框实例
  confirmInstance?: any,
  // 二次确认框回调
  confirmDone?: () => void,
  // 频繁请求的间隔时间
  throttleTimeout?: number
  filterInvalidParams?: boolean
  invalidParams?: Array<any>
  du?: DuConfig
}

export interface RequestConfig {
  url: string,
  options: HttpOptions
}

export interface IObecjt {
  [key: string]: any
}

export interface ResponseObject {
  [key: string]: any
}

export declare function request<R = any>(
  options: SingleHttpOptions
): Promise<R>

export declare function requestInit(options: GlobalHttpOptions): RequestMethod

interface ServiceExport {
  request: typeof request
  requestInit: typeof requestInit
}

declare const ServiceExport: ServiceExport

export default ServiceExport
