export interface Banner {
  id: number
  imageUrl: string
  link: string
}

export interface UserInfo {
  nickname: string
  isVip: boolean
  couponCount: number
  avatar: string
}

export const getMockBanners = (): Promise<Banner[]> => {
  return Promise.resolve([
    {
      id: 1,
      imageUrl: '/static/images/banner/alittle-banner1.jpg',
      link: '/pages/product/detail?id=1'
    },
    {
      id: 2,
      imageUrl: '/static/images/banner/alittle-banner2.jpg',
      link: '/pages/product/detail?id=2'
    },
    {
      id: 3,
      imageUrl: '/static/images/banner/alittle-banner3.jpg',
      link: '/pages/product/detail?id=3'
    },
    {
      id: 4,
      imageUrl: '/static/images/banner/alittle-banner4.jpg',
      link: '/pages/product/detail?id=4'
    },
    {
      id: 5,
      imageUrl: '/static/images/banner/alittle-banner5.jpg',
      link: '/pages/product/detail?id=5'
    },
    {
        id: 6,
        imageUrl: '/static/images/banner/alittle-banner6.jpg',
        link: '/pages/product/detail?id=6'
    }
  ])
}

export const getMockUserInfo = (): Promise<UserInfo> => {
  return Promise.resolve({
    nickname: '嗨, J.',
    isVip: true,
    couponCount: 7,
    avatar: '/static/images/index/xiaoxin.png'
  })
}

export const getQuickEntries = () => {
  return Promise.resolve([
    {
      id: 1,
      title: '到店自取',
      subtitle: '即刻点单免排队',
      icon: 'drink',
      link: '/pages/menu/index'
    },
    {
      id: 2,
      title: '外卖点单',
      subtitle: '点点送到家',
      icon: 'scooter',
      link: '/pages/menu/index'
    }
  ])
}

export const getToolEntries = () => {
  return Promise.resolve([
    {
      id: 1,
      title: '加入社群',
      icon: 'gift',
      link: '/pages/community/index'
    },
    {
      id: 2,
      title: '领券中心',
      icon: 'coupon',
      link: '/pages/coupon/index'
    },
    {
      id: 3,
      title: '积分商城',
      icon: 'shop',
      link: '/pages/points/index'
    },
    {
      id: 4,
      title: '点门团餐',
      icon: 'group',
      link: '/pages/group/index'
    }
  ])
} 