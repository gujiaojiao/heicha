<template>
    <view class="menu">
        <text>点餐页面</text>
        <cart-preview />
    </view>
</template>

<script setup lang="ts">
import CartPreview from '@/components/cart-preview/cart-preview.vue'
</script>

<style lang="scss" scoped>
.menu {
    padding: 20rpx;
}
</style>