<template>
  <view class="userInfo">
    <!-- 固定顶部区域 -->
    <view class="fixed-area">
      <view class="fixed-header" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
        <uni-icons type="left" size="30" class="back" @click="returnBack()"></uni-icons>
        <view class="orderTitle">收货地址</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content" :style="{ marginTop: safeAreaInsets.top + 60 + 'px' }">
      <!-- 地址信息展示 -->
	  <view class="addressNull" v-show="addressList.length===0">
		  <img src="/static/images/mine/newNullData.png" alt="" />
		  <view :style="{marginTop:'10px'}">请添加收货地址</view>
	  </view>
	  <view class="addressContent" v-show="addressList.length>0">
		<view class="contentList" v-for="item in addressList" :key="item.id">
			<view class="itemInfo">
				{{item.address}}
			</view>
		</view>
	  </view>
      <!-- tijiao 添加地址-->
      <view class="add">
        <view class="addInfo" @click="saveUserInfo">
          添加新地址
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang='ts'>
import { ref, onMounted, computed } from "vue";
import {
  getAddressList,
  addAddress,
  updateAddress,
  deleteAddress,
} from "@/utils/api/address-mock";
import type { addressList } from "@/utils/api/address-mock";
declare const uni: any;

const safeAreaInsets = (uni.getSystemInfoSync &&
  uni.getSystemInfoSync().safeAreaInsets) || { top: 0 };
const addressList=ref<addressList|null>(null)

const loadData = async () => {
  try {
    const [address] = await Promise.all([getAddressList()]);
    addressList.value = address;
    console.log(1111, addressList.value);
  } catch (error) {
    console.error("加载数据失败", error);
  }
};
async function saveUserInfo() {
  await updateMineUserInfo(userInfo.value);
  uni.showToast({ title: "保存成功", icon: "success" });
  uni.navigateBack({ delta: 1 });
}
const returnBack = () => {
  uni.navigateBack({ delta: 1 });
};
onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
.userInfo {
  height: 100vh;
  background-color: #f7f7f7;

  .fixed-area {
    // position: fixed;
    flex-shrink: 0; // 防止收缩

    .fixed-header {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      width: 100%;
      height: 50px;
      display: flex;
      align-items: center;
      // position: relative;
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

  .content {
    height: 100vh;

.addressNull{
	width: 100%;
	height: 500px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
}
.addressContent{
	width: 95%;
	height: 500px;
	display: flex;
	align-items: center;
	// justify-content: center;
	// background: white;
	flex-direction: column;
	.contentList{
		width:100%;
		padding: 5px 2px;
		margin-bottom: 10px;
		gap:10px;
		background-color:white;
		
	}
}
    .add {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 8%;
      display: flex;
      justify-content: center;
      .addInfo {
        display: flex;
        width: 97%;
        height: 85%;
        border: 1px solid $alittle-color;
        border-radius: 3px;

        color: $uni-text-color-green;
        justify-content: center;
        align-items: center;
        font-size: 20px;
      }
    }
  }
}
</style>