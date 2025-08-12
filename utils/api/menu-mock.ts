// 菜单分类类型
export interface MenuCategory {
  id: number
  name: string
  icon: string // 可用 static/images/menu/ 下的图片或内置icon
}

// 商品类型
export interface MenuProduct {
  id: number
  categoryId: number
  name: string
  desc: string
  imageUrl: string
  price: number
  isNew?: boolean
}

// 获取菜单分类
export const getMenuCategories = (): Promise<MenuCategory[]> => {
  return Promise.resolve([
    { id: 1, name: '新品上市', icon: 'NEW' },
    { id: 2, name: '只此系列', icon: '/static/images/menu/alittle.png' },
    { id: 3, name: '花果奶茶', icon: '/static/images/menu/alittle.png' },
    { id: 4, name: '奶茶自助配', icon: '/static/images/menu/alittle.png' },
    { id: 5, name: '点口感', icon: '/static/images/menu/alittle.png' },
	{ id: 6, name: '点口感', icon: '/static/images/menu/alittle.png' },
	{ id: 7, name: '点口感', icon: '/static/images/menu/alittle.png' },
	{ id: 8, name: '点口感', icon: '/static/images/menu/alittle.png' },
	{ id: 9, name: '点口感', icon: '/static/images/menu/alittle.png' },
	
  ])
}

// 获取商品列表
export const getMenuProducts = (): Promise<MenuProduct[]> => {
  return Promise.resolve([
    {
      id: 101,
      categoryId: 1,
      name: '007酸奶草莓绿',
      desc: '优选卡士007（7种活性益生菌）原味酸奶，搭配古茗茉莉花绿茶，草莓果肉',
      imageUrl: '/static/images/menu/siji.png',
      price: 15.00,
      isNew: true
    },
    {
      id: 102,
      categoryId: 1,
      name: '夏蓉葡萄奶绿',
      desc: '精选优质巨峰葡萄与西班牙Bobal红葡萄特制原汁，饱含浓郁果香',
      imageUrl: '/static/images/menu/manyuemei.png',
      price: 14.00,
      isNew: true
    },
    {
      id: 201,
      categoryId: 2,
      name: '贝此奶茶',
      desc: '经典奶茶，口感丝滑',
      imageUrl: '/static/images/menu/mango.png',
      price: 12.00
    },
    {
      id: 301,
      categoryId: 3,
      name: '花果奶茶A',
      desc: '花果香气，清新爽口',
      imageUrl: '/static/images/menu/bale.png',
      price: 13.00
    },
    {
      id: 401,
      categoryId: 4,
      name: '自助配奶茶',
      desc: '自选配料，DIY你的专属奶茶',
      imageUrl: '/static/images/menu/hongchanaigai.png',
      price: 16.00
    },
    {
      id: 501,
      categoryId: 5,
      name: '点口感奶茶',
      desc: '多种口感可选',
      imageUrl: '/static/images/menu/mocha.png',
      price: 15.00
    }
  ])
} 