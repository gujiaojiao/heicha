<template>
	<view class="order" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
		<!-- 固定顶部区域 -->
		<view class="fixed-area">
			<view class="fixed-header">
				<uni-icons type="left" size="30" class="back" @click="back"></uni-icons>
				<view class="orderTitle">订单详情</view>
			</view>
		</view>

		<!-- 加载状态 -->
		<view v-if="loading" class="loading">
			<text>加载中...</text>
		</view>

		<!-- 订单详情内容 -->
		<view v-else-if="orderDetail" class="scrollable-area">
			<!-- 取餐号和状态 -->
			<view class="order-status-section">
				<view class="pickup-number">
					<text class="label">取餐号</text>
					<text class="number">{{ orderDetail.pickupNumber }}</text>
					<view class="status">
						<text class="dots">•••</text>
						<text class="status-text">{{ orderDetail.status }}</text>
						<text class="dots">•••</text>
					</view>
				</view>
			</view>



			<!-- 订单详情卡片 -->
			<view class="order-details">
				<view class="detail-card">
					<text class="detail-label">享用方式</text>
					<text class="detail-value">{{ orderDetail.type }}</text>
				</view>
				<view class="detail-card" v-if="orderDetail.remark">
					<text class="detail-label">备注</text>
					<text class="detail-value">{{ orderDetail.remark }}</text>
				</view>
			</view>

			<!-- 门店信息 -->
			<view class="store-info-card">
				<view class="store-header">
					<text class="store-name">{{ orderDetail.storeAddress }}</text>
					<uni-icons type="right" size="16" color="#999"></uni-icons>
				</view>
				<view class="store-address">
					<uni-icons type="location" size="16" color="#999"></uni-icons>
					<text class="address-text">{{ orderDetail.storeAddressDetail }}</text>
				</view>
				<view class="store-contact" @click="callStore">
					<uni-icons type="phone" size="20" color="#1aad19"></uni-icons>
				</view>
			</view>

			<!-- 商品详情 -->
			<view class="product-card">
				<view v-for="(product, index) in orderDetail.products" :key="index" class="product-info">
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
					<text class="total-price">¥{{ orderDetail.totalPrice.toFixed(2) }}</text>
				</view>
			</view>

			<!-- 订单基本信息 -->
			<view class="order-info-card">
				<view class="info-item">
					<text class="label">订单编号</text>
					<text class="value">{{ orderDetail.orderNumber }}</text>
				</view>
				<view class="info-item">
					<text class="label">下单时间</text>
					<text class="value">{{ orderDetail.orderTime }}</text>
				</view>
				<view class="info-item">
					<text class="label">支付方式</text>
					<text class="value">{{ orderDetail.paymentMethod }}</text>
				</view>
				<view class="info-item">
					<text class="label">支付时间</text>
					<text class="value">{{ orderDetail.paymentTime }}</text>
				</view>
				<view class="info-item">
					<text class="label">取餐时间</text>
					<text class="value">{{ orderDetail.pickupTime }}</text>
				</view>
			</view>
		</view>

		<!-- 底部固定按钮 -->
		<view class="bottom-fixed">
			<button class="reorder-btn" @click="reorder">{{ orderDetail?.buttonText || '再来一单' }}</button>
		</view>
	</view>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, onMounted } from 'vue'
import { getOrderDetail, type OrderDetail } from '@/utils/api/order-mock'

// 声明uni全局变量
declare const uni: any
// 声明 getCurrentPages 函数
declare function getCurrentPages(): any[]

const safeAreaInsets = (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets) || { top: 0 }

// 订单详情数据
const orderDetail = ref<OrderDetail | null>(null)
const loading = ref(true)

// 获取页面参数中的订单ID
const getOrderId = (): number => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1]
	const options = currentPage.options || {}
	return parseInt(options.id) || 1
}

// 获取订单详情
const fetchOrderDetail = async () => {
	try {
		const orderId = getOrderId()
		const detail = await getOrderDetail(orderId)
		orderDetail.value = detail
	} catch (error) {
		console.error('获取订单详情失败:', error)
		uni.showToast({
			title: '获取订单详情失败',
			icon: 'error'
		})
	} finally {
		loading.value = false
	}
}

// 页面加载时获取数据
onMounted(() => {
	fetchOrderDetail()
})

const back = () => {
	uni.navigateBack({ delta: 1 })
}

