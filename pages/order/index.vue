<template>
	<view class="order">
		<!-- 固定顶部区域 -->
		<view class="fixed-header" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
			<!-- 顶部名称 -->
			<view class="orderTitle">1点点</view>
			<!-- tab切换 -->
			<view class="menu-tabs">
				<view :class="['tab', activeTab === 0 ? 'active' : '']" @click="switchTab(0)">当前订单</view>
				<view :class="['tab', activeTab === 1 ? 'active' : '']" @click="switchTab(1)">历史订单</view>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content-area" :style="{ paddingTop: safeAreaInsets.top + 80 + 'px' }">
			<!-- 当前订单 -->
			<view class="currentOrder" v-if="activeTab === 0">
				<!-- 无订单状态 -->
				<view class="noCurrentOrder" v-if="currentOrderState === 0">
					<view class="animation-container">
						<!-- 使用图片组合实现动画效果 -->
						<view class="loading-animation">
							<view class="dot dot1"></view>
							<view class="dot dot2"></view>
							<view class="dot dot3"></view>
							<view class="dot dot4"></view>
							<view class="dot dot5"></view>
						</view>
					</view>
					<view class="empty-text">
						当前尚未有进行中的订单<br>
						快去点一杯ba~
					</view>
				</view>
				<!-- 有订单状态 -->
				<view class="existOrder" v-if="currentOrderState === 1 && currentOrder">
					<CurrentOrder :orderInfo="currentOrder" />
				</view>
			</view>
			<!-- 历史订单 -->
			<view class="historyOrder" v-if="activeTab === 1">
				<view v-for="item in historyOrder" :key="item.id">
					<view class="historyOrder__item" @click="handleToDetail(item.id)">
						<view class="historyOrderItemcontent">
							<view class="historyOrderItem">
								<view class="addressName">{{ item.storeAddress }}</view>
								<view class="status">{{ item.status }}</view>
							</view>
							<view class="orderTime">{{ item.orderTime }}</view>
							<view class="orderWay">自取</view>
						</view>
						<!-- 订单只有 1杯饮料-->
						<view v-if="item.products.length == 1">
							<view class="product-list">
								<image class="prod-img" :src="item.products[0].imageUrl" mode="aspectFill" />
								<view class="singleOrder">
									<view class="milkteaDetail" style="font-weight: 550;">
										{{ item.products[0].name }}
									</view>
									<span style="font-size: 14px;">{{ item.products[0].desc }}</span>
								</view>
								<view class="total">
									<span style="font-size: 18px;font-weight: 600;">{{ item.totalPrice.toFixed(2)
									}}</span>
									<span>共{{ item.products.length }}件</span>
								</view>
							</view>
						</view>
						<!-- 订单有多杯 -->
						<view v-if="item.products.length > 1">
							<view class="product-list">
								<view v-for="pItem in item.products" :key="pItem.index">
									<image class="prod-img" :src="pItem.imageUrl" mode="aspectFill" />
								</view>
								<view class="total">
									<span style="font-size: 18px;font-weight: 600;">{{ item.totalPrice.toFixed(2)
									}}</span>
									<span>共{{ item.products.length }}件</span>
								</view>
							</view>
						</view>
						<view class="orderAgain">
							<button type="default" size="mini" plain="true" @click="handleToMenu">再来一单</button>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script setup lang="ts">
// @ts-ignore
import { ref, onMounted } from 'vue'
import { getCurrentOrder, getOrderHistory } from '@/utils/api/order-mock'
import CurrentOrder from '@/components/current-order'

// 声明uni类型
declare const uni: any

const safeAreaInsets = (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets || { top: 0 })
const activeTab = ref(0)
const historyOrder = ref([])
const currentOrderState = ref(0)
const currentOrder = ref(null)

// 切换tab
const switchTab = (tabIndex: number) => {
	activeTab.value = tabIndex
	loadData()
}

const handleToDetail = (id: string | number) => {
	const url = '/pages/order/historyOrderDetail?id=' + id
	uni.navigateTo({
		url,
		fail: (err: any) => {
			console.error('页面跳转失败')
		}
	})

}
const handleToMenu = () => {
	const url = '/pages/menu/index'
	uni.navigateTo({
		url,
		fail: (err: any) => {
			console.error('页面跳转失败')
		}
	})
}

