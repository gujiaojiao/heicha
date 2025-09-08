<template>
	<view class="submitOrder">
		<!-- 固定顶部区域 -->
		<view class="fixed-area">
			<view class="fixed-header">
				<uni-icons type="left" size="30" class="back" @click="returnBack()"></uni-icons>
				<view class="orderTitle">订单详情</view>
			</view>
		</view>
		<!-- 内容区域 -->

		<view class="content">
			<!-- 门店信息 -->
			<view class="store-info">
				<view class="store-title">
					<uni-icons type="shop" size="20" color="#007f61"></uni-icons>
					<text class="store-name">{{ storeInfo.name }}</text>
				</view>
				<view class="store-address">{{ storeInfo.address }}</view>
			</view>

			<!-- 商品列表 -->
			<view class="cart-items">
				<view class="section-title">已选商品</view>
				<view class="item" v-for="(item, index) in cartItems" :key="index">
					<image class="item-image" :src="item.image" mode="aspectFill"></image>
					<view class="item-info">
						<view class="item-name">{{ item.name }}</view>
						<view class="item-attrs" v-if="item.attrs && item.attrs.length">
							<text>{{ formatAttrs(item.attrs) }}</text>
						</view>
						<view class="item-price-count">
							<text class="item-price">¥{{ item.price.toFixed(2) }}</text>
							<text class="item-count">x{{ item.count }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 订单信息 -->
			<view class="order-info">
				<view class="info-item">
					<text>商品金额</text>
					<text>¥{{ totalPrice.toFixed(2) }}</text>
				</view>
				<view class="info-item">
					<text>配送费</text>
					<text>¥0.00</text>
				</view>
				<view class="info-item total">
					<text>合计</text>
					<text>¥{{ totalPrice.toFixed(2) }}</text>
				</view>
			</view>
		</view>

		<!-- 底部区域-支付 -->
		<view class="bottom-fixed">
			<view class="payNumber">
				<text>待支付，¥</text>
				<text>{{ totalPrice.toFixed(2) }}</text>
			</view>
			<button class="recoder-btn" @click="submit">提交订单</button>
		</view>
	</view>
</template>

<script setup lang='ts'>
// @ts-ignore
import { ref, onMounted } from 'vue'
import { CartItem } from '@/store/cart'

// 声明uni全局变量
declare const uni: any

// 定义数据
const safeAreaInsets = (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets) || { top: 0 }
const cartItems = ref<CartItem[]>([])
const totalPrice = ref(0)
const totalCount = ref(0)
const storeInfo = ref({
	id: 0,
	name: '',
	address: ''
})

// 格式化商品属性
const formatAttrs = (attrs: string[]) => {
	return attrs.join(' / ')
}

// 返回上一页
const returnBack = () => {
	uni.switchTab({ url: '/pages/menu/list' })
}

// 提交订单
const submit = () => {
	if (cartItems.value.length === 0) {
		uni.showToast({
			title: '购物车为空',
			icon: 'none'
		})
		return
	}

	// 这里添加提交订单的逻辑
	uni.showLoading({
		title: '提交中...'
	})

	// 模拟提交
	setTimeout(() => {
		uni.hideLoading()
		uni.showToast({
			title: '订单提交成功',
			icon: 'success',
			success: () => {
				setTimeout(() => {
					uni.switchTab({
						url: '/pages/order/index'
					})
				}, 1500)
			}
		})
	}, 1000)
}

// 初始化页面数据
const initPageData = () => {
	try {
		// 获取页面参数
		const eventChannel = uni.getOpenerEventChannel?.()

		if (!eventChannel) {
			console.log('EventChannel不可用，尝试从缓存加载数据')
			loadDataFromCache()
			return
		}

		// 监听数据传递事件
		eventChannel.on('acceptDataFromOpenerPage', (data: any) => {
			console.log('通过EventChannel接收到的数据:', data)
			if (!data) return

			// 更新页面数据
			if (data.storeInfo) storeInfo.value = data.storeInfo
			if (data.totalPrice) totalPrice.value = Number(data.totalPrice)
			if (data.totalCount) totalCount.value = Number(data.totalCount)
			if (data.cartItems) cartItems.value = data.cartItems

			// 同时保存到缓存，作为备份
			saveDataToCache(data)
			console.log('成功接收订单数据')
		})
	} catch (error) {
		console.error('获取EventChannel失败:', error)
		loadDataFromCache()
	}
}

// 从缓存加载数据（作为备用方案）
const loadDataFromCache = () => {
	try {
		const cachedData = uni.getStorageSync('submitOrderData')
		if (cachedData) {
			const data = JSON.parse(cachedData)
			console.log('从缓存加载数据:', data)

			if (data.storeInfo) storeInfo.value = data.storeInfo
			if (data.totalPrice) totalPrice.value = Number(data.totalPrice)
			if (data.totalCount) totalCount.value = Number(data.totalCount)
			if (data.cartItems) cartItems.value = data.cartItems

			console.log('成功从缓存加载数据')
			return true
		}
	} catch (error) {
		console.error('从缓存加载数据失败:', error)
	}
	return false
}

// 保存数据到缓存
const saveDataToCache = (data: any) => {
	try {
		uni.setStorageSync('submitOrderData', JSON.stringify(data))
	} catch (error) {
		console.error('保存数据到缓存失败:', error)
	}
}

// 页面加载时获取传递的数据
const onLoad = () => {
	console.log('onLoad被调用')
	initPageData()
}

// 使用onMounted作为备用初始化方法
onMounted(() => {
	console.log('onMounted被调用')
	// 如果数据还未加载，尝试再次初始化
	if (cartItems.value.length === 0) {
		initPageData()
	}
})

// 定义页面生命周期
defineExpose({
	onLoad
})
</script>

<style lang="scss" scoped>
.submitOrder {
	background: #f7f7f7;
	height: 100vh;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;

	.fixed-area {
		flex-shrink: 0; // 防止收缩

		.fixed-header {
			width: 100%;
			height: 50px;
			display: flex;
			align-items: center;
			position: relative;
			background: white;
			border-bottom: 2px solid rgba(0, 0, 0, 0.1);

			.back {
				position: absolute;
				left: 2%;
				display: flex;
				align-items: center;
				height: 100%;
			}

			.orderTitle {
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				font-size: 16px;
				font-weight: 500;
				height: 100%;
				display: flex;
				align-items: center;
			}
		}
	}

	.content {
		flex: 1;
		padding: 20rpx;
		margin-bottom: 100rpx;

		.store-info {
			background: white;
			padding: 30rpx;
			border-radius: 16rpx;
			margin-bottom: 20rpx;

			.store-title {
				display: flex;
				align-items: center;
				margin-bottom: 10rpx;

				.store-name {
					font-size: 32rpx;
					font-weight: bold;
					margin-left: 10rpx;
				}
			}

			.store-address {
				font-size: 28rpx;
				color: #666;
			}
		}

		.cart-items {
			background: white;
			padding: 30rpx;
			border-radius: 16rpx;
			margin-bottom: 20rpx;

			.section-title {
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
			}

			.item {
				display: flex;
				padding: 20rpx 0;
				border-bottom: 1px solid #f0f0f0;

				&:last-child {
					border-bottom: none;
				}

				.item-image {
					width: 120rpx;
					height: 120rpx;
					border-radius: 8rpx;
					margin-right: 20rpx;
				}

				.item-info {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: space-between;

					.item-name {
						font-size: 28rpx;
						font-weight: 500;
					}

					.item-attrs {
						font-size: 24rpx;
						color: #999;
						margin: 6rpx 0;
					}

					.item-price-count {
						display: flex;
						justify-content: space-between;

						.item-price {
							font-size: 28rpx;
							color: #333;
							font-weight: bold;
						}

						.item-count {
							font-size: 28rpx;
							color: #666;
						}
					}
				}
			}
		}

		.order-info {
			background: white;
			padding: 30rpx;
			border-radius: 16rpx;

			.info-item {
				display: flex;
				justify-content: space-between;
				margin-bottom: 20rpx;
				font-size: 28rpx;
				color: #666;

				&.total {
					font-size: 32rpx;
					color: #333;
					font-weight: bold;
					padding-top: 20rpx;
					border-top: 1px solid #f0f0f0;
				}
			}
		}
	}

	.bottom-fixed {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: white;
		padding: 15px 20px;
		border-top: 1px solid #eee;
		z-index: 100;
		display: flex;
		justify-content: space-between;
		align-items: center;

		.payNumber {
			font-size: 32rpx;
			font-weight: bold;
		}

		.recoder-btn {
			width: 200rpx;
			height: 80rpx;
			background: #007f61;
			color: white;
			border: none;
			border-radius: 40rpx;
			font-size: 32rpx;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
}
</style>