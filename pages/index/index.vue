<template>
  <view class="index">
    <!-- 顶部轮播图区域 -->
    <view class="banner-wrapper">
      <swiper-banner :banner-list="bannerList" />
    </view>

    <!-- 用户信息区域 -->
    <view class="user-info" v-if="userInfo">
      <view class="user-info__left">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill" />
        <view class="info">
          <text class="nickname">{{ userInfo.nickname }}</text>
          <view class="vip-tag" v-if="userInfo.isVip">黄金点门人</view>
        </view>
      </view>
      <view class="user-info__right">
        <view class="coupon-entry" @tap="navigateToCoupon">
          {{ userInfo.couponCount }}张优惠券 &gt;
        </view>
      </view>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-entries">
      <view class="entry-item" v-for="entry in quickEntries" :key="entry.id" @tap="navigateTo(entry.link)">
        <view class="icon" :class="entry.icon">
          <view class="content">
            <text class="title">{{ entry.title }}</text>
            <text class="subtitle">{{ entry.subtitle }}</text>
          </view>
        </view>

      </view>
    </view>

    <!-- 工具栏 -->
    <view class="tool-entries">
      <view class="tool-item" v-for="tool in toolEntries" :key="tool.id" @tap="navigateTo(tool.link)">
        <view class="icon" :class="tool.icon"></view>
        <text class="title">{{ tool.title }}</text>
      </view>
    </view>

    <!-- 活动加盟 -->
    <view class="activity-entry" v-if="activityEntry">
      <view class="activity-left">
        <view class="activity-item">
          <image class="activity-bg" :src="activityEntry.publicBenefit.imageUrl" mode="aspectFill" />
          <view class="activity-content">
            <text class="activity-title">{{ activityEntry.publicBenefit.title }}</text>
            <text class="activity-subtitle">{{ activityEntry.publicBenefit.subtitle }}</text>
          </view>
        </view>
      </view>
      <view class="activity-right">
        <view class="activity-item">
          <image class="activity-bg" :src="activityEntry.inviteGift.imageUrl" mode="aspectFill" />
          <view class="activity-content">
            <text class="activity-title">{{ activityEntry.inviteGift.title }}</text>
            <text class="activity-subtitle">{{ activityEntry.inviteGift.subtitle }}</text>
          </view>
        </view>
        <view class="activity-item">
          <image class="activity-bg" :src="activityEntry.entry.imageUrl" mode="aspectFill" />
          <view class="activity-content">
            <text class="activity-title">{{ activityEntry.entry.title }}</text>
            <text class="activity-subtitle">{{ activityEntry.entry.subtitle }}</text>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import SwiperBanner from "@/components/swiper-banner/index.vue";
import {
  getMockBanners,
  getMockUserInfo,
  getQuickEntries,
  getToolEntries,
  getActivityEntry,
} from "@/utils/api/mock";
import type {
  Banner,
  UserInfo,
  QuickEntry,
  ToolEntry,
  ActivityEntry,
} from "@/utils/api/mock";

// 响应式数据
const bannerList = ref<Banner[]>([]);
const userInfo = ref<UserInfo | null>(null);
const quickEntries = ref<QuickEntry[]>([]);
const toolEntries = ref<ToolEntry[]>([]);
const activityEntry = ref<ActivityEntry | null>(null);

// 加载数据
const loadData = async () => {
  try {
    const [banners, user, entries, tools, activity] = await Promise.all([
      getMockBanners(),
      getMockUserInfo(),
      getQuickEntries(),
      getToolEntries(),
      getActivityEntry(),
    ]);

    bannerList.value = banners;
    userInfo.value = user;
    quickEntries.value = entries;
    toolEntries.value = tools;
    activityEntry.value = activity;
  } catch (error) {
    console.error("加载数据失败：", error);
  }
};

// 页面跳转
const navigateTo = (url: string) => {
  // 判断是否是 tabBar 页面
  const tabBarPages = [
    "/pages/index/index",
    "/pages/menu/index",
    "/pages/order/index",
    "/pages/mine/index",
  ];

  if (tabBarPages.includes(url)) {
    uni.navigateTo({
      url,
      fail: (err) => {
        console.error("页面跳转失败：", err);
        uni.showToast({
          title: "页面跳转失败",
          icon: "none",
        });
      },
    });
  } else {
    uni.navigateTo({
      url,
      fail: (err) => {
        console.error("页面跳转失败：", err);
        uni.showToast({
          title: "页面跳转失败",
          icon: "none",
        });
      },
    });
  }
};

