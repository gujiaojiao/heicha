<template>
    <view class="cart-detail" :class="{ 'show': visible }">
        <!-- 遮罩层 -->
        <view class="mask" @click="closeDetail"></view>

        <!-- 购物车详情内容 -->
        <view class="detail-content" :class="{ 'show': visible }">
            <!-- 头部 -->
            <view class="detail-header">
                <text class="title">购物车</text>
                <view class="header-actions">
                    <text class="clear-btn" @click="clearCart">清空</text>
                    <uni-icons type="close" size="20" color="#666" @click="closeDetail" />
                </view>
            </view>

            <!-- 商品列表 -->
            <scroll-view class="detail-body" scroll-y="true" v-if="cartItems.length > 0">
                <view v-for="(item, index) in cartItems" :key="item.id" class="cart-item">
                    <image :src="item.image" class="item-image" mode="aspectFill" />
                    <view class="item-info">
                        <view class="item-header">
                            <text class="item-name">{{ item.name }}</text>
                            <text class="item-price">¥{{ item.price.toFixed(2) }}</text>
                        </view>
                        <view class="item-spec" v-if="item.attrs && item.attrs.length > 0">
                            <text class="spec-text">{{ formatAttrs(item.attrs) }}</text>
                        </view>
                        <view class="item-actions">
                            <view class="quantity-control">
                                <text class="quantity-btn minus" @click="decreaseQuantity(index)">-</text>
                                <text class="quantity-text">{{ item.count }}</text>
                                <text class="quantity-btn plus" @click="increaseQuantity(index)">+</text>
                            </view>
                            <text class="delete-btn" @click="removeItem(index)">删除</text>
                        </view>
                    </view>
                </view>
            </scroll-view>

            <!-- 空购物车提示 -->
            <view class="empty-cart" v-else>
                <uni-icons type="cart" size="60" color="#ccc" />
                <text class="empty-text">购物车是空的</text>
                <text class="empty-tip">快去选购心仪的商品吧</text>
            </view>

            <!-- 底部结算区域 -->
            <view class="detail-footer" v-if="cartItems.length > 0">
                <view class="total-info">
                    <text class="total-label">合计：</text>
                    <text class="total-price">¥{{ cartTotal.toFixed(2) }}</text>
                </view>
                <button class="checkout-btn" @click="goToCheckout">去结算({{ cartCount }})</button>
            </view>
        </view>
    </view>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useCartStore } from '@/store/cart'

const cartStore = useCartStore()

// 定义组件属性
const props = defineProps({
    visible: Boolean
})


// 定义组件事件
const emit = defineEmits(['close'])

// 计算属性
const cartItems = computed(() => cartStore.cartList)
const cartTotal = computed(() => cartStore.total)
const cartCount = computed(() => cartStore.count)

// 方法
function closeDetail() {
    emit('close')
}

function clearCart() {
    uni.showModal({
        title: '确认清空',
        content: '确定要清空购物车吗？',
        success: (res) => {
            if (res.confirm) {
                cartStore.clearCart()
                uni.showToast({
                    title: '购物车已清空',
                    icon: 'success'
                })
            }
        }
    })
}

function increaseQuantity(index) {
    const item = cartItems.value[index]
    cartStore.updateItemCount(index, item.count + 1)
}

function decreaseQuantity(index) {
    const item = cartItems.value[index]
    if (item.count > 1) {
        cartStore.updateItemCount(index, item.count - 1)
    } else {
        removeItem(index)
    }
}

function removeItem(index) {
    uni.showModal({
        title: '确认删除',
        content: '确定要删除这个商品吗？',
        success: (res) => {
            if (res.confirm) {
                cartStore.removeFromCart(index)
                uni.showToast({
                    title: '商品已删除',
                    icon: 'success'
                })
            }
        }
    })
}

function formatAttrs(attrs) {
    return attrs.join(' / ')
}

