<template>
    <view class="current-order">
        <!-- 取餐号和状态 -->
        <view class="order-status-section">
            <view class="pickup-number">
                <text class="label">取餐号</text>
                <text class="number">{{ orderInfo.takeNumber }}</text>
                <view class="status">
                    <text class="dots">•••</text>
                    <text class="status-text">{{ orderInfo.status }}</text>
                    <text class="dots">•••</text>
                </view>
            </view>
        </view>

        <!-- 进度信息 -->
        <view class="progress-info">
            <view class="progress-bar">
                <view class="progress-inner" :style="{ width: progressPercent + '%' }"></view>
            </view>
            <view class="progress-text">
                <text>前面还有 {{ orderInfo.waitCups }} 杯</text>
                <text>总共 {{ orderInfo.storeTotalCups }} 杯</text>
            </view>
        </view>

        <!-- 门店信息 -->
        <view class="store-info-card">
            <view class="store-header">
                <text class="store-name">{{ orderInfo.storeAddress }}</text>
                <uni-icons type="right" size="16" color="#999"></uni-icons>
            </view>
        </view>

        <!-- 商品详情 -->
        <view class="product-card">
            <view v-for="(product, index) in orderInfo.products" :key="index" class="product-info">
                <image :src="product.imageUrl" class="product-image" mode="aspectFill"></image>
                <view class="product-details">
                    <text class="product-name">{{ product.name }}</text>
                    <view class="product-options">
                        <text class="option">{{ product.desc }}</text>
                    </view>
                </view>
                <view class="product-price">
                    <text class="price">¥{{ product.price.toFixed(2) }}</text>
                    <text class="quantity">x{{ product.count }}</text>
                </view>
            </view>

            <!-- 订单总价 -->
            <view class="order-total">
                <text class="total-label">订单总计</text>
                <text class="total-price">¥{{ totalPrice.toFixed(2) }}</text>
            </view>
        </view>

        <!-- 底部按钮 -->
        <view class="bottom-actions">
            <button class="contact-btn" @click="contactStore">联系门店</button>
            <button class="check-btn" @click="checkOrder">查看详情</button>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { CurrentOrder } from '@/utils/api/order-mock';

// 声明uni全局变量
declare const uni: any;

const props = defineProps<{
    orderInfo: CurrentOrder
}>();

// 计算进度百分比
const progressPercent = computed(() => {
    const total = props.orderInfo.storeTotalCups;
    const waiting = props.orderInfo.waitCups;
    // 计算完成百分比，最小为0，最大为100
    return Math.min(100, Math.max(0, ((total - waiting) / total) * 100));
});

// 计算总价
const totalPrice = computed(() => {
    return props.orderInfo.products.reduce((sum: number, product: any) => {
        return sum + (product.price * product.count);
    }, 0);
});

// 联系门店
const contactStore = () => {
    uni.showToast({
        title: '联系门店功能开发中',
        icon: 'none'
    });
};

// 查看订单详情
const checkOrder = () => {
    uni.showToast({
        title: '查看详情功能开发中',
        icon: 'none'
    });
};
</script>

<style lang="scss" scoped>
.current-order {
    background-color: #fff;
    border-radius: 12px;
    padding: 20px;
    margin: 0 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    // 取餐号和状态区域
    .order-status-section {
        padding: 15px 0;
        margin-bottom: 15px;
        text-align: center;
        border-bottom: 1px solid #f0f0f0;

        .pickup-number {
            .label {
                display: block;
                font-size: 14px;
                color: #666;
                margin-bottom: 8px;
            }

            .number {
                display: block;
                font-size: 32px;
                font-weight: bold;
                color: #1aad19;
                margin-bottom: 15px;
            }

            .status {
                display: flex;
                align-items: center;
                justify-content: center;

                .dots {
                    color: #ccc;
                    font-size: 12px;
                    margin: 0 8px;
                }

                .status-text {
                    color: #333;
                    font-size: 16px;
                    font-weight: 500;
                }
            }
        }
    }

    // 进度信息
    .progress-info {
        margin-bottom: 20px;

        .progress-bar {
            height: 8px;
            background-color: #f0f0f0;
            border-radius: 4px;
            margin-bottom: 8px;
            overflow: hidden;

            .progress-inner {
                height: 100%;
                background-color: #1aad19;
                border-radius: 4px;
                transition: width 0.3s ease;
            }
        }

        .progress-text {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            color: #666;
        }
    }

    // 门店信息卡片
    .store-info-card {
        background: #f8f8f8;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 15px;

        .store-header {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .store-name {
                font-size: 14px;
                font-weight: bold;
                color: #333;
            }
        }
    }

    // 商品详情卡片
    .product-card {
        margin-bottom: 20px;

        .product-info {
            display: flex;
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #f0f0f0;

            &:last-of-type {
                border-bottom: none;
            }

            .product-image {
                width: 60px;
                height: 60px;
                border-radius: 8px;
                margin-right: 15px;
                flex-shrink: 0;
            }

            .product-details {
                flex: 1;
                margin-right: 15px;

                .product-name {
                    display: block;
                    font-size: 15px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 6px;
                }

                .product-options {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;

                    .option {
                        color: #666;
                        font-size: 12px;
                    }
                }
            }

            .product-price {
                text-align: right;
                flex-shrink: 0;

                .price {
                    display: block;
                    font-size: 15px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 4px;
                }

                .quantity {
                    color: #999;
                    font-size: 12px;
                }
            }
        }

        // 订单总计
        .order-total {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid #eee;

            .total-label {
                color: #333;
                font-size: 15px;
                font-weight: bold;
            }

            .total-price {
                color: #e74c3c;
                font-size: 16px;
                font-weight: bold;
            }
        }
    }

    // 底部按钮
    .bottom-actions {
        display: flex;
        justify-content: space-between;
        gap: 15px;

        button {
            flex: 1;
            height: 40px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;

            &.contact-btn {
                background-color: #f8f8f8;
                color: #333;
                border: 1px solid #ddd;
            }

            &.check-btn {
                background-color: #1aad19;
                color: white;
            }
        }
    }
}
</style>