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
				lalalal
			</view>
			<!-- 历史订单 -->
			<view class="historyOrder" v-if="activeTab === 1">
				<view v-for="item in historyOrder" :key="item.id">
					<view class="historyOrder__item">
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
							</view>
						</view>
						<!-- 订单有23杯 -->
						<view v-if="item.products.length > 1">
							<view v-for="pItem in item.products" :key="pItem.index">
								<view class="product-list">
									<image :src="pItem.imageUrl" mode="aspectFill" />
								</view>
							</view>
						</view>
						<view class="orderAgain">
							<button type="default" size="mini" plain="true">再来一单</button>
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

const safeAreaInsets = (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets || { top: 0 })
const activeTab = ref(0)
const historyOrder = ref([])

// 切换tab
const switchTab = (tabIndex: number) => {
	activeTab.value = tabIndex
	loadData()
}

// 加载数据
const loadData = () => {
	if (activeTab.value === 0) {
		getCurrentOrder().then(res => {
			console.log('当前订单数据：', res)
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
		background: #f7f7f7;

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
				}

				.product-list {
					.prod-img {
						width: 100px;
						height: 100px;
						margin-bottom: 10px;
					}

					border-bottom: 1px solid #eee;
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
</style>