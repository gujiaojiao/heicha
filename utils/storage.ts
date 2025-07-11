class Storage {
  /**
   * 设置存储
   * @param key 键
   * @param value 值
   * @param expire 过期时间（秒），默认永久
   */
  static set(key: string, value: any, expire?: number) {
    const data = {
      value,
      expire: expire ? Date.now() + expire * 1000 : null
    }
    uni.setStorageSync(key, JSON.stringify(data))
  }

  /**
   * 获取存储
   * @param key 键
   * @param defaultValue 默认值
   */
  static get(key: string, defaultValue: any = null) {
    const data = uni.getStorageSync(key)
    if (data) {
      try {
        const { value, expire } = JSON.parse(data)
        // 未过期或永久有效
        if (!expire || expire > Date.now()) {
          return value
        }
        // 已过期则删除
        uni.removeStorageSync(key)
      } catch (e) {
        console.error(`Storage.get parse error: ${e}`)
      }
    }
    return defaultValue
  }

  /**
   * 删除存储
   * @param key 键
   */
  static remove(key: string) {
    uni.removeStorageSync(key)
  }

  /**
   * 清空存储
   */
  static clear() {
    uni.clearStorageSync()
  }
}

export default Storage 