// 加载数据
const loadData = () => {
	if (activeTab.value === 0) {
		getCurrentOrder().then(res => {
			currentOrder.value = res
			// 判断是否有订单
			if (res && Object.keys(res).length > 0) {
				currentOrderState.value = 1 // 有订单
			} else {
				currentOrderState.value = 0 // 无订单
			}
		}).catch(err => {
			console.error('获取当前订单失败:', err)
			currentOrderState.value = 0 // 发生错误时默认无订单
		})
	} else {
		getOrderHistory().then(res => {
			console.log('历史订单数据：', res)
			historyOrder.value = res || []
		})
	}
}

onMounted(() => {
	loadData()
})
</script>

<style lang="scss" scoped>
.order {
	background: #f7f7f7;
	height: 100vh;
	display: flex;
	flex-direction: column;

	.fixed-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: white;

		.orderTitle {
			display: flex;
			justify-content: center;
			font-size: 16px;
			width: 100%;
			height: 30px;
			line-height: 30px;
			flex-shrink: 0;
		}

		.menu-tabs {
			width: 100%;
			display: flex;
			justify-content: space-around;
			border-bottom: 1px solid #eee;
			margin: 10px 0;
			height: 40px;
			flex-shrink: 0;

			.tab {
				flex: 1;
				text-align: center;
				padding: 12px 0 8px 0;
				font-size: 16px;
				color: #888;
				position: relative;

				&.active {
					color: #1aad19;
					font-weight: bold;

					&::after {
						content: '';
						display: block;
						width: 60%;
						height: 3px;
						background: #1aad19;
						border-radius: 2px;
						position: absolute;
						left: 20%;
						bottom: -1px;
					}
				}
			}
		}
	}

	.content-area {
		flex: 1;
		overflow: hidden;

		.currentOrder {
			padding: 15px 10px;
			height: 100%;

			.noCurrentOrder {
				width: 100%;
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.animation-container {
					width: 200px;
					margin-bottom: 20px;
					display: flex;
					align-items: center;
					justify-content: center;

					.loading-animation {
						display: flex;
						align-items: center;
						justify-content: center;
						gap: 8px;

						.dot {
							width: 20px;
							height: 20px;
							border-radius: 4px;
							animation: pulse 1.5s infinite ease-in-out;

							&.dot1 {
								background-color: #0b5d1e;
								animation-delay: 0s;
							}

							&.dot2 {
								background-color: #127a29;
								animation-delay: 0.2s;
							}

							&.dot3 {
								background-color: #1aad19;
								animation-delay: 0.4s;
							}

							&.dot4 {
								background-color: #7fbc26;
								animation-delay: 0.6s;
							}

							&.dot5 {
								background-color: #c0e086;
								animation-delay: 0.8s;
							}
						}
					}
				}

				.empty-text {
					text-align: center;
					color: #007f61;
					font-size: 16px;
					line-height: 1.6;
				}
			}
		}

		.historyOrder {
			height: 100%;
			padding: 15px 10px;
			overflow-y: auto;
			display: flex;
			flex-direction: column;
			gap: 10px;

			.historyOrder__item {
				display: flex;
				flex-direction: column;
				background: #fff;
				border-radius: 5px;
				padding: 15px;
				// align-items: center;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

				.historyOrderItemcontent {
					display: flex;
					flex-direction: column;
					padding-bottom: 35rpx;
					border-bottom: 1px solid #eee;

					.historyOrderItem {
						display: flex;
						flex-direction: row;
						justify-content: space-between;
					}

					.orderWay {
						width: 12%;
						text-align: center;
						background-color: rgba(174, 213, 129, 0.5);
						border-radius: 5px;
					}
				}

				.product-list {
					display: flex;
					flex-direction: row;
					border-bottom: 1px solid #eee;

					.prod-img {
						width: 150rpx;
						height: 150rpx;
						margin-bottom: 10px;
					}

					.singleOrder {
						// height: 150rpx;
						display: flex;
						flex-direction: column;
						padding-top: 10px;
						// justify-content: space-around;
						font-size: 14px;
						// margin: 5px 10px;

					}

					.total {
						display: flex;
						flex-direction: column;
						padding-top: 10px;
						// justify-content: space-around;
						font-size: 14px;
						flex: 1;
						text-align: end;
					}

				}

				.orderAgain {
					padding-top: 10px;
					display: flex;
					justify-content: flex-end;
					align-self: flex-end; // 保留这行
					margin-left: auto; // 添加这行作为备选方案

					button {
						// background-color: #1aad19 !important;
						padding: 0 10px;
						color: $uni-text-color-green;
						border: 1px solid $uni-text-color-green !important;
					}
				}
			}
		}
	}
}

@keyframes pulse {

	0%,
	100% {
		transform: scale(1);
		opacity: 1;
	}

	50% {
		transform: scale(0.8);
		opacity: 0.8;
	}
}
</style>