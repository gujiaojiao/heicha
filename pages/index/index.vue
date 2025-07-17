<template>
	<view class="index">
		<!-- 轮播图区域 -->
		<view class="banner-wrapper">
			<swiper-banner :banner-list="bannerList" />
		</view>

		<!-- 用户信息区域 -->
		<view class="user-info" v-if="userInfo">
			<view class="user-info__left">
				<image class="avatar" :src="userInfo.avatar" mode="aspectFill" />
				<view class="info">
					<text class="nickname">{{ userInfo.nickname }}</text>
					<view class="vip-tag" v-if="userInfo.isVip">黄金点门人</view>
				</view>
			</view>
			<view class="user-info__right">
				<view class="coupon-entry" @tap="navigateToCoupon">
					{{ userInfo.couponCount }}张优惠券 &gt;
				</view>
			</view>
		</view>

		<!-- 快捷入口 -->
		<view class="quick-entries">
			<view class="entry-item" v-for="entry in quickEntries" :key="entry.id" @tap="navigateTo(entry.link)">
				<view class="icon" :class="entry.icon">
					<view class="content">
						<text class="title">{{ entry.title }}</text>
						<text class="subtitle">{{ entry.subtitle }}</text>
					</view>
				</view>

			</view>
		</view>

		<!-- 工具栏 -->
		<view class="tool-entries">
			<view class="tool-item" v-for="tool in toolEntries" :key="tool.id" @tap="navigateTo(tool.link)">
				<view class="icon" :class="tool.icon"></view>
				<text class="title">{{ tool.title }}</text>
			</view>
		</view>
		
		<!-- 活动加盟 -->
		<view class="activity-entry">
			<view class="public benefit">
			</view>
		</view>
		
	</view>
</template>

<script>
import SwiperBanner from '@/components/swiper-banner/index.vue'
import { getMockBanners, getMockUserInfo, getQuickEntries, getToolEntries } from '@/utils/api/mock'

export default {
	components: {
		SwiperBanner
	},
	data() {
		return {
			bannerList: [],
			userInfo: null,
			quickEntries: [],
			toolEntries: []
		}
	},
	async onLoad() {
		try {
			const [banners, user, entries, tools] = await Promise.all([
				getMockBanners(),
				getMockUserInfo(),
				getQuickEntries(),
				getToolEntries()
			])

			this.bannerList = banners
			this.userInfo = user
			this.quickEntries = entries
			this.toolEntries = tools
		} catch (error) {
			console.error('加载数据失败：', error)
		}
	},
	methods: {
		navigateTo(url) {
			uni.navigateTo({
				url,
				fail: (err) => {
					console.error('页面跳转失败：', err)
					uni.showToast({
						title: '页面跳转失败',
						icon: 'none'
					})
				}
			})
		},
		navigateToCoupon() {
			this.navigateTo('/pages/coupon/index')
		}
	}
}
</script>

<style lang="scss" scoped>
.index {
	min-height: 100vh;
	background-color: #f5f5f5;

	.banner-wrapper {
		margin-bottom: 20rpx;
	}

	.user-info {
		margin: 20rpx;
		padding: 20rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;

		&__left {
			display: flex;
			align-items: center;

			.avatar {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 20rpx;
			}

			.info {
				.nickname {
					font-size: 32rpx;
					font-weight: bold;
					margin-bottom: 8rpx;
				}

				.vip-tag {
					display: inline-block;
					font-size: 24rpx;
					color: #C1A05E;
					background-color: #FDF6E5;
					padding: 4rpx 12rpx;
					border-radius: 8rpx;
				}
			}
		}

		&__right {
			.coupon-entry {
				color: #07C160;
				font-size: 28rpx;
				padding: 12rpx 24rpx;
				background-color: #F0FFF0;
				border-radius: 30rpx;
			}
		}
	}

	.quick-entries {
		margin: 20rpx;
		display: flex;
		gap: 20rpx;

		.entry-item {
			flex: 1;
			background-color: #ffffff;
			border-radius: 16rpx;
			padding: 15rpx 0;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			text-align: center;

			.icon {
				width: 275rpx;
				height: 275rpx;
				margin-right: 20rpx;
				background-size: cover;
				background-repeat: no-repeat;
				background-position: center;
				display: flex;
				justify-content: center;
				align-items: flex-end;

				&.drink {
					background-image: url('/static/images/index/drink.png');
				}

				&.scooter {
					background-image: url('/static/images/index/scooter.png');
				}

				.content {
					margin-bottom: 5px;

					.title {
						font-size: 32rpx;
						font-weight: bold;
						margin-bottom: 8rpx;
						display: block;
					}

					.subtitle {
						font-size: 24rpx;
						color: #999;
						display: block;
					}
				}
			}
		}
	}

	.tool-entries {
		margin: 20rpx;
		background-color: #ffffff;
		border-radius: 16rpx;
		padding: 30rpx;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20rpx;

		.tool-item {
			display: flex;
			flex-direction: column;
			align-items: center;

			.icon {
				width: 60rpx;
				height: 60rpx;
				margin-bottom: 12rpx;
				background-size: contain;
				background-repeat: no-repeat;
				background-position: center;

				&.gift {
					background-image: url('/static/images/index/joinAssociation.png');
				}

				&.coupon {
					background-image: url('/static/images/index/linquancenter.png');
				}

				&.shop {
					background-image: url('/static/images/index/pointsMall.png');
				}

				&.group {
					background-image: url('/static/images/index/groupBuying.png');
				}
			}

			.title {
				font-size: 24rpx;
				color: #333;
			}
		}
	}
	.activity-entry{
		margin: 20rpx;
		// background-color: #ffffff;
		border-radius: 16rpx;
		// padding: 30rpx;
		.public-benefit{
			background-color: #ffffff;
			border-radius: 16rpx;
		}
	}
}
</style>
