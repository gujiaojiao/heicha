<template>
	<view class="order" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
		<!-- 顶部名称 -->
		<view class="orderTitle">1点点</view>
		<!-- tab切换 -->
		<view class="menu-tabs">
			<view :class="['tab', activeTab === 0 ? 'active' : '']" @click="activeTab = 0">当前订单</view>
			<view :class="['tab', activeTab === 1 ? 'active' : '']" @click="activeTab = 1">历史订单</view>
		</view>
		<!-- 当前订单 -->
		<view class="currentOrder" v-if="activeTab === 0">
			lalalal
		</view>
		<!-- 历史订单 -->
		<view class="historyOrder" v-if="activeTab === 1"
			:style="{ height: `calc(100vh - ${safeAreaInsets.top + 30 + 40}px)` }">
			<view v-for="item in historyOrder" :key="item.id">
				<view class="historyOrder__item">
					<view class="historyOrder__item__left">
						<view class="historyOrder__item__left__title">{{ item.storeAddress }}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getCurrentOrder, getOrderHistory } from '@/utils/api/order-mock'

const safeAreaInsets = (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets || { top: 0 })
const activeTab = ref(0)

onMounted(() => {
	if (activeTab.value === 0) {
		getCurrentOrder().then(res => {
			console.log(1111111, res)
		})
	} else {
		getOrderHistory().then(res => {
			console.log(222222, res)
		})
	}
})


</script>

<style lang="scss" scoped>
.order {
	background: #f7f7f7;
	min-height: 100vh;

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

	.historyOrder {
		margin: 15px 10px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		overflow-y: auto;
		background-color: #888;
		// height: calc(100vh - 100px);

		.historyOrder__item {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
}
</style>