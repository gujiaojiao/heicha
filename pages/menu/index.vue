<template>
	<view class="menu" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
		<!-- 顶部标签 -->
		<view class="selectStore">
			<view class="backToHome" @click="backToHome">
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
			<view class="store-card" v-for="(store, idx) in stores" :key="store.id"
				:class="{ 'active': selectedStoreId === store.id }" @click="selectStore(store.id)">
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
import { ref, onMounted, onShow } from 'vue'
import CartPreview from '@/components/cart-preview/cart-preview.vue'
interface LocationRes {
	longitude: number;
	latitude: number;
}

const safeAreaInsets = (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets) || { top: 0 }
const latitude = ref<number>()
const longitude = ref<number>()
const covers = ref([
	{
		id: 0,
		title: 'map',
		latitude: 39.909,
		longitude: 116.39742,
		iconPath: '/static/images/menu/alittle.png',
		width: 32,
		height: 32
	},
	{
		id: 1,
		title: 'map2',
		latitude: 39.90,
		longitude: 116.39,
		iconPath: '/static/images/menu/alittle.png',
		width: 32,
		height: 32
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

// 选中的店铺ID
const selectedStoreId = ref(1) // 默认选中第一个店铺

// 选择店铺
const selectStore = (id: number) => {
	selectedStoreId.value = id;
	uni.switchTab({
		url: `/pages/menu/list?storeId=${id}`,
		success: () => {
			console.log('跳转成功')
		},
		fail: (err) => {
			console.error('跳转失败：', err)
		}
	})
}

const backToHome = () => {
	const url = '/pages/index/index'
	uni.switchTab({
		url,
		fail: (err) => {
			console.error('页面跳转失败')
		}
	})
}

const getLocation = async () => {
	// #ifdef MP-WEIXIN
	try {
		const setting = await wx.getSetting()
		console.log('获取设置信息：', setting)

		if (setting.authSetting['scope.userLocation']) {
			// 已经授权，直接获取位置
			wx.getLocation({
				type: 'gcj02',
				isHighAccuracy: true,
				success: function (res: LocationRes) {
					console.log('定位成功：', res)
					longitude.value = res.longitude
					latitude.value = res.latitude
					covers.value[0].latitude = res.latitude
					covers.value[0].longitude = res.longitude
				},
				fail: function (err) {
					console.error('定位失败：', err)
					handleLocationError()
				}
			})
		} else {
			try {
				await wx.authorize({ scope: 'scope.userLocation' })
				getLocation() // 获取授权成功，重新获取位置
			} catch (err) {
				console.error('获取授权失败：', err)
				handleLocationError()
			}
		}
	} catch (err) {
		console.error('获取设置信息失败：', err)
		handleLocationError()
	}
	// #endif

	// #ifndef MP-WEIXIN
	uni.getLocation({
		type: 'gcj02',
		success: function (res: LocationRes) {
			console.log('定位成功：', res)
			longitude.value = res.longitude
			latitude.value = res.latitude

			// 更新地图标记点
			covers.value[0].latitude = res.latitude
			covers.value[0].longitude = res.longitude
		},
		fail: function (err) {
			console.error('定位失败：', err)
			handleLocationError()
		}
	})
	// #endif
}

// 处理定位错误
const handleLocationError = () => {
	wx.showModal({
		title: '提示',
		content: '需要获取您的地理位置，请在设置中开启定位权限',
		success: function (res) {
			if (res.confirm) {
				wx.openSetting({
					success: function (res) {
						console.log('打开设置页面成功')
						if (res.authSetting['scope.userLocation']) {
							// 用户在设置页面中允许了定位权限
							getLocation()
						}
					}
				})
			}
		}
	})

	longitude.value = 120.585316
	latitude.value = 31.298886
}

onMounted(() => {
	console.log('页面加载，准备获取位置')
	getLocation()
})
</script>

<style lang="scss" scoped>
.menu {

	// 不需要再写 padding-top
	.selectStore {
		min-height: 30px;
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
			box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
			margin: 0 10px 16px 10px;
			padding: 16px 12px 12px 12px;
			position: relative;
			display: flex;
			border: 1rpx solid transparent;
			transition: all 0.2s ease;

			&.active,
			&:active {
				border-color: #007f61;
			}

			.uniui-left {
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

			.uniui-right {
				display: flex;
				flex: 1;
				flex-direction: column;
				border-left: 1rpx solid lightgrey;
				text-align: center;
				justify-content: center;
				align-items: center;

				.go-order {
					color: #007f61;
					margin-right: 8px;
					font-size: 15px;
					font-weight: bold;
				}

				.distance {
					color: #007f61;
					font-size: 13px;
					margin-right: 8px;
				}

				.info {
					display: flex;
					flex-direction: row;
					margin-top: 20rpx;
					gap: 30rpx;
					justify-content: space-between;
				}
			}



		}
	}
}
</style>