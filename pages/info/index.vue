<template>
  <view class="userInfo">
    <!-- 固定顶部区域 -->
    <view class="fixed-area">
      <view class="fixed-header" :style="{ paddingTop: safeAreaInsets.top + 'px' }">
        <uni-icons type="left" size="30" class="back" @click="returnBack()"></uni-icons>
        <view class="orderTitle">一点点</view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content" :style="{ marginTop: safeAreaInsets.top + 60 + 'px' }">
      <!-- 头像部分 -->
      <view class="avator">
        <view class="border-avatar">
          <image class="avatar" :src="userInfo.avatar" mode="aspectFill" />
        </view>
      </view>
      <!-- 资料部分 -->
      <view class="userInfomation">
        <span>我的资料</span>
        <view class="infoDetails">
          <view class="infoDetailsItem">
            <span class="itemLabel" style="margin-right: 20rpx">昵称</span>
            <input class="uni-input" v-model="userInfo.nickname" placeholder="请输入昵称" />
          </view>
          <view class="infoDetailsItem">
            <span class="itemLabel" style="margin-right: 20rpx">手机</span>
            <input class="uni-input" v-model="userInfo.phone" placeholder="请输入昵称" />
            <span class="editPhone">更换手机号</span>
          </view>
          <view class="infoDetailsItem">
            <span class="itemLabel" style="margin-right: 20rpx">生日</span>
            <!-- <input class="uni-input" type="number" placeholder="请输入昵称"/> -->
            <picker mode="date" :value="userInfo.birthday" @change="e => userInfo.birthday = e.detail.value">
              <!-- // <view class="uni-input">{{ date || "请选择日期" }}</view> -->
              <view class="uni-input">{{ userInfo.birthday || "请选择日期" }}</view>
            </picker>
            <span class="tips">填好后不可修改</span>
          </view>
          <view class="infoDetailsItem">
            <span class="itemLabel" style="margin-right: 20rpx">性别</span>
            <!-- <input class="uni-input" type="number" placeholder="请输入昵称" /> -->
            <picker mode="selector" :range="sex" @change="e=>userInfo.gender=e.detail.value" :value="userInfo.gender">
              <view>{{userInfo.gender||'请选择'}}</view>
            </picker>
          </view>
          <view class="infoDetailsItem">
            <span class="itemLabel" style="margin-right: 20rpx">城市</span>
            <!-- <input class="uni-input" type="number" placeholder="请输入昵称" /> -->
            <!-- <picker mode="region" :value="region" @change="onRegionChange">
              <view class="picker">
                {{regionText? regionText :'请选择地区'}}
              </view>
            </picker> -->
            <picker mode="region" :value="userInfo.region" @change="e => userInfo.region = e.detail.value">
              <view class="picker">{{ userInfo.region?.join(' ') || '请选择地区' }}</view>
            </picker>
          </view>
        </view>
      </view>
      <!-- 保存按钮 -->
      <view class="bottom-button">
        <view class="save" @click="saveUserInfo">
          保存信息
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang='ts'>
import { ref, onMounted, computed } from "vue";
import {
  getMineUserInfo,
  getMemberInfo,
  getMemberBenefits,
  getMineFunctions,
  updateMineUserInfo
} from "@/utils/api/mine";
import type {
  MineUserInfo,
  MemberInfo,
  MemberBenefit,
  MineFunction,
} from "@/utils/api/mine";
declare const uni: any;

const safeAreaInsets = (uni.getSystemInfoSync &&
  uni.getSystemInfoSync().safeAreaInsets) || { top: 0 };
const userInfo = ref<MineUserInfo | null>(null);
const date = ref<string>(""); // 修改为字符串类型以匹配日期显示
const regionArray = ref<any>([]);
const region = ref<string[]>([]);
const sex = ref(["男", "女"]);
const sexIndex = ref<any>();
// 添加处理日期选择的方法
const bindDateChange = (e: any) => {
  date.value = e.detail.value;
};
const regionText = computed(() =>
  Array.isArray(region.value) ? region.value.join(" ") : ""
);

const selectSex = (e: any) => {
  sexIndex.value = e.detail.value;
};
function onRegionChange(e: any) {
  region.value = e.detail.value;
}
const loadData = async () => {
  try {
    const [user] = await Promise.all([getMineUserInfo()]);
    userInfo.value = user;
    console.log(1111, userInfo.value);
  } catch (error) {
    console.error("加载数据失败", error);
  }
};
async function saveUserInfo() {
  await updateMineUserInfo(userInfo.value);
  uni.showToast({ title: "保存成功", icon: "success" });
  uni.navigateBack({delta: 1})
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

    .avator {
      margin: 15px 15px 0 15px;
      height: 20vh;
      background-color: white;
      border-radius: 15px;
      box-shadow: 3px 3px 5px #ececec, -3px -3px 5px #ececec;
      display: flex;
      text-align: center;
      justify-content: center;
      align-items: center;

      .border-avatar {
        width: 190rpx;
        height: 190rpx;
        border: 3rpx solid seagreen;
        display: flex;
        align-items: center;
        border-radius: 50%;

        .avatar {
          margin: 0 auto;
          width: 180rpx;
          height: 180rpx;
          border-radius: 50%;
          // border:4rpx solid green;
        }
      }
    }

    .userInfomation {
      margin: 15px 15px 0 15px;
      .infoDetails {
        margin: 10px 0;
        padding: 10px 18px;
        background-color: white;
        border-radius: 10px;
      }
      .infoDetailsItem {
        padding: 20px 10px;
        display: flex;
        align-items: center;
        // line-height: 35px;
        color: black;
        .itemLabel {
          font-size: 18px;
          margin-right: 20rpx;
        }
        .editPhone {
          flex: 1;
          border: 1px solid #1aad19;
          border-radius: 5px;
          color: #1aad19;
          padding: 5px 8px;
          text-align: center;
        }
        .tips {
          flex: 1;
          text-align: right;
        }
      }
      .infoDetailsItem:not(:last-child) {
        border-bottom: 1px solid gray;
      }
    }
    .bottom-button {
      position: fixed;
      bottom: 0;
      width: 100%;
      height: 8%;
      .save {
        display: flex;
        width: 99.5%;
        height: 95%;
        border: 1px solid #1aad19;
        border-radius: 38px;
        background-color: $alittle-color;
        color: white;
        justify-content: center;
        align-items: center;
        font-size: 20px;
      }
    }
  }
}
</style>