<template>
    <view class="menuList" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
		<!-- 顶部 -->
		<view class="selectStore">
			<view class="backToHome" @click="backToHome">
				<uni-icons type="home" size="30"></uni-icons>
			</view>
			<text class="subtitle">选择门店</text>
		</view>
    </view>
</template>

<script setup lang="ts">
import {ref} from 'vue'
const safeAreaInsets = (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets) || { top: 0 }
</script>

<style lang="scss" scoped>
	.menuList{
		.selectStore{
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