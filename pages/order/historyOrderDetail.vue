<template>
	<view class="order" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
		<!-- 固定顶部区域 -->
		<view class="fixed-area">
			<view class="fixed-header">
				<uni-icons type="left" size="30" class="back" @click="back"></uni-icons>
				<view class="orderTitle">订单详情</view>
			</view>
		</view>

		<!-- 滚动内容区域 -->
		<view class="scrollable-area">
			<!-- 取餐号和状态 -->
			<view class="order-status-section">
				<view class="pickup-number">
					<text class="label">取餐号</text>
					<text class="number">B500</text>
					<view class="status">
						<text class="dots">•••</text>
						<text class="status-text">订单已完成</text>
						<text class="dots">•••</text>
					</view>
				</view>
			</view>

			<!-- 促销横幅 -->
			<!-- <view class="promo-banner">
				<view class="promo-content">
					<view class="promo-text">
						<text class="main-text">加入点门社群</text>
						<text class="sub-text">首次入群享领</text>
					</view>
					<view class="promo-offer">
						<text class="offer-tag">超值券包</text>
						<text class="offer-amount">30</text>
						<text class="offer-currency">元</text>
					</view>
				</view>
				<view class="promo-characters">
					<view class="character char1">☁️</view>
					<view class="character char2">❤️</view>
					<view class="character char3">🌿</view>
				</view>
			</view> -->

			<!-- 订单详情卡片 -->
			<view class="order-details">
				<view class="detail-card">
					<text class="detail-label">取餐时间</text>
					<text class="detail-value">立即取餐</text>
				</view>
				<view class="detail-card">
					<text class="detail-label">享用方式</text>
					<text class="detail-value">自取</text>
				</view>
			</view>

			<!-- 门店信息 -->
			<view class="store-info-card">
				<view class="store-header">
					<text class="store-name">苏州创业园店</text>
					<uni-icons type="right" size="16" color="#999"></uni-icons>
				</view>
				<view class="store-address">
					<uni-icons type="location" size="16" color="#999"></uni-icons>
					<text class="address-text">江苏省苏州市虎丘区高新区...</text>
				</view>
				<view class="store-contact">
					<uni-icons type="phone" size="20" color="#1aad19"></uni-icons>
				</view>
			</view>

			<!-- 商品详情 -->
			<view class="product-card">
				<view class="product-info">
					<image src="/static/images/menu/alittle.png" class="product-image" mode="aspectFill"></image>
					<view class="product-details">
						<text class="product-name">四季奶青</text>
						<view class="product-options">
							<text class="option">中杯</text>
							<text class="option">去冰</text>
							<text class="option">不另外加糖</text>
							<text class="option">波霸</text>
							<text class="option">椰果</text>
						</view>
						<view class="promo-tags">
							<text class="promo-tag">【超值】经典招牌8选1</text>
							<text class="discount">- ¥12</text>
						</view>
					</view>
					<view class="product-price">
						<text class="price">¥12.00</text>
						<text class="quantity">x1</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部固定按钮 -->
		<view class="bottom-fixed">
			<button class="reorder-btn" @click="reorder">再来一单</button>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 声明uni全局变量
declare const uni: any

const safeAreaInsets = (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets) || { top: 0 }

const back = () => {
	uni.navigateBack({ delta: 1 })
}

const reorder = () => {
	// 再来一单的逻辑
	// uni.showToast({
	// 	title: '正在跳转到点餐页面...',
	// 	icon: 'loading',
	// 	duration: 500
	// })

	setTimeout(() => {
		uni.switchTab({
			url: '/pages/menu/list'
		})
	}, 200)
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

		// // 促销横幅
		// .promo-banner {
		// 	background: linear-gradient(135deg, #1aad19, #2ecc71);
		// 	border-radius: 12px;
		// 	padding: 20px;
		// 	margin-bottom: 15px;
		// 	display: flex;
		// 	justify-content: space-between;
		// 	align-items: center;
		// 	color: white;

		// 	.promo-content {
		// 		flex: 1;

		// 		.main-text {
		// 			display: block;
		// 			font-size: 18px;
		// 			font-weight: bold;
		// 			margin-bottom: 5px;
		// 		}

		// 		.sub-text {
		// 			display: block;
		// 			font-size: 14px;
		// 			opacity: 0.9;
		// 			margin-bottom: 10px;
		// 		}

		// 		.promo-offer {
		// 			display: flex;
		// 			align-items: baseline;

		// 			.offer-tag {
		// 				background: rgba(255, 255, 255, 0.2);
		// 				padding: 2px 8px;
		// 				border-radius: 12px;
		// 				font-size: 12px;
		// 				margin-right: 8px;
		// 			}

		// 			.offer-amount {
		// 				font-size: 24px;
		// 				font-weight: bold;
		// 				margin-right: 4px;
		// 			}

		// 			.offer-currency {
		// 				font-size: 16px;
		// 			}
		// 		}
		// 	}

		// 	.promo-characters {
		// 		display: flex;
		// 		gap: 8px;

		// 		.character {
		// 			font-size: 24px;
		// 			opacity: 0.8;
		// 		}
		// 	}
		// }

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
			margin-bottom: 80px; // 为底部按钮留出空间

			.product-info {
				display: flex;

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

					.promo-tags {
						display: flex;
						align-items: center;
						gap: 8px;

						.promo-tag {
							color: #e74c3c;
							font-size: 12px;
						}

						.discount {
							color: #e74c3c;
							font-size: 14px;
							font-weight: bold;
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
			background:$alittle-color ;
			color: white;
			border: none;
			border-radius: 25px;
			font-size: 16px;
			font-weight: bold;
		}
	}
}
</style>