const reorder = () => {
	// 再来一单的逻辑
	setTimeout(() => {
		uni.switchTab({
			url: '/pages/menu/list'
		})
	}, 200)
}

// 拨打电话给门店
const callStore = () => {
	if (orderDetail.value?.storePhone) {
		uni.makePhoneCall({
			phoneNumber: orderDetail.value.storePhone,
			fail: (err: any) => {
				console.error('拨打电话失败:', err)
				uni.showToast({
					title: '拨打电话失败',
					icon: 'error'
				})
			}
		})
	}
}
</script>

<style lang="scss" scoped>
.order {
	background: white;
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

	// 加载状态
	.loading {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 200px;
		color: #999;
		font-size: 14px;
	}

	.scrollable-area {
		flex: 1; // 占据剩余空间
		overflow-y: auto; // 启用垂直滚动
		-webkit-overflow-scrolling: touch; // iOS平台平滑滚动
		padding: 10px;
		box-sizing: border-box;
		background-color: #f7f7f7;

		// 取餐号和状态区域
		.order-status-section {
			background: white;
			border-radius: 12px;
			padding: 20px;
			margin-bottom: 15px;
			text-align: center;

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



		// 订单详情卡片
		.order-details {
			margin-bottom: 15px;

			.detail-card {
				background: white;
				border-radius: 8px;
				padding: 15px;
				margin-bottom: 8px;
				display: flex;
				justify-content: space-between;
				align-items: center;

				.detail-label {
					color: #666;
					font-size: 14px;
				}

				.detail-value {
					color: #333;
					font-size: 14px;
					font-weight: 500;
				}
			}
		}

		// 门店信息卡片
		.store-info-card {
			background: white;
			border-radius: 12px;
			padding: 20px;
			margin-bottom: 15px;
			position: relative;

			.store-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 12px;

				.store-name {
					font-size: 16px;
					font-weight: bold;
					color: #333;
				}
			}

			.store-address {
				display: flex;
				align-items: center;
				margin-bottom: 15px;

				.address-text {
					margin-left: 8px;
					color: #666;
					font-size: 14px;
				}
			}

			.store-contact {
				position: absolute;
				right: 20px;
				top: 20px;
			}
		}

		// 商品详情卡片
		.product-card {
			background: white;
			border-radius: 12px;
			padding: 20px;
			margin-bottom: 15px; // 为底部按钮留出空间

			.product-info {
				display: flex;
				margin-bottom: 20px;

				&:last-of-type {
					margin-bottom: 0;
				}

				.product-image {
					width: 80px;
					height: 80px;
					border-radius: 8px;
					margin-right: 15px;
					flex-shrink: 0;
				}

				.product-details {
					flex: 1;
					margin-right: 15px;

					.product-name {
						display: block;
						font-size: 16px;
						font-weight: bold;
						color: #333;
						margin-bottom: 8px;
					}

					.product-options {
						display: flex;
						flex-wrap: wrap;
						gap: 6px;
						margin-bottom: 8px;

						.option {
							background: #f5f5f5;
							color: #666;
							padding: 2px 8px;
							border-radius: 12px;
							font-size: 12px;
						}
					}
				}

				.product-price {
					text-align: right;
					flex-shrink: 0;

					.price {
						display: block;
						font-size: 16px;
						font-weight: bold;
						color: #333;
						margin-bottom: 4px;
					}

					.quantity {
						color: #999;
						font-size: 14px;
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
				margin-top: 15px;

				.total-label {
					color: #333;
					font-size: 16px;
					font-weight: bold;
				}

				.total-price {
					color: #e74c3c;
					font-size: 18px;
					font-weight: bold;
				}
			}
		}

		// 订单基本信息卡片
		.order-info-card {
			background: white;
			border-radius: 12px;
			padding: 20px;
			margin-bottom: 80px;

			.info-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 12px;

				&:last-child {
					margin-bottom: 0;
				}

				.label {
					color: #666;
					font-size: 14px;
				}

				.value {
					color: #333;
					font-size: 14px;
					font-weight: 500;
					max-width: 60%;
					text-align: right;
				}
			}
		}
	}

	// 底部固定按钮
	.bottom-fixed {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: white;
		padding: 15px 20px;
		border-top: 1px solid #eee;
		z-index: 100;

		.reorder-btn {
			width: 100%;
			height: 50px;
			background: $alittle-color ;
			color: white;
			border: none;
			border-radius: 25px;
			font-size: 16px;
			font-weight: bold;
		}
	}
}
</style>