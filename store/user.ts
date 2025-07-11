import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const userInfo = ref({
    id: '',
    nickname: '',
    avatar: '',
    mobile: '',
    point: 0,
    member: false
  })

  // 设置用户信息
  function setUserInfo(info: any) {
    userInfo.value = {
      ...userInfo.value,
      ...info
    }
  }

  // 设置token
  function setToken(value: string) {
    token.value = value
  }

  // 清除用户信息
  function clearUserInfo() {
    token.value = ''
    userInfo.value = {
      id: '',
      nickname: '',
      avatar: '',
      mobile: '',
      point: 0,
      member: false
    }
  }

  return {
    token,
    userInfo,
    setUserInfo,
    setToken,
    clearUserInfo
  }
}) 