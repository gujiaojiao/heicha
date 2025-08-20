<template>
    <view>
        <!-- 购物车预览 -->
        <CartPreview @open-detail="openCartDetail" />

        <!-- 购物车详情 -->
        <CartDetail :visible="cartDetailVisible" @close="closeCartDetail" />
    </view>
</template>

<script setup>
import { ref } from 'vue'
import CartPreview from './cart-preview.vue'
import CartDetail from './cart-detail.vue'

// 购物车详情显示状态
const cartDetailVisible = ref(false)

// 方法
function openCartDetail() {
    cartDetailVisible.value = true
}

function closeCartDetail() {
    cartDetailVisible.value = false
}
</script>