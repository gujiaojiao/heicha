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
											<view class="add-btn" size="mini" @click="openOrderDrawer(prod)">+</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>

		<!-- 点单抽屉 -->
		<OrderDrawer v-if="orderDrawerVisible" :visible="orderDrawerVisible" :product-info="currentProduct"
			@close="closeOrderDrawer" @confirm="confirmOrder" />

		<!-- 购物车组件 -->
		<CartPreview @open-detail="openCartDetail" />

		<!-- 购物车详情 -->
		<CartDetail :visible="cartDetailVisible" @close="closeCartDetail" />
	</view>
</template>
<script setup lang="ts">
// @ts-nocheck
import { ref, computed, onMounted, nextTick } from 'vue'
import type { Ref } from 'vue'
import { getMenuCategories, getMenuProducts } from '@/utils/api/menu-mock'
import { getMockBanners } from '@/utils/api/mock'
import SwiperBanner from '@/components/swiper-banner/index.vue'
import OrderDrawer from '@/components/order-drawer/index.vue'
import CartPreview from '@/components/cart-preview/index.vue'
import CartDetail from '@/components/cart-preview/cart-detail.vue'
import { useCartStore } from '@/store/cart'

// 声明uni全局变量
declare const uni: any

const safeAreaInsets = (uni.getSystemInfoSync && uni.getSystemInfoSync().safeAreaInsets) || { top: 0 }
const categories: Ref<any[]> = ref([])
const products: Ref<any[]> = ref([])
const banners: Ref<any[]> = ref([])
const activeCategory = ref(1)
const scrollTimer = ref<any>(null)
const scrollIntoView = ref<string>('')

// 点单抽屉相关状态
const orderDrawerVisible = ref(false)
const currentProduct = ref<any>(null)

// 购物车详情相关状态
const cartDetailVisible = ref(false)

// 购物车store
const cartStore = useCartStore()

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

// 打开点单抽屉
function openOrderDrawer(product: any) {
	currentProduct.value = {
		id: product.id,
		name: product.name,
		imageUrl: product.imageUrl,
		basePrice: product.price
	}
	orderDrawerVisible.value = true
}

// 关闭点单抽屉
function closeOrderDrawer() {

	orderDrawerVisible.value = false
	currentProduct.value = null
}

// 打开购物车详情
function openCartDetail() {
	cartDetailVisible.value = true
}

// 关闭购物车详情
function closeCartDetail() {
	cartDetailVisible.value = false
}

// 确认点单
function confirmOrder(orderData: any) {
	console.log('点单确认:', orderData)

	// 构建购物车商品项
	const cartItem = {
		id: `${orderData.productId}_${Date.now()}`, // 生成唯一ID
		name: orderData.productName,
		price: orderData.totalPrice,
		// image: currentProduct.value.imageUrl,
		// image:orderData.imageUrl,
		count: orderData.quantity,
		attrs: [
			`${getCupLabel(orderData.cup)}`,
			`${getIceLabel(orderData.ice)}`,
			`${getSugarLabel(orderData.sugar)}`,
			...getToppingLabels(orderData.freeToppings, orderData.paidToppings)
		]
	}

	// 添加到购物车
	cartStore.addToCart(cartItem)

	// 显示成功提示
	uni.showToast({
		title: '已添加到购物车',
		icon: 'success'
	})
	orderDrawerVisible.value = false
	currentProduct.value = null
}

// 辅助函数：获取杯型标签
function getCupLabel(cup: string): string {
	const cupMap: { [key: string]: string } = {
		'large': '大杯',
		'medium': '中杯'
	}
	return cupMap[cup] || '中杯'
}

// 辅助函数：获取冰度标签
function getIceLabel(ice: string): string {
	const iceMap: { [key: string]: string } = {
		'standard': '标准冰',
		'less': '少冰',
		'none': '去冰',
		'room': '常温',
		'warm': '温',
		'hot': '热饮'
	}
	return iceMap[ice] || '标准冰'
}

// 辅助函数：获取糖度标签
function getSugarLabel(sugar: string): string {
	const sugarMap: { [key: string]: string } = {
		'three': '三分糖',
		'five': '五分糖',
		'seven': '七分糖',
		'none': '不另外加糖',
		'full': '全糖'
	}
	return sugarMap[sugar] || '七分糖'
}

// 辅助函数：获取配料标签
function getToppingLabels(freeToppings: number[], paidToppings: number[]): string[] {
	const labels: string[] = []

	// 免费配料
	const freeToppingMap: { [key: number]: string } = {
		1: '小珍珠',
		2: '波霸',
		3: '椰果',
		4: '仙草',
		5: '茶冻',
		6: '椰奶冻',
		7: '栀子冻'
	}

	freeToppings.forEach(id => {
		if (freeToppingMap[id]) {
			labels.push(freeToppingMap[id])
		}
	})

	// 加价配料
	const paidToppingMap: { [key: number]: string } = {
		2: '西米',
		3: '单颗布丁',
		4: '冰淇淋',
		5: '奶霜',
		6: '奶霜(分装)'
	}

	paidToppings.forEach(id => {
		if (paidToppingMap[id]) {
			labels.push(paidToppingMap[id])
		}
	})

	return labels
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
		flex-direction: row;

		.category-bar {
			width: 20%;
			min-height: 100%;
			padding: 12px 0 0 0;
			background: #f2f2f2;
			text-align: center;
			overflow-y: auto;
			position: relative;
			// padding-bottom: 90px;

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
			overflow: hidden;
			background-color: white;
			// min-height: 100vh;
			// padding-bottom: 60px;

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
								background: #007f61;
								color: #fff;
								border-radius: 50%;
								width: 25px;
								height: 25px;
								line-height: 24px;
								text-align: center;
								align-items: center;
								font-size: 24px;
								border: none;
								// padding: 0;
							}
						}
					}
				}
			}
		}
	}
}
</style>