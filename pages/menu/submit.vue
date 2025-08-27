<template>
	<view class="submitOrder">
		<!-- 固定顶部区域 -->
		<view class="fixed-area">
			<view class="fixed-header">
				<uni-icons type="left" size="30" class="back" @click="returnBack()"></uni-icons>
				<view class="orderTitle">订单详情</view>
			</view>
		</view>
		<!-- 内容区域 -->
		
		<view class="content">
			lalalal
		</view>
		
		<!-- 底部区域-支付 -->
		<view class="bottom-fixed">
			<view class="payNumber">
				<text>待支付，¥</text>
				<text>{{total.toFixed(2)}}</text>
			</view>
			<button class="recoder-btn" @click="submit">提交订单</button>
		</view>
	</view>
</template>

<script setup lang='ts'>
import {ref,onMounted} from 'vue'

const total=ref<Number>(0)
// declare const uni: any
const returnBack=()=>{
	// uni.navigateBack({delta:1})
	uni.switchTab({ url: '/pages/menu/list' })
}
</script>

<style lang="scss" scoped>
.submitOrder{
	background: white;
	height: 100vh;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	.fixed-area {
		flex-shrink: 0; // 防止收缩
	
		.fixed-header {
			width: 100%;
			height: 50px;
			display: flex;
			align-items: center;
			position: relative;
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
	
	.bottom-fixed {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background: white;
		padding: 15px 20px;
		border-top: 1px solid #eee;
		z-index: 100;
	
		.recoder-btn {
			width: 30%;
			height: 50px;
			background: $alittle-color ;
			color: white;
			border: none;
			border-radius: 25px;
			font-size: 16px;
			font-weight: bold;
		}
	}
}
</style>