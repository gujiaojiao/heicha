import { useUserStore } from '@/store/user'

interface RequestOptions extends UniApp.RequestOptions {
  loading?: boolean
  toast?: boolean
}

const BASE_URL = 'https://api.example.com'

class Request {
  private static instance: Request
  private userStore = useUserStore()

  private constructor() {}

  static getInstance() {
    if (!Request.instance) {
      Request.instance = new Request()
    }
    return Request.instance
  }

  // 请求拦截器
  private beforeRequest(options: RequestOptions) {
    const token = this.userStore.token
    if (token) {
      options.header = {
        ...options.header,
        Authorization: `Bearer ${token}`
      }
    }
    
    if (options.loading) {
      uni.showLoading({
        title: '加载中...',
        mask: true
      })
    }
  }

  // 响应拦截器
  private handleResponse(response: UniApp.RequestSuccessCallbackResult, options: RequestOptions) {
    if (options.loading) {
      uni.hideLoading()
    }

    const { statusCode, data } = response

    if (statusCode === 200) {
      if (data.code === 0) {
        return data.data
      } else {
        if (options.toast) {
          uni.showToast({
            title: data.message || '请求失败',
            icon: 'none'
          })
        }
        return Promise.reject(data)
      }
    } else if (statusCode === 401) {
      // token过期，清除用户信息并跳转登录页
      this.userStore.clearUserInfo()
      uni.navigateTo({
        url: '/pages/login/index'
      })
      return Promise.reject(new Error('未登录或登录已过期'))
    } else {
      if (options.toast) {
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        })
      }
      return Promise.reject(new Error('网络错误'))
    }
  }

  async request<T>(options: RequestOptions): Promise<T> {
    this.beforeRequest(options)

    try {
      const response = await uni.request({
        ...options,
        url: BASE_URL + options.url
      }) as UniApp.RequestSuccessCallbackResult
      
      return this.handleResponse(response, options) as Promise<T>
    } catch (error) {
      if (options.loading) {
        uni.hideLoading()
      }
      return Promise.reject(error)
    }
  }

  get<T>(url: string, data?: any, options: Partial<RequestOptions> = {}) {
    return this.request<T>({
      url,
      data,
      method: 'GET',
      loading: false,
      toast: true,
      ...options
    })
  }

  post<T>(url: string, data?: any, options: Partial<RequestOptions> = {}) {
    return this.request<T>({
      url,
      data,
      method: 'POST',
      loading: true,
      toast: true,
      ...options
    })
  }
}

export const request = Request.getInstance() 