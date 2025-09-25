export interface MineUserInfo {
  avatar: string
  nickname: string
  /** 手机号码 */
  memberCode: string
  points: number
  coupons: number
  phone: string
  birthday: string
  gender: string
  region: string[]
}

export interface MemberInfo {
  level: string
  expireDate: string
  growth: {
    current: number
    total: number
  }
  nextLevel: string
}

export interface MemberBenefit {
  id: number
  title: string
  icon: string
  link: string
}

export interface MineFunction {
  id: number
  title: string
  icon: string
  link: string
}

export const getMineUserInfo = (): Promise<MineUserInfo> => {
  return Promise.resolve({
    avatar: '/static/images/index/xiaoxin.png',
    nickname: 'J.',
    memberCode: '182****2800', // 手机号码
    points: 278,
    coupons: 7,
    phone: '182****2800',
    birthday: '',
    gender: '女',
    region: ['', '', '']
  })
}
export const updateMineUserInfo = (info: MineUserInfo): Promise<boolean> => {
  // 实际项目应调用后端接口，这里仅模拟
  return Promise.resolve(true)
}
export const getMemberInfo = (): Promise<MemberInfo> => {
  return Promise.resolve({
    level: '黄金点门人会员',
    expireDate: '2025/09/29',
    growth: {
      current: 80,
      total: 181
    },
    nextLevel: '钻石点门人'
  })
}

export const getMemberBenefits = (): Promise<MemberBenefit[]> => {
  return Promise.resolve([
    {
      id: 1,
      title: '会员日',
      icon: '/static/images/mine/memberDay.png',
      link: '/pages/member/day'
    },
    {
      id: 2,
      title: '积分翻倍',
      icon: '/static/images/mine/points.png',
      link: '/pages/member/points'
    },
    {
      id: 3,
      title: '生日礼',
      icon: '/static/images/mine/birthday.png',
      link: '/pages/member/birthday'
    },
    {
      id: 4,
      title: '公益助力',
      icon: '/static/images/mine/publicWelfare.png',
      link: '/pages/member/charity'
    }
  ])
}

export const getMineFunctions = (): Promise<MineFunction[]> => {
  return Promise.resolve([
    {
      id: 1,
      title: '我的订单',
      icon: '/static/images/mine/myOrder.png',
      link: '/pages/order/index'
    },
    {
      id: 2,
      title: '收货地址',
      icon: '/static/images/mine/location.png',
      link: '/pages/address/list'
    },
    {
      id: 3,
      title: '使用须知',
      icon: '/static/images/mine/instructions.png',
      link: '/pages/notice/index'
    },
    {
      id: 4,
      title: '隐私条款',
      icon: '/static/images/mine/memberAgreement.png',
      link: '/pages/privacy/index'
    }
  ])
} 