<template>
	<view class="index">
		<view class="banner-wrapper">
			<swiper-banner :banner-list="bannerList" />
		</view>
	</view>
</template>

<script setup lang="ts">
import SwiperBanner from '@/components/swiper-banner/index.vue'
import { ref } from 'vue'

// 模拟轮播图数据
const bannerList = ref([
	{
		id: 1,
		imageUrl: '/static/images/banner/beijing.jpg',
		link: '/pages/product/detail?id=1'
	},
	// {
	// 	id: 2,
	// 	imageUrl: '/static/images/banner/banner2.jpg',
	// 	link: '/pages/product/detail?id=2'
	// },
	// {
	// 	id: 3,
	// 	imageUrl: '/static/images/banner/banner3.jpg',
	// 	link: '/pages/product/detail?id=3'
	// }
])
</script>

<style lang="scss" scoped>
.index {
	padding: 20rpx;

	.banner-wrapper {
		margin-bottom: 20rpx;
	}
}
</style>
