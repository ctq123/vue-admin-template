/**
 * cache对象
 * 默认5M，初始化时可重置大小
 */
export class MapCache {
  private cache
  private maxSize
  constructor(props: any = {}) {
    this.cache = new Map()
    // 默认5M
    this.maxSize = (props && props.maxSize > 0) ? props.maxSize : 5 * 1024 * 1024 
  }
  
  get(key: any) {
    return this.cache.get(JSON.stringify(key))
  }

  set(key: any, value: any) {
    const cacheKey = JSON.stringify(key)
    // 超出大小时，剔除第一个
    if (this.cache.size >= this.maxSize) {
      const deleteKey = Array.from(this.cache.keys())[0]
      this.cache.delete(deleteKey)
    }
    this.cache.set(cacheKey, value)
  }

  delete(key: any) {
    this.cache.delete(JSON.stringify(key))
  }

  clear() {
    this.cache.clear()
  }
}

/**
 * 存储url的cache对象
 * 默认5M
 */
export class UrlCache extends MapCache {
  /**
   * 判断url是否有效，并存储url
   * @param key 
   * @param ttl 
   * @return true表示有效，false表示无效（无效表示属于间隔时间内的重复请求）
   */
  checkUrl(key: any, ttl: any) {
    const curTime = Date.now()
    const lastTime = this.get(key)
    if (lastTime && curTime - lastTime <= ttl) {// 在规定时间内的重复请求，视为无效
      return false
    }
    this.set(key, curTime)
    return true
  }
}

export default UrlCache