function goToCheckout() {
    closeDetail()

    // 获取当前选中的门店信息
    const currentStore = {
        id: 1, // 默认选择第一个门店，实际应该从store或全局状态获取
        name: '苏州体育中心店',
        address: '江苏省苏州市虎丘区三香路111号'
    }

    // 准备要传递的数据
    const orderData = {
        cartItems: cartStore.cartList,
        totalPrice: cartTotal.value,
        totalCount: cartCount.value,
        store: currentStore
    }

    // 使用uni.navigateTo跳转并传递参数
    uni.navigateTo({
        url: '/pages/menu/submit',
        success: (res) => {
            // 成功跳转后，向目标页面传递数据
            res.eventChannel.emit('acceptOrderData', orderData)
        },
        fail: (err) => {
            console.error('页面跳转失败：', err)
            uni.showToast({
                title: '页面跳转失败',
                icon: 'none'
            })
        }
    })
}

// 监听visible变化
watch(() => props.visible, (newVal) => {
    if (newVal) {
    }
})
</script>

<style lang="scss" scoped>
.cart-detail {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    visibility: hidden;
    transition: visibility 0.3s ease;

    &.show {
        visibility: visible;
    }

    .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: opacity 0.3s ease;

        .show & {
            opacity: 1;
        }
    }

    .detail-content {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background: white;
        border-radius: 20px 20px 0 0;
        transform: translateY(100%);
        transition: transform 0.3s ease;
        max-height: 80vh;
        display: flex;
        flex-direction: column;

        &.show {
            transform: translateY(0);
        }
    }

    .detail-header {
        padding: 20px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
            font-size: 18px;
            font-weight: bold;
            color: #333;
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 15px;

            .clear-btn {
                color: #ff4757;
                font-size: 14px;
            }
        }
    }

    .detail-body {
        flex: 1;
        padding: 0 20px;
        overflow-y: auto;

        .cart-item {
            display: flex;
            padding: 15px 0;
            border-bottom: 1px solid #f5f5f5;

            .item-image {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                margin-right: 12px;
            }

            .item-info {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .item-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 8px;

                    .item-name {
                        font-size: 16px;
                        font-weight: 500;
                        color: #333;
                        flex: 1;
                        margin-right: 10px;
                    }

                    .item-price {
                        font-size: 16px;
                        font-weight: bold;
                        color: #ff4757;
                    }
                }

                .item-spec {
                    margin-bottom: 12px;

                    .spec-text {
                        font-size: 12px;
                        color: #999;
                        background: #f5f5f5;
                        padding: 4px 8px;
                        border-radius: 4px;
                    }
                }

                .item-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .quantity-control {
                        display: flex;
                        align-items: center;
                        gap: 15px;

                        .quantity-btn {
                            width: 24px;
                            height: 24px;
                            border-radius: 50%;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 16px;
                            font-weight: bold;
                            cursor: pointer;

                            &.minus {
                                background: #f5f5f5;
                                color: #666;
                            }

                            &.plus {
                                background: #007f61;
                                color: white;
                            }
                        }

                        .quantity-text {
                            font-size: 16px;
                            font-weight: 500;
                            color: #333;
                            min-width: 30px;
                            text-align: center;
                        }
                    }

                    .delete-btn {
                        color: #ff4757;
                        font-size: 14px;
                    }
                }
            }
        }
    }

    .empty-cart {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 60px 20px;

        .empty-text {
            font-size: 18px;
            color: #999;
            margin: 20px 0 10px 0;
        }

        .empty-tip {
            font-size: 14px;
            color: #ccc;
        }
    }

    .detail-footer {
        padding: 20px;
        border-top: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .total-info {
            display: flex;
            align-items: center;

            .total-label {
                font-size: 16px;
                color: #333;
            }

            .total-price {
                font-size: 20px;
                font-weight: bold;
                color: #ff4757;
            }
        }

        .checkout-btn {
            background: #007f61;
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: bold;
        }
    }
}
</style>