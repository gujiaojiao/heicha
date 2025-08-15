<template>
	<view class="menu-list" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
		<!-- 顶部搜索 -->
		<view class="selectMenu">
			<view class="backToHome" @click="backToHome">
				<uni-icons type="home" size="30"></uni-icons>
			</view>
			<!-- 搜索栏 -->
			<view class="search-bar">
				<uni-icons type="search" size="18" />
				<input class="search-input" placeholder="搜索" disabled />
			</view>
		</view>
		<view class="main-content" :style="{ marginTop: 60 + 'px' }">
			<!-- 门店信息 -->
			<view class="store-bar">
				<view class="left">
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
				<view class="category-bar">
					<view v-for="cat in categories" :key="cat.id"
						:class="['cat-item', cat.id === activeCategory ? 'active' : '']"
						@click="selectCategory(cat.id)">
						<image v-if="cat.icon && cat.icon !== 'NEW'" :src="cat.icon" class="cat-icon" />
						<text v-else-if="cat.icon === 'NEW'" class="cat-new">NEW</text>
						<text class="cat-name">{{ cat.name }}</text>
					</view>
				</view>

				<view class="menuContent">
					<scroll-view scroll-y="true" class="content-scroll" @scroll="onProductScroll"
						:scroll-into-view="scrollIntoView" :scroll-with-animation="true">
						<!-- banner -->
						<view class="banner-swiper">
							<swiper-banner :banner-list="banners" />
						</view>

						<!-- 商品列表 -->
						<view class="product-list">
							<view v-for="categoryGroup in groupedProducts" :key="categoryGroup.categoryId"
								:class="['category-section', `category-${categoryGroup.categoryId}`]"
								:id="`category-${categoryGroup.categoryId}`">
								<!-- 分类标题 -->
								<view class="category-title">
									<text class="category-name">{{ categoryGroup.categoryName }}</text>
								</view>
								<!-- 该分类下的商品 -->
								<view v-for="prod in categoryGroup.products" :key="prod.id" class="product-item">
									<image :src="prod.imageUrl" class="prod-img" mode="aspectFill" />
									<view class="prod-info">
										<view class="prod-title">
											<text class="prod-name">{{ prod.name }}</text>
											<text v-if="prod.isNew" class="prod-new">NEW</text>
										</view>
										<view class="prod-bottom">
											<text class="prod-price">￥{{ prod.price.toFixed(2) }}</text>
											<button class="add-btn" size="mini">+</button>
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import type { Ref } from 'vue'
import { getMenuCategories, getMenuProducts } from '@/utils/api/menu-mock'
import { getMockBanners } from '@/utils/api/mock'
import SwiperBanner from '@/components/swiper-banner/index.vue'

// 声明uni全局变量
declare const uni: any

const safeAreaInsets = (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets) || { top: 0 }
const categories: Ref<any[]> = ref([])
const products: Ref<any[]> = ref([])
const banners: Ref<any[]> = ref([])
const activeCategory = ref(1)
const scrollTimer = ref<any>(null)
const scrollIntoView = ref<string>('')

// 按分类分组的商品
const groupedProducts = computed(() => {
	const groups: any[] = []

	categories.value.forEach((cat: any) => {
		const categoryProducts = products.value.filter((p: any) => p.categoryId === cat.id)
		if (categoryProducts.length > 0) {
			groups.push({
				categoryId: cat.id,
				categoryName: cat.name,
				products: categoryProducts
			})
		}
	})

	return groups
})

// 选择分类时滚动到对应位置
function selectCategory(id: number) {
	activeCategory.value = id
	// 使用nextTick确保DOM更新后再滚动
	nextTick(() => {
		// 在微信小程序中，使用scroll-into-view来控制scroll-view的滚动
		const targetId = `category-${id}`
		scrollIntoView.value = targetId
		// 延迟清除，确保滚动生效
		setTimeout(() => {
			scrollIntoView.value = ''
		}, 500)
	})
}

