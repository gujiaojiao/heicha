<template>
	<view class="menu" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
		<!-- 顶部标签 -->
		<view class="selectStore">
			<view class="backToHome">
				<uni-icons type="home" size="30"></uni-icons>
			</view>
			<text class="subtitle">选择门店</text>
		</view>

		<view class="page-body">
			<view class="page-section page-section-gap">
				<map style="width: 100%; height: 300px;" :latitude="latitude" :longitude="longitude" :markers="covers">
				</map>
			</view>
		</view>
		<cart-preview />
	</view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CartPreview from '@/components/cart-preview/cart-preview.vue'
// @ts-ignore
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
}
</style>