// 订单
export interface OrderProduct {
    name: string;
    imageUrl: string;
    desc: string;
    count: number;
    price: number;
  }
  
  // 当前订单类型
export interface CurrentOrder {
    id: number;
    storeAddress: string;    // 店名
    takeNumber: string;      // 取餐号
    totalCups: number;       // 本单总杯数
    products: OrderProduct[];// 订单详情
    storeTotalCups: number;  // 店家当前总共要完成的杯数
    waitCups: number;        // 还剩余几杯到你
    status: string;          // 完成状态（如“制作中”、“待取餐”、“已完成”）
  }
//   历史订单类型
  export interface OrderHistory {
    id: number;
    storeAddress: string;
    orderTime: string;
    status: string;
    type: string;
    products: OrderProduct[];
    totalPrice: number;
    buttonText: string;
  }

  // 获取历史订单列表
export const getOrderHistory = (): Promise<OrderHistory[]> => {
  return Promise.resolve([
    {
      id: 1,
      storeAddress: "苏州创业园店",
      orderTime: "2025-07-23 12:18:12",
      status: "已完成",
      type: "自取",
      products: [
        {
          name: "四季奶青",
          imageUrl: "/static/images/index/20250501140430256.png",
          desc: "中杯/去冰/不另外加糖/波霸/椰果",
          count: 1,
          price: 0.00
        }
      ],
      totalPrice: 0.00,
      buttonText: "再来一单"
    },
    {
      id: 2,
      storeAddress: "苏州创业园店",
      orderTime: "2025-07-16 13:34:00",
      status: "已完成",
      type: "自取",
      products: [
        {
          name: "四季奶青",
          imageUrl: "/static/images/index/20250501140430256.png",
          desc: "中杯/常温/不另外加糖/波霸",
          count: 1,
          price: 0.00
        }
      ],
      totalPrice: 0.00,
      buttonText: "再来一单"
    },
    {
      id: 3,
      storeAddress: "苏州创业园店",
      orderTime: "2025-06-20 13:35:26",
      status: "已完成",
      type: "自取",
      products: [
        {
          name: "四季奶青",
          imageUrl: "/static/images/index/20250501140430256.png",
          desc: "中杯/常温/不另外加糖/波霸",
          count: 1,
          price: 0.00
        }
      ],
      totalPrice: 0.00,
      buttonText: "再来一单"
    }
  ])
}

// 获取当前订单
export const getCurrentOrder = (): Promise<CurrentOrder> => {
  return Promise.resolve({
    id: 101,
    storeAddress: "苏州创业园店",
    takeNumber: "A023",
    totalCups: 2,
    products: [
      {
        name: "四季奶青",
        imageUrl: "/static/images/index/drink.png",
        desc: "大杯/去冰/波霸",
        count: 1,
        price: 12.00
      },
      {
        name: "金凤茶王",
        imageUrl: "/static/images/index/drink.png",
        desc: "中杯/常温/椰果",
        count: 1,
        price: 13.00
      }
    ],
    storeTotalCups: 8,   // 店家当前总共要做8杯
    waitCups: 3,         // 还剩3杯到你
    status: "制作中"      // 也可以是“待取餐”、“已完成”
  })
}