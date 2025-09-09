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
    storeAddress: string;
    takeNumber: string;
    totalCups: number;
    products: OrderProduct[];
    storeTotalCups: number;
    waitCups: number;
    status: string;
  }

// 声明uni全局变量
declare const uni: any;
  
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
      storeAddress: "苏州狮山龙湖店",
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
        },
		{
			name: "奶绿装芒",
			imageUrl: "/static/images/index/20250501140430256.png",
			desc: "中杯/去冰/不另外加糖/波霸",
			count: 1,
			price: 16.00
		}
      ],
      totalPrice: 16.00,
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
export const getCurrentOrder = () => {
  // 从本地存储中获取当前订单数据
  try {
    const currentOrderStr = uni.getStorageSync('currentOrder');
    console.log('currentOrderStr', currentOrderStr);
    if (currentOrderStr) {
      return Promise.resolve(JSON.parse(currentOrderStr));
    }
  } catch (error) {
    console.error('获取当前订单数据失败:', error);
  }
  
  // 如果没有本地存储的订单数据，返回空对象
  return Promise.resolve({});
  
  // 测试数据，需要时可以取消注释使用
  /*
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
    status: "制作中"      // 也可以是"待取餐"、"已完成"
  })
  */
}

// 订单详情类型（扩展历史订单信息）
export interface OrderDetail extends OrderHistory {
  orderNumber: string;      // 订单编号
  paymentMethod: string;    // 支付方式
  paymentTime: string;      // 支付时间
  pickupTime: string;       // 取餐时间
  pickupNumber: string;     // 取餐号
  storePhone: string;       // 门店电话
  storeAddressDetail: string; // 详细地址
  remark: string;           // 备注信息
}

// 获取单个订单详情
export const getOrderDetail = (id: number): Promise<OrderDetail> => {
  // 基于历史订单数据创建详情数据
  const orderHistory = getOrderHistory();
  
  return orderHistory.then(orders => {
    const order = orders.find(o => o.id === id);
    if (!order) {
      throw new Error('订单不存在');
    }
    
    // 根据订单ID返回对应的详情数据
    const orderDetails: { [key: number]: OrderDetail } = {
      1: {
        ...order,
        orderNumber: "DD20250723121812001",
        paymentMethod: "微信支付",
        paymentTime: "2025-07-23 12:18:15",
        pickupTime: "2025-07-23 12:25:00",
        pickupNumber: "B500",
        storePhone: "0512-88888888",
        storeAddressDetail: "江苏省苏州市虎丘区高新区科技城锦峰路8号",
        remark: "请尽快取餐"
      },
      2: {
        ...order,
        orderNumber: "DD20250716133400002",
        paymentMethod: "支付宝",
        paymentTime: "2025-07-16 13:34:05",
        pickupTime: "2025-07-16 13:40:00",
        pickupNumber: "C123",
        storePhone: "0512-66666666",
        storeAddressDetail: "江苏省苏州市高新区狮山路199号龙湖天街1F",
        remark: "请到店取餐"
      },
      3: {
        ...order,
        orderNumber: "DD20250620133526003",
        paymentMethod: "微信支付",
        paymentTime: "2025-06-20 13:35:30",
        pickupTime: "2025-06-20 13:42:00",
        pickupNumber: "A456",
        storePhone: "0512-88888888",
        storeAddressDetail: "江苏省苏州市虎丘区高新区科技城锦峰路8号",
        remark: "请及时取餐"
      }
    };
    
    return orderDetails[id] || orderDetails[1]; // 默认返回第一个订单详情
  });
}