<template>
	<view class="menu" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
		<!-- 顶部标签 -->
		<view class="selectStore">
			<view class="backToHome">
				<uni-icons type="home" size="30"></uni-icons>
			</view>
			<text class="subtitle">选择门店</text>
		</view>

		<!-- Tab切换 -->
		<view class="menu-tabs">
			<view :class="['tab', activeTab === 0 ? 'active' : '']" @click="activeTab = 0">选择门店</view>
			<view :class="['tab', activeTab === 1 ? 'active' : '']" @click="activeTab = 1">收藏最爱</view>
			<view :class="['tab', activeTab === 2 ? 'active' : '']" @click="activeTab = 2">按商品查</view>
		</view>

		<!-- 搜索栏 -->
		<view class="search-bar">
			<text class="search-location">苏州市苏州市住房公积…</text>
			<view class="search-input">
				<uni-icons type="search" size="18" color="#bbb" />
				<input class="input" placeholder="搜索" />
			</view>
		</view>

		<!-- 地图 -->
		<view class="page-body">
			<view class="page-section page-section-gap">
				<map style="width: 100%; height: 300px;" :latitude="latitude" :longitude="longitude" :markers="covers">
				</map>
			</view>
		</view>

		<!-- 门店列表 -->
		<view class="store-list">
			<view class="store-card" v-for="(store, idx) in stores" :key="store.id">
				<view class="uniui-left">
					<view class="store-header">
						<uni-icons type="star" size="18" color="#bbb" style="margin-right:4px;" />
						<text class="store-title">{{ store.name }}</text>
						<view v-if="idx === 0" class="selected-icon">
							<uni-icons type="checkmark" size="20" color="#1aad19" />
						</view>
					</view>
					<view class="store-status-row">
						<text v-if="idx === 1" class="now-tag">NOW</text>
						<text v-if="idx === 1" class="now-desc">现在下单，立即制作</text>
						<text v-else class="order-status">1单/共1杯 制作中</text>
					</view>
					<view class="store-address">{{ store.address }}</view>
					<view class="store-actions">
						<view class="status-btn">营业中</view>
						<view class="order-btn">可外卖</view>
						
					</view>
				</view>
				
				<view class="uniui-right">
					<view class="go-order">去下单</view>
					<text class="distance">距离{{ store.distance }}</text>
					<view class="info">
						<uni-icons type="phone" size="20" color="#bbb" />
						<uni-icons type="paperplane" size="20" color="#bbb" />
					</view>
					
				</view>
			</view>
		</view>

		<!-- <cart-preview /> -->
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CartPreview from '@/components/cart-preview/cart-preview.vue'
const safeAreaInsets = (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets) || { top: 0 }
const latitude = ref<number>(39.909)
const longitude = ref<number>(116.39742)
const covers = ref([
	{
		id: 0,
		title: 'map',
		latitude: 39.909,
		longitude: 116.39742,
		iconPath: '/static/images/menu/alittle.png'
	},
	{
		id: 1,
		title: 'map2',
		latitude: 39.90,
		longitude: 116.39,
		iconPath: '/static/images/menu/alittle.png'
	}
])
const activeTab = ref(0)
const stores = ref([
	{
		id: 1,
		name: '苏州体育中心店',
		address: '江苏省苏州市虎丘区三香路111号',
		distance: '1km',
	},
	{
		id: 2,
		name: '邓尉店',
		address: '江苏省苏州市高新区塔园路88号',
		distance: '1.35km',
	},
	{
		id: 3,
		name: '狮山金融中心店',
		address: '江苏省苏州市高新区狮山路99号',
		distance: '2km',
	},
])
</script>

<style lang="scss" scoped>
.menu {

	// 不需要再写 padding-top
	.selectStore {
		min-height: 50px;
		position: relative;

		.backToHome {
			position: absolute;
			left: 15rpx;
			top: 50%;
			transform: translateY(-50%);
		}

		.subtitle {
			position: absolute;
			left: 50%;
			top: 50%;
			transform: translate(-50%, -50%);
			font-size: 18px;
			white-space: nowrap;
		}
	}
	.menu-tabs {
		width: 65%;
		display: flex;
		border-bottom: 1px solid #eee;
		margin: 0 0 10px 0;
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
	.search-bar {
		display: flex;
		align-items: center;
		padding: 10px 16px 10px 16px;
		background: #fff;
		border-bottom: 1px solid #eee;
		.search-location {
			flex: 1;
			font-size: 16px;
			color: #333;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.search-input {
			display: flex;
			align-items: center;
			background: #f5f5f5;
			border-radius: 16px;
			padding: 4px 10px;
			margin-left: 10px;
			.input {
				border: none;
				background: transparent;
				outline: none;
				font-size: 15px;
				width: 60px;
			}
		}
	}
	.store-list {
		margin: 10px 0 0 0;
		.store-card {
			background: #fff;
			border-radius: 10px;
			box-shadow: 0 2px 8px rgba(0,0,0,0.03);
			margin: 0 10px 16px 10px;
			padding: 16px 12px 12px 12px;
			position: relative;
			display: flex;
			.uniui-left{
				width: 60%;
				margin-right: 20rpx;
				.store-header {
					display: flex;
					align-items: center;
					font-size: 18px;
					font-weight: bold;
					color: #222;
					.selected-icon {
						margin-left: auto;
					}
				}
				.store-status-row {
					display: flex;
					align-items: center;
					margin: 8px 0 4px 0;
					.now-tag {
						background: #1aad19;
						color: #fff;
						border-radius: 4px;
						padding: 2px 6px;
						font-size: 13px;
						margin-right: 6px;
					}
					.now-desc {
						color: #007f61;
						font-size: 14px;
					}
					.order-status {
						color: #007f61;
						font-size: 14px;
					}
				}
				.store-address {
					color: #888;
					font-size: 14px;
					margin-bottom: 8px;
				}
				.store-actions {
					display: flex;
					align-items: center;
					.status-btn {
						background: #e8f5e9;
						color: #007f61;
						border-radius: 4px;
						padding: 2px 10px;
						font-size: 14px;
						margin-right: 8px;
					}
					.order-btn {
						background: #e8f5e9;
						color: #007f61;
						border-radius: 4px;
						padding: 2px 10px;
						font-size: 14px;
						margin-right: 8px;
					}
					
				}
			}
			.uniui-right{
				display: flex;
				flex: 1;
				flex-direction: column;
				border-left: 1rpx solid lightgrey;
				text-align: center;
				justify-content: center;
				align-items: center;
				.go-order {
					color:#007f61;
					margin-right: 8px;
					font-size: 15px;
					font-weight: bold;
				}
				.distance {
					color: #007f61;
					font-size: 13px;
					margin-right: 8px;
				}
				.info{
					display: flex;
					flex-direction: row;
					margin-top: 20rpx;
					gap: 30rpx;
					justify-content: space-between;
				}
			}
			
			
			
		}
		// .store-card :active{
		// 	border:1rpx solid #007f61;
		// }
	}
}
</style>