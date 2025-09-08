<template>
    <view class="order-drawer" :class="{ 'show': visible }" v-show="visible">
        <!-- 遮罩层 -->
        <view class="mask" @click="closeDrawer"></view>

        <!-- 抽屉内容 -->
        <view class="drawer-content" :class="{ 'show': visible }">
            <!-- 顶部操作栏 -->
            <view class="drawer-header">
                <view class="product-info">
                    <image :src="productInfo.imageUrl" class="product-image" mode="aspectFill" />
                    <view class="product-details">
                        <text class="product-name">{{ productInfo.name }}</text>
                        <text class="product-spec">{{ currentSpec }}</text>
                        <view class="price-row">
                            <text class="price">¥{{ totalPrice.toFixed(2) }}</text>
                            <button class="favorite-btn" @click="toggleFavorite">
                                <uni-icons type="heart" size="16" :color="isFavorite ? '#ff4757' : '#999'" />
                                <text>收藏口味</text>
                            </button>
                        </view>
                    </view>
                </view>
                <view class="header-actions">
                    <button class="action-btn" @click="shareProduct">
                        <uni-icons type="upload" size="16" color="#666" />
                    </button>
                    <button class="action-btn close-btn" @click="closeDrawer">
                        <uni-icons type="close" size="16" color="#666" />
                    </button>
                </view>
            </view>

            <!-- 规格选择区域 -->
            <scroll-view class="drawer-body" scroll-y="true">
                <!-- 杯型选择 -->
                <view class="option-section">
                    <text class="section-title">杯型</text>
                    <view class="option-list">
                        <view v-for="option in cupOptions" :key="option.value"
                            :class="['option-item', { 'active': selectedCup === option.value }]"
                            @click="selectCup(option.value)">
                            <text>{{ option.label }}</text>
                        </view>
                    </view>
                </view>

                <!-- 冰度选择 -->
                <view class="option-section">
                    <text class="section-title">冰度</text>
                    <view class="option-list">
                        <view v-for="option in iceOptions" :key="option.value"
                            :class="['option-item', { 'active': selectedIce === option.value }]"
                            @click="selectIce(option.value)">
                            <text>{{ option.label }}</text>
                            <text v-if="option.recommended" class="recommended">推荐</text>
                        </view>
                    </view>
                </view>

                <!-- 糖度选择 -->
                <view class="option-section">
                    <text class="section-title">糖度</text>
                    <view class="option-list">
                        <view v-for="option in sugarOptions" :key="option.value"
                            :class="['option-item', { 'active': selectedSugar === option.value }]"
                            @click="selectSugar(option.value)">
                            <text>{{ option.label }}</text>
                            <text v-if="option.recommended" class="recommended">推荐</text>
                        </view>
                    </view>
                </view>

                <!-- 免费配料 -->
                <view class="option-section" v-if="freeToppings.length > 0">
                    <text class="section-title">免费配料</text>
                    <view class="option-list">
                        <view v-for="topping in freeToppings" :key="topping.id"
                            :class="['option-item', { 'active': selectedFreeToppings.includes(topping.id) }]"
                            @click="toggleFreeTopping(topping.id)">
                            <text>{{ topping.name }}</text>
                            <text class="price-tag">¥0</text>
                        </view>
                    </view>
                </view>

                <!-- 加价配料 -->
                <view class="option-section" v-if="paidToppings.length > 0">
                    <text class="section-title">加价配料</text>
                    <view class="option-list">
                        <view v-for="topping in paidToppings" :key="topping.id"
                            :class="['option-item', { 'active': selectedPaidToppings.includes(topping.id) }]"
                            @click="togglePaidTopping(topping.id)">
                            <text>{{ topping.name }}</text>
                            <text class="price-tag">¥{{ topping.price.toFixed(0) }}</text>
                        </view>
                    </view>
                </view>

                <!-- 更改基底 -->
                <view class="option-section" v-if="baseOptions.length > 0">
                    <text class="section-title">更改基底</text>
                    <view class="option-list">
                        <view v-for="option in baseOptions" :key="option.value"
                            :class="['option-item', { 'active': selectedBase === option.value }]"
                            @click="selectBase(option.value)">
                            <text>{{ option.label }}</text>
                            <text class="price-tag">¥{{ option.price.toFixed(0) }}</text>
                        </view>
                    </view>
                </view>
            </scroll-view>

            <!-- 底部确认按钮 -->
            <view class="drawer-footer">
                <button class="confirm-btn" @click="confirmOrder(productInfo)">选好了</button>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
