import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  count: number
  attrs?: string[]
}

export const useCartStore = defineStore('cart', () => {
  const cartList = ref<CartItem[]>([])

  // 计算总价
  const total = computed(() => {
    return cartList.value.reduce((sum, item) => {
      return sum + item.price * item.count
    }, 0)
  })

  // 计算总数量
  const count = computed(() => {
    return cartList.value.reduce((sum, item) => {
      return sum + item.count
    }, 0)
  })

  // 添加到购物车
  function addToCart(item: CartItem) {
    const existItem = cartList.value.find(i => 
      i.id === item.id && 
      JSON.stringify(i.attrs) === JSON.stringify(item.attrs)
    )
    
    if (existItem) {
      existItem.count += item.count
    } else {
      cartList.value.push(item)
    }
  }

  // 从购物车移除
  function removeFromCart(index: number) {
    cartList.value.splice(index, 1)
  }

  // 更新商品数量
  function updateItemCount(index: number, count: number) {
    if (count < 1) {
      removeFromCart(index)
      return
    }
    cartList.value[index].count = count
  }

  // 清空购物车
  function clearCart() {
    cartList.value = []
  }

  return {
    cartList,
    total,
    count,
    addToCart,
    removeFromCart,
    updateItemCount,
    clearCart
  }
}) 