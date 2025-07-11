<template>
    <view class="cart-preview">
        <!-- 购物车图标 -->
        <view class="cart-icon" @tap="onCartClick">
            <view class="badge" v-if="count > 0">{{ count }}</view>
            <image src="/static/images/icons/cart.png" mode="aspectFit" class="icon" />
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
import { useCartStore } from '@/stores/modules/cart'

const cartStore = useCartStore()
const { total, count } = storeToRefs(cartStore)

// 点击购物车
const onCartClick = () => {
    if (count.value === 0) {
        uni.showToast({
            title: '购物车是空的',
            icon: 'none'
        })
        return
    }

    uni.navigateTo({
        url: '/pages/cart/index'
    })
}

// 去结算
const onCheckout = () => {
    if (total.value === 0) return

    uni.navigateTo({
        url: '/pages/order/confirm'
    })
}
</script>

<style lang="scss" scoped>
.cart-preview {
    position: fixed;
    bottom: 40rpx;
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
        background-color: $primary-color;
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
            background-color: $error-color;
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
            font-size: $font-size-base;
            color: $text-color-primary;
        }

        .value {
            font-size: 40rpx;
            color: $text-color-primary;
            font-weight: 500;
            margin-left: 4rpx;
        }

        .empty {
            font-size: $font-size-base;
            color: $text-color-secondary;
        }
    }

    .checkout-btn {
        width: 200rpx;
        height: 80rpx;
        background-color: $primary-color;
        border-radius: 40rpx;
        color: #ffffff;
        font-size: $font-size-medium;
        display: flex;
        align-items: center;
        justify-content: center;

        &.disabled {
            opacity: 0.6;
        }
    }
}
</style>