const navigateToCoupon = () => {
  navigateTo("/pages/coupon/index");
};

// 生命周期
onMounted(() => {
  loadData();
});
</script>

<style lang="scss" scoped>
.index {
  min-height: 100vh;
  background-color: #f5f5f5;

  .banner-wrapper {
    margin-bottom: 20rpx;
  }

  .user-info {
    margin: 20rpx;
    padding: 20rpx;
    height: 120rpx;
    background-color: #ffffff;
    border-radius: 16rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &__left {
      display: flex;
      align-items: center;

      .avatar {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
        margin-right: 20rpx;
      }

      .info {
        .nickname {
          font-size: 32rpx;
          font-weight: bold;
          margin-bottom: 8rpx;
        }

        .vip-tag {
          display: inline-block;
          font-size: 24rpx;
          color: #c1a05e;
          background-color: #fdf6e5;
          padding: 4rpx 12rpx;
          border-radius: 8rpx;
        }
      }
    }

    &__right {
      .coupon-entry {
        color: #07c160;
        font-size: 28rpx;
        padding: 12rpx 24rpx;
        background-color: #f0fff0;
        border-radius: 30rpx;
      }
    }
  }

  .quick-entries {
    margin: 20rpx;
    display: flex;
    gap: 20rpx;

    .entry-item {
      flex: 1;
      background-color: #ffffff;
      border-radius: 16rpx;
      padding: 15rpx 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-align: center;

      .icon {
        width: 275rpx;
        height: 275rpx;
        margin-right: 20rpx;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        display: flex;
        justify-content: center;
        align-items: flex-end;

        &.drink {
          background-image: url("/static/images/index/drink.png");
        }

        &.scooter {
          background-image: url("/static/images/index/scooter.png");
        }

        .content {
          margin-bottom: 5px;

          .title {
            font-size: 32rpx;
            font-weight: bold;
            margin-bottom: 8rpx;
            display: block;
          }

          .subtitle {
            font-size: 24rpx;
            color: #999;
            display: block;
          }
        }
      }
    }
  }

  .tool-entries {
    margin: 20rpx;
    background-color: #ffffff;
    border-radius: 16rpx;
    padding: 30rpx;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20rpx;

    .tool-item {
      display: flex;
      flex-direction: column;
      align-items: center;

      .icon {
        width: 60rpx;
        height: 60rpx;
        margin-bottom: 12rpx;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;

        &.gift {
          background-image: url("/static/images/index/joinAssociation.png");
        }

        &.coupon {
          background-image: url("/static/images/index/linquancenter.png");
        }

        &.shop {
          background-image: url("/static/images/index/pointsMall.png");
        }

        &.group {
          background-image: url("/static/images/index/groupBuying.png");
        }
      }

      .title {
        font-size: 24rpx;
        color: #333;
      }
    }
  }

  .activity-entry {
    width: calc(100% - 40rpx);
    margin: 20rpx;
    display: flex;
    flex-direction: row;
    gap: 20rpx;
    aspect-ratio: 2 / 1;

    .activity-left {
      flex: 1;
      height: 100%;

      .activity-item {
        height: 100%;
        position: relative;
        border-radius: 16rpx;
        overflow: hidden;

        .activity-bg {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .activity-content {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transform: translateY(-30%);

          .activity-title {
            font-size: 32rpx;
            font-weight: bold;
            color: $uni-text-color-green;
            margin-bottom: 8rpx;
          }

          .activity-subtitle {
            font-size: 24rpx;
            color: rgba(112, 190, 132, 0.9);
          }
        }
      }
    }

    .activity-right {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 20rpx;

      .activity-item {
        flex: 1;
        position: relative;
        border-radius: 16rpx;
        overflow: hidden;

        .activity-bg {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .activity-content {
          position: relative;
          z-index: 1;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transform: translateX(-20%);

          .activity-title {
            font-size: 32rpx;
            font-weight: bold;
            color: $uni-text-color-green;
            margin-bottom: 8rpx;
          }

          .activity-subtitle {
            font-size: 24rpx;
            color: rgba(112, 190, 132, 0.9);
          }
        }
      }
    }
  }
}
</style>