declare const uni: any

// 定义商品信息接口
interface ProductInfo {
    id: number
    name: string
    imageUrl: string
    basePrice: number
}

// 定义配料接口
interface Topping {
    id: number
    name: string
    price: number
}

// 定义选项接口
interface Option {
    value: string
    label: string
    price?: number
    recommended?: boolean
}

// 定义组件属性
interface Props {
    visible: boolean
    productInfo: ProductInfo
}

// 定义组件事件
interface Emits {
    (e: 'close'): void
    (e: 'confirm', orderData: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式数据
const selectedCup = ref('large')
const selectedIce = ref('standard')
const selectedSugar = ref('seven')
const selectedBase = ref('default')
const selectedFreeToppings = ref<number[]>([])
const selectedPaidToppings = ref<number[]>([])
const isFavorite = ref(false)

// 杯型选项
const cupOptions: Option[] = [
    { value: 'large', label: '大杯' },
    { value: 'medium', label: '中杯' }
]

// 冰度选项
const iceOptions: Option[] = [
    { value: 'standard', label: '标准冰', recommended: true },
    { value: 'less', label: '少冰' },
    { value: 'none', label: '去冰' },
    { value: 'room', label: '常温' },
    { value: 'warm', label: '温' },
    { value: 'hot', label: '热饮' }
]

// 糖度选项
const sugarOptions: Option[] = [
    { value: 'three', label: '三分糖' },
    { value: 'five', label: '五分糖' },
    { value: 'seven', label: '七分糖', recommended: true },
    { value: 'none', label: '不另外加糖' },
    { value: 'full', label: '全糖' }
]

// 免费配料
const freeToppings: Topping[] = [
    { id: 1, name: '小珍珠', price: 0 },
    { id: 2, name: '波霸', price: 0 },
    { id: 3, name: '椰果', price: 0 },
    { id: 4, name: '仙草', price: 0 },
    { id: 5, name: '茶冻', price: 0 },
    { id: 6, name: '椰奶冻', price: 0 },
    { id: 7, name: '栀子冻', price: 0 },
]

// 加价配料
const paidToppings: Topping[] = [
    { id: 2, name: '西米', price: 2 },
    { id: 3, name: '单颗布丁', price: 4 },
    { id: 4, name: '冰淇淋', price: 6 },
    { id: 5, name: '奶霜', price: 5 },
    { id: 6, name: '奶霜(分装)', price: 6 }
]

// 基底选项
const baseOptions: Option[] = [
    { value: 'default', label: '默认基底', price: 0 },
    { value: 'a2milk', label: '改A2牛乳', price: 3 }
]

// 计算当前规格显示
const currentSpec = computed(() => {
    const cup = cupOptions.find(opt => opt.value === selectedCup.value)?.label
    const ice = iceOptions.find(opt => opt.value === selectedIce.value)?.label
    const sugar = sugarOptions.find(opt => opt.value === selectedSugar.value)?.label
    const freeToppingNames = selectedFreeToppings.value.map(id => freeToppings.find(t => t.id === id)?.name).filter(name => name) as string[]
    const paidToppingNames = selectedPaidToppings.value.map(id => paidToppings.find(t => t.id === id)?.name).filter(name => name) as string[]
    const toppingStr = freeToppingNames.length > 0 ? freeToppingNames.join('/') : ''
    const newtoppingStr = paidToppingNames.length > 0 ? `${toppingStr}/${paidToppingNames.join('/')}` : toppingStr
    return newtoppingStr ? `${cup}/${ice}/${sugar}/${newtoppingStr}` : `${cup}/${ice}/${sugar}`
})

// 计算总价格
const totalPrice = computed(() => {
    let total = props.productInfo.basePrice

    // 大杯加价
    const largeCup = selectedCup.value === 'large' ? 1 : 0
    if (largeCup) {
        total = total + 3
    }

    // 加价配料
    selectedPaidToppings.value.forEach((id: number) => {
        const topping = paidToppings.find(t => t.id === id)
        if (topping) {
            total += topping.price
        }
    })

    // 基底加价
    const base = baseOptions.find(opt => opt.value === selectedBase.value)
    if (base && base.price) {
        total += base.price
    }

    return total
})

// 方法
function selectCup(value: string) {
    selectedCup.value = value
}

function selectIce(value: string) {
    selectedIce.value = value
}

function selectSugar(value: string) {
    selectedSugar.value = value
}

function selectBase(value: string) {
    selectedBase.value = value
}

function toggleFreeTopping(id: number) {
    const index = selectedFreeToppings.value.indexOf(id)
    if (index > -1) {
        selectedFreeToppings.value.splice(index, 1)
    } else {
        selectedFreeToppings.value.push(id)
    }
}

function togglePaidTopping(id: number) {
    const index = selectedPaidToppings.value.indexOf(id)
    if (index > -1) {
        selectedPaidToppings.value.splice(index, 1)
    } else {
        selectedPaidToppings.value.push(id)
    }
}

function toggleFavorite() {
    isFavorite.value = !isFavorite.value
}

function shareProduct() {
    // 分享功能
    uni.showToast({
        title: '分享功能开发中',
        icon: 'none'
    })
}

function closeDrawer() {
    console.log(111)
    emit('close')
    console.log(111, '有被调用')
}

function confirmOrder() {
    const orderData = {
        productId: props.productInfo.id,
        productName: props.productInfo.name,
        imageurl: props.productInfo.imageUrl,
        cup: selectedCup.value,
        ice: selectedIce.value,
        sugar: selectedSugar.value,
        base: selectedBase.value,
        freeToppings: selectedFreeToppings.value,
        paidToppings: selectedPaidToppings.value,
        totalPrice: totalPrice.value,
        quantity: 1
    }

    emit('confirm', orderData)
}

// 监听visible变化，重置选择
watch(() => props.visible, (newVal: boolean) => {
    if (newVal) {
        // 重置为默认值
        selectedCup.value = 'large'
        selectedIce.value = 'standard'
        selectedSugar.value = 'seven'
        selectedBase.value = 'default'
        selectedFreeToppings.value = []
        selectedPaidToppings.value = []
    }
})
</script>

<style lang="scss" scoped>
.order-drawer {
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

    .drawer-content {
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

    .drawer-header {
        padding: 20px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;

        .product-info {
            display: flex;
            flex: 1;
            margin-right: 20px;

            .product-image {
                width: 80px;
                height: 80px;
                border-radius: 8px;
                margin-right: 15px;
            }

            .product-details {
                flex: 1;
                display: flex;
                flex-direction: column;

                .product-name {
                    font-size: 18px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 8px;
                }

                .product-spec {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 12px;
                }

                .price-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;

                    .price {
                        font-size: 20px;
                        font-weight: bold;
                        color: #ff4757;
                    }

                    .favorite-btn {
                        display: flex;
                        align-items: center;
                        background: none;
                        border: 1px solid #ddd;
                        border-radius: 20px;
                        padding: 6px 12px;
                        font-size: 12px;
                        color: #666;

                        text {
                            margin-left: 4px;
                        }
                    }
                }
            }
        }

        .header-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .action-btn {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                border: 1px solid #ddd;
                background: white;
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
    }

    .drawer-body {
        flex: 1;
        padding: 0 20px;
        overflow-y: auto;

        .option-section {
            margin-bottom: 25px;

            .section-title {
                font-size: 16px;
                font-weight: bold;
                color: #333;
                margin-bottom: 15px;
                display: block;
            }

            .option-list {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                padding-right: 10px;

                .option-item {
                    position: relative;
                    padding: 8px 16px;
                    // border: 1px solid #ddd;
                    border-radius: 5px;
                    background: #f5f5f5;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.2s ease;

                    &.active {

                        // border-color: $uni-text-color-green;
                        background: rgba(0, 127, 97, 0.25);
                        color: $uni-text-color-green;
                    }

                    .recommended {
                        background: #ff6b35;
                        color: white;
                        font-size: 10px;
                        padding: 2px 6px;
                        border-radius: 10px;
                    }

                    .price-tag {
                        font-size: 12px;
                        color: #666;
                    }
                }
            }
        }
    }

    .drawer-footer {
        padding: 20px;
        border-top: 1px solid #f0f0f0;

        .confirm-btn {
            width: 100%;
            height: 50px;
            background: $uni-text-color-green;
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
        }
    }
}
</style>