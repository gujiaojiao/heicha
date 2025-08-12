<template>
	<view class="menu-list">
		<!-- 顶部搜索 -->
		<view class="selectMenu" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
			<view class="backToHome" @click="backToHome">
				<uni-icons type="home" size="30"></uni-icons>
			</view>
			<!-- 搜索栏 -->
			<view class="search-bar">
				<uni-icons type="search" size="18" />
				<input class="search-input" placeholder="搜索" disabled />
			</view>
		</view>
		<!-- 门店信息 -->
		<view class="store-bar">
			<view class="left">
				<!-- <uni-icons type="home" size="22" @click="backToHome" /> -->
				<text class="store-name">苏州体育中心店</text>
				<uni-icons type="arrowdown" size="16" class="arrow" />
				<text class="distance">距离您1km</text>
			</view>
			<view class="right">
				<view class="btn self">自取</view>
				<view class="btn delivery">外卖</view>
			</view>
		</view>

		<view class="content">
			<!-- 纵向菜单分类 -->
			<scroll-view scroll-y="true" class="category-bar">
				<view v-for="cat in categories" :key="cat.id"
					:class="['cat-item', cat.id === activeCategory ? 'active' : '']" @click="selectCategory(cat.id)">
					<image v-if="cat.icon && cat.icon !== 'NEW'" :src="cat.icon" class="cat-icon" />
					<text v-else-if="cat.icon === 'NEW'" class="cat-new">NEW</text>
					<text class="cat-name">{{ cat.name }}</text>
				</view>
			</scroll-view>

			<view class="menuContent">
				<!-- banner -->
				<!-- <swiper class="banner-swiper" circular autoplay interval="3000">
					<swiper-item v-for="b in banners" :key="b.id">
						<image :src="b.imageUrl" class="banner-img" mode="aspectFit" />
					</swiper-item>
				</swiper> -->
				<view class="banner-swiper">
					<swiper-banner :banner-list="banners" />
				</view>


				<!-- 商品列表 -->
				<view class="product-list">
					<view v-for="prod in filteredProducts" :key="prod.id" class="product-item">
						<image :src="prod.imageUrl" class="prod-img" mode="aspectFill" />
						<view class="prod-info">
							<view class="prod-title">
								<text class="prod-name">{{ prod.name }}</text>
								<text v-if="prod.isNew" class="prod-new">NEW</text>
							</view>
							<!-- <text class="prod-desc">{{ prod.desc }}</text> -->
							<view class="prod-bottom">
								<text class="prod-price">￥{{ prod.price.toFixed(2) }}</text>
								<button class="add-btn" size="mini">+</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Ref } from 'vue'
import { getMenuCategories, getMenuProducts } from '@/utils/api/menu-mock'
import { getMockBanners } from '@/utils/api/mock'
import SwiperBanner from '@/components/swiper-banner/index.vue'

const safeAreaInsets = (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets) || { top: 0 }
const categories: Ref<any[]> = ref([])
const products: Ref<any[]> = ref([])
const banners: Ref<any[]> = ref([])
const activeCategory = ref(1)

const filteredProducts = computed(() => {
	return products.value.filter((p: any) => p.categoryId === activeCategory.value)
})

function selectCategory(id: number) {
	activeCategory.value = id
}
function backToHome() {
	uni.switchTab({ url: '/pages/index/index' })
}

