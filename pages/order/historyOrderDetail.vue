<template>
	<view class="order">
		<!-- 固定顶部区域 -->
		<view class="fixed-area">
			<view class="fixed-header" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
				<uni-icons type="left" size="30" class="back" @click="back"></uni-icons>
				<view class="orderTitle">订单详情</view>
			</view>
		</view>

		<view class="scroll-Content">
			<!-- 取餐号 -->
			<view class="number">
				hhhhhrfrekfvrkcvhrevphu
			</view>
			<!-- 取餐方式-->
			<!-- 订单详情 -->
			<!-- 再来一单 -->
		</view>

	</view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const safeAreaInsets = (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets || { top: 0 })

const back = () => {
	uni.navigateBack({ delta: 1 })
}
onMounted(() => {

})
</script>

<style lang="scss" scoped>
.order {
	background: #f7f7f7;
	height: 100vh;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	.fixed-area {
		flex-shrink: 0;

		.fixed-header {
			position: fixed;
			width: 100%;
			// top: 0;
			// left: 0;
			// right: 0;
			z-index: 100;
			background: white;
			height: 50px;
			display: flex;


			.back {
				position: absolute;
				left: 2%;
				// top: 50%;
				// transform: translateY(-50%);
				flex-shrink: 0;
				line-height: 40px;
			}

			.orderTitle {
				position: absolute;
				left: 50%;
				// top: 50%;
				transform: translateX(-50%);
				font-size: 16px;
				// height: 30px;
				line-height: 40px;
				flex-shrink: 0;
			}

		}
	}



	.scroll-Content {
		width: 100%;
		flex: 1;
		// min-height: 98%;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		padding: 10px 10px;
		-webkit-overflow-scrolling: touch;
		background-color: skyblue;
		margin-top: 10px;
		.number {
			width: 100%;
			height: 30%;
			background-color: white;
			border-radius: 3px;
		}
	}


}
</style>