// 商品列表滚动时更新当前激活的分类
function onProductScroll(e: any) {
	const scrollTop = e.detail.scrollTop

	// 使用节流来优化性能
	if (scrollTimer.value) {
		clearTimeout(scrollTimer.value)
	}

	scrollTimer.value = setTimeout(() => {
		// 使用更简单的方法：基于滚动位置计算当前分类
		const categorySections = groupedProducts.value
		let currentCategory = 1

		// 计算每个分类的大概位置（基于商品数量）
		let accumulatedHeight = 0
		const bannerHeight = 200 // banner大概高度
		const categoryTitleHeight = 60 // 分类标题高度
		const productItemHeight = 120 // 每个商品项高度

		accumulatedHeight += bannerHeight

		for (let i = 0; i < categorySections.length; i++) {
			const section = categorySections[i]
			const sectionHeight = categoryTitleHeight + (section.products.length * productItemHeight)

			if (scrollTop >= accumulatedHeight && scrollTop < accumulatedHeight + sectionHeight) {
				currentCategory = section.categoryId
				break
			}

			accumulatedHeight += sectionHeight
		}

		// 更新激活的分类
		if (currentCategory !== activeCategory.value) {
			activeCategory.value = currentCategory
		}
	}, 100) // 100ms的节流延迟，减少性能消耗
}

function backToHome() {
	uni.switchTab({ url: '/pages/index/index' })
}

onMounted(async () => {
	categories.value = await getMenuCategories()
	products.value = await getMenuProducts()
	banners.value = await getMockBanners()

	// 清理定时器
	return () => {
		if (scrollTimer.value) {
			clearTimeout(scrollTimer.value)
		}
	}
})
</script>
<style lang="scss" scoped>
.menu-list {
	background: white;
	height: 100vh;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;

	.selectMenu {
		position: fixed;
		width: 100%;
		z-index: 100;
		height: 50px;
		background-color: white;

		.backToHome {
			position: absolute;
			left: 15rpx;
			top: 50%;
			transform: translateY(-50%);
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
			top: 50%;
			transform: translate(-50%, -50%);

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
		justify-content: space-between;
		align-items: center;
		padding: 12px 16px 8px 16px;
		background: #fff;
		height: 40px;
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
		height: calc(100vh - 110px);
		background-color: white;

		.category-bar {
			width: 20%;
			height: 100%;
			padding: 12px 0 0 0;
			background: #f2f2f2;
			text-align: center;
			overflow-y: auto;
			position: relative;

			&::-webkit-scrollbar {
				width: 2px;
				background: transparent;
			}

			&::-webkit-scrollbar-thumb {
				// background: #e6b800;
				border-radius: 8px;
			}

			&::-webkit-scrollbar-track {
				background: transparent;
			}

			.cat-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin: 0;
				padding: 12px 8px;
				cursor: pointer;
				position: relative;
				width: 100%;
				box-sizing: border-box;
				transition: all 0.3s ease;

				.cat-icon {
					width: 45px;
					height: 45px;
					margin-bottom: 8px;
				}

				.cat-new {
					color: #fff;
					background: #e6b800;
					border-radius: 8px;
					font-size: 10px;
					padding: 2px 6px;
					margin-bottom: 8px;
				}

				.cat-name {
					font-size: 13px;
					color: #333;
					line-height: 1.2;
				}

				&.active {
					background-color: #fff;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
					// border-radius: 0 20px 20px 0;
					margin-right: -8px;
					position: relative;
					z-index: 10;

					&::before {
						content: '';
						position: absolute;
						left: 0;
						top: 0;
						width: 5px;
						height: 100%;
						background: $uni-text-color-green;
						border-radius: 0 2px 2px 0;
					}

					.cat-name {
						color: $uni-text-color-green;
						font-weight: bold;
					}
				}

				&:hover:not(.active) {
					background-color: rgba(255, 255, 255, 0.3);
				}
			}
		}

		.menuContent {
			flex: 1;
			display: flex;
			flex-direction: column;
			height: 100%;
			overflow: hidden;

			.content-scroll {
				flex: 1;
				height: 0;
			}

			.banner-swiper {
				width: 70vw;
				margin: 14px auto 0 auto;
				border-radius: 12px;
				overflow: hidden;
				flex-shrink: 0;

				.banner-img {
					width: 100%;
					height: 100%;
					object-fit: fill;
				}
			}

			.product-list {
				margin: 18px 12px 0 12px;

				.category-section {
					margin-bottom: 20px;

					.category-title {
						background: #f8f8f8;
						padding: 12px 16px;
						margin-bottom: 12px;
						border-radius: 8px;
						border-left: 4px solid $uni-text-color-green;

						.category-name {
							font-size: 16px;
							font-weight: bold;
							color: #333;
						}
					}
				}

				.product-item {
					display: flex;
					background: #fff;
					border-radius: 5px;
					margin-bottom: 16px;
					overflow: hidden;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

					.prod-img {
						padding: 10px 0 10px 10px;
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