onMounted(async () => {
	categories.value = await getMenuCategories()
	products.value = await getMenuProducts()
	banners.value = await getMockBanners()
})
</script>
<style lang="scss" scoped>
.menu-list {
	background: #f7f7f7;
	height: 100vh;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;

	.selectMenu {
		position: fixed;
		width: 100%;
		// top: 0;
		// left: 0;
		// right: 0;
		z-index: 100;
		height: 50px;
		background-color: white;
		// position: relative;

		.backToHome {
			position: absolute;
			left: 15rpx;
			// top: 50%;
			// transform: translateY(-50%);
		}

		.search-bar {
			position: absolute;
			display: flex;
			width: 40%;
			align-items: center;
			background: #f2f2f2;
			border-radius: 16px;
			padding: 6px 12px;
			left: 50%;
			// top: 50%;
			transform: translateX(-50%);

			.search-input {
				border: none;
				background: transparent;
				margin-left: 6px;
				font-size: 15px;
				flex: 1;
			}
		}
	}

	.store-bar {
		display: flex;
		margin-top: 60px;
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px 8px 16px;
		background: #fff;
		overflow: hidden;

		.left {
			display: flex;
			align-items: center;

			.store-name {
				font-weight: bold;
				margin: 0 4px 0 8px;
			}

			.arrow {
				margin-right: 8px;
			}

			.distance {
				color: #999;
				font-size: 12px;
			}
		}

		.right {
			display: flex;

			.btn {
				font-size: 13px;
				padding: 2px 12px;
				border-radius: 16px;
				margin-left: 8px;
				border: 1px solid #1aad19;
				color: #1aad19;
				background: #fff;

				&.self {
					background: #1aad19;
					color: #fff;
				}
			}
		}
	}

	.content {
		display: flex;

		.category-bar {
			left: 0;
			width: 20%;
			height: 85vh;
			margin: 12px 0 0 0;
			padding: 0 5px;
			white-space: wrap;
			overflow-y: auto;
			background: #f2f2f2;
			text-align: center;
			align-items: center;
			justify-content: center;

			&::-webkit-scrollbar {
				width: 2px;
				background: transparent;
			}

			&::-webkit-scrollbar-thumb {
				background: #e6b800;
				border-radius: 8px;
			}

			&::-webkit-scrollbar-track {
				background: transparent;
			}

			.cat-item {
				display: inline-flex;
				flex-direction: column;
				align-items: center;
				margin: 8px 4px;

				.cat-icon {
					width: 45px;
					height: 45px;
					margin-bottom: 2px;
				}

				.cat-new {
					color: #fff;
					background: #e6b800;
					border-radius: 8px;
					font-size: 10px;
					padding: 0 4px;
					margin-bottom: 2px;
				}

				.cat-name {
					font-size: 13px;
					color: #333;
				}

				&.active .cat-name {
					color: #1aad19;
					font-weight: bold;
				}
			}
		}

		.menuContent {
			display: flex;
			flex-direction: column;
			flex: 1;
			white-space: wrap;

			.banner-swiper {
				width: 70vw;
				// height: 130px;
				margin: 14px auto 0 auto;
				border-radius: 12px;
				overflow: hidden;

				.banner-img {
					width: 100%;
					height: 100%;
					object-fit: fill;
				}
			}

			.product-list {
				margin: 18px 12px 0 12px;

				.product-item {
					display: flex;
					background: #fff;
					border-radius: 5px;
					margin-bottom: 16px;
					overflow: hidden;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

					.prod-img {
						padding:10px 0 10px  10px;
						width: 80px;
						height: 80px;
						object-fit: cover;
						border-radius: 12px 0 0 12px;
					}

					.prod-info {
						flex: 1;
						display: flex;
						flex-direction: column;
						justify-content: space-between;
						padding: 10px 12px 10px 10px;

						.prod-title {
							display: flex;
							align-items: center;

							.prod-name {
								font-size: 16px;
								font-weight: 500;
								margin-right: 6px;
							}

							.prod-new {
								color: #fff;
								background: #e6b800;
								border-radius: 8px;
								font-size: 10px;
								padding: 0 4px;
							}
						}

						.prod-desc {
							color: #888;
							font-size: 13px;
							margin: 4px 0 8px 0;
						}

						.prod-bottom {
							display: flex;
							align-items: center;
							justify-content: space-between;

							.prod-price {
								color: #1aad19;
								font-size: 16px;
								font-weight: bold;
							}

							.add-btn {
								background: #1aad19;
								color: #fff;
								border-radius: 50%;
								width: 28px;
								height: 28px;
								line-height: 28px;
								text-align: center;
								font-size: 20px;
								border: none;
								padding: 0;
							}
						}
					}
				}
			}
		}

	}

}
</style>