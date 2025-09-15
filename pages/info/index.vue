<template>
	<view class="userInfo">
		<!-- 固定顶部区域 -->
		<view class="fixed-area">
			<view class="fixed-header" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
				<uni-icons type="left" size="30" class="back" @click="returnBack()"></uni-icons>
				<view class="orderTitle">一点点</view>
			</view>
		</view>

		<!-- 内容区域 -->
		<view class="content" :style="{ marginTop: (safeAreaInsets.top + 60) + 'px' }">
			<!-- 头像部分 -->
			<view class="avator">
				<view class="border-avatar">
					<image class="avatar" :src="userInfo.avatar" mode="aspectFill" />
				</view>
			</view>
			<!-- 资料部分 -->
			<view class="userInfomation">
				<span>我的资料</span>
			</view>
		</view>
	</view>
</template>

<script setup lang='ts'>
import { ref, onMounted } from 'vue'
import { getMineUserInfo, getMemberInfo, getMemberBenefits, getMineFunctions } from '@/utils/api/mine'
import type { MineUserInfo, MemberInfo, MemberBenefit, MineFunction } from '@/utils/api/mine'
declare const uni: any

const safeAreaInsets = (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets) || { top: 0 }
const userInfo = ref<MineUserInfo | null>(null)
const loadData = async () => {
	try {
		const [user] = await Promise.all([
			getMineUserInfo()
		])
		userInfo.value = user
		console.log(1111, userInfo.value)
	} catch (error) {
		console.error('加载数据失败', error)
	}
}
onMounted(() => {
	loadData()
})
</script>

<style lang="scss" scoped>
.userInfo {
	height: 100vh;
	background-color: #f7f7f7;

	.fixed-area {
		// position: fixed;
		flex-shrink: 0; // 防止收缩

		.fixed-header {
			display: flex;
			position: fixed;
			top: 0;
			left: 0;
			right: 0;
			z-index: 100;
			width: 100%;
			height: 50px;
			display: flex;
			align-items: center;
			// position: relative;
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

	.content {
		height: 100vh;

		.avator {
			margin: 15px 15px 0 15px;
			height: 20vh;
			background-color: white;
			border-radius: 15px;
			box-shadow: 3px 3px 5px #ececec, -3px -3px 5px #ececec;
			display: flex;
			text-align: center;
			justify-content: center;
			align-items: center;

			.border-avatar {
				width: 190rpx;
				height: 190rpx;
				border: 3rpx solid seagreen;
				display: flex;
				align-items: center;
				border-radius: 50%;

				.avatar {
					margin: 0 auto;
					width: 180rpx;
					height: 180rpx;
					border-radius: 50%;
					// border:4rpx solid green;
				}
			}

		}
	
		.userInfomation{
			margin: 15px 15px 0 15px;
		}
	}
}
</style>