<template>
	<view class="order">
		<!-- 固定顶部区域 -->
		<view class="fixed-header" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
			<uni-icons type="left" size="30" class="back"  @click="back"></uni-icons>
			<view class="orderTitle">订单详情</view>
		</view>
		<!-- 取餐号 -->
		<view class="number">
			
		</view>
		<!-- 取餐方式-->
		<!-- 订单详情 -->
		<!-- 再来一单 -->
	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const safeAreaInsets = (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets || { top: 0 })

const back=()=>{
	uni.navigateBack({delta:1})
}
</script>

<style lang="scss" scoped>
.order{
	background: #f7f7f7;
	height: 100vh;
	display: flex;
	flex-direction: column;
	
	.fixed-header{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background: white;
		display: flex;
		height: 5%;
		
		.back{
			position:absolute;
			left: 2%;
			top:50%;
			transform: translateY(-50%);
		}
		
		.orderTitle {
			position: absolute;
			left: 50%;
			top:50%;
			transform: translate(-50%,-50%);
			font-size: 16px;
			// width: 100%;
			// height: 30px;
			// line-height: 30px;
			// flex-shrink: 0;
		}
		
	}
	
	.number{
		
	}
}
</style>