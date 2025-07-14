<template>
    <view class="swiper-banner">
        <swiper class="swiper" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500" :circular="true"
            indicator-active-color="#007f61" indicator-color="rgba(255, 255, 255, 0.6)">
            <swiper-item v-for="(item, index) in bannerList" :key="index" @tap="onBannerClick(item)">
                <image :src="item.imageUrl" mode="aspectFill" class="banner-image" />
            </swiper-item>
        </swiper>
    </view>
</template>

<script setup lang="ts">
interface BannerItem {
    id: number | string
    imageUrl: string
    link?: string
}

const props = withDefaults(defineProps<{
    bannerList: BannerItem[]
}>(), {
    bannerList: () => []
})

// 点击轮播图
const onBannerClick = (item: BannerItem) => {
    if (item.link) {
        uni.navigateTo({
            url: item.link
        })
    }
}
</script>

<style lang="scss" scoped>
.swiper-banner {
    width: 100%;
    border-radius: 16rpx;
    overflow: hidden;
    aspect-ratio: 1.3/1;

    .swiper {
        width: 100%;
        height: 100%;
    }

    .banner-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>