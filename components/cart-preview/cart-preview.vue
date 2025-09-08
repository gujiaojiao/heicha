<template>
    <view class="cart-preview" v-if="count > 0">
        <!-- 购物车图标 -->
        <view class="cart-icon" @tap="onCartClick">
            <view class="badge">{{ count }}</view>
            <image src="/static/images/logo.png" mode="aspectFit" class="icon" />
        </view>

        <!-- 价格信息 -->
        <view class="price-info">
            <block v-if="total > 0">
                <text class="symbol">¥</text>
                <text class="value">{{ total }}</text>
            </block>
            <text v-else class="empty">未选购商品</text>
        </view>

        <!-- 结算按钮 -->
        <button class="checkout-btn" :class="{ disabled: total === 0 }" @tap="onCheckout">
            去结算
        </button>
    </view>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/store/cart'
declare const uni: any

const cartStore = useCartStore()
const { total, count } = storeToRefs(cartStore)

// 定义组件事件
const emit = defineEmits(['open-detail'])

// 点击购物车
const onCartClick = () => {
    if (count.value === 0) {
        uni.showToast({
            title: '购物车是空的',
            icon: 'none'
        })
        return
    }

    // 触发打开详情事件
    emit('open-detail')
}

// 去结算
const onCheckout = () => {
    if (total.value === 0) return

    // 获取当前选中的门店信息
    const currentStore = {
        id: 1, // 默认选择第一个门店，实际应该从store或全局状态获取
        name: '苏州体育中心店',
        address: '江苏省苏州市虎丘区三香路111号'
    }

    // 准备要传递的数据
    const orderData = {
        storeInfo: currentStore,
        totalPrice: total.value,
        totalCount: count.value,
        cartItems: cartStore.cartList
    }

    // 同时将数据保存到缓存，作为备份
    try {
        uni.setStorageSync('submitOrderData', JSON.stringify(orderData))
    } catch (error) {
        console.error('保存数据到缓存失败:', error)
    }

    // 使用EventChannel方式传递数据
    uni.navigateTo({
        url: '/pages/menu/submit',
        events: {
            // 接收submit页面发送的数据
            acceptDataFromSubmitPage(data: any) {
                console.log('接收到submit页面的数据:', data);
            }
        },
        success: (res: any) => {
            // 通过eventChannel向被打开页面传送数据
            res.eventChannel.emit('acceptDataFromOpenerPage', orderData);
        },
        fail: (err: any) => {
            console.error('页面跳转失败：', err)
            uni.showToast({
                title: '页面跳转失败',
                icon: 'none'
            })
        }
    })
}
</script>

<style lang="scss" scoped>
.cart-preview {
    position: fixed;
    /* #ifdef MP-WEIXIN */
    bottom: 30rpx;
    /* #endif */
    /* #ifndef MP-WEIXIN */
    bottom: 130rpx;
    /* #endif */
    left: 40rpx;
    right: 40rpx;
    height: 100rpx;
    background-color: #ffffff;
    border-radius: 50rpx;
    display: flex;
    align-items: center;
    padding: 0 20rpx;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);

    .cart-icon {
        position: relative;
        width: 80rpx;
        height: 80rpx;
        background-color: #007f61;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        .icon {
            width: 44rpx;
            height: 44rpx;
        }

        .badge {
            position: absolute;
            top: -6rpx;
            right: -6rpx;
            min-width: 32rpx;
            height: 32rpx;
            padding: 0 8rpx;
            background-color: #ff4757;
            border-radius: 16rpx;
            color: #ffffff;
            font-size: 20rpx;
            display: flex;
            align-items: center;
            justify-content: center;
        }

    }

    .price-info {
        flex: 1;
        padding: 0 30rpx;

        .symbol {
            font-size: 28rpx;
            color: #333;
        }

        .value {
            font-size: 40rpx;
            color: #333;
            font-weight: 500;
            margin-left: 4rpx;
        }

        .empty {
            font-size: 28rpx;
            color: #999;
        }
    }

    .checkout-btn {
        width: 200rpx;
        height: 80rpx;
        background-color: #007f61;
        border-radius: 40rpx;
        color: #ffffff;
        font-size: 28rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        &.disabled {
            opacity: 0.6;
        }
    }
}
</style>