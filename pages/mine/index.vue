<template>
    <view class="mine">
        <!-- 顶部背景图 -->
        <view class="mine-header">
            <image class="bg-image" src="/static/images/mine/beijing.jpg" mode="aspectFill" />
        </view>

        <!-- 内容区域包装器 -->
        <view class="content-wrapper">
            <!-- 用户信息区域 -->
            <view class="user-info" v-if="userInfo">
                <view class="user-info__main">
                    <image class="avatar" :src="userInfo.avatar" mode="aspectFill" @click="UserInfoDetails()" />
                    <view class="info">
                        <text class="nickname">{{ userInfo.nickname }}</text>
                        <text class="member-code">{{ userInfo.memberCode }}</text>
                    </view>
                </view>
                <view class="user-info__stats">
                    <view class="stat-item">
                        <text class="value">{{ userInfo.points }}</text>
                        <text class="label">积分</text>
                    </view>
                    <view class="stat-item">
                        <text class="value">{{ userInfo.coupons }}</text>
                        <text class="label">卡券</text>@
                    </view>
                </view>
            </view>

            <!-- 会员卡片 -->
            <view class="member-card" v-if="memberInfo">
                <view class="member-card__header">
                    <text class="level">当前等级</text>
                    <text class="level-name">{{ memberInfo.level }}</text>
                </view>
                <view class="member-card__body">
                    <text class="expire-date">有效期：{{ memberInfo.expireDate }}</text>
					<view class="growth" style="display: flex;justify-content: space-between;padding-top: 20rpx;">
						<text class="growth-text">成长值：{{ memberInfo.growth.current }}/{{ memberInfo.growth.total }}</text>
						<text class="next-level">还差{{ memberInfo.growth.total - memberInfo.growth.current }}成长值升级为{{
						    memberInfo.nextLevel }}</text>
					</view>
                    <!-- <view class="growth-bar">
                        <view class="progress"
                            :style="{ width: (memberInfo.growth.current / memberInfo.growth.total * 100) + '%' }">
                        </view>
                    </view> -->
					<view class="progress-box">
									<progress :percent="(memberInfo.growth.current / memberInfo.growth.total * 100)" 
									stroke-width="4" activeColor="#fff" backgroundColor="rgba(255, 255, 255, 0.3)"
									 active="true" border-radius="16rpx" />
					</view>
                </view>
            </view>

            <!-- 会员权益 -->
            <view class="member-benefits">
                <view class="section-title">会员权益</view>
                <view class="benefits-grid">
                    <view class="benefit-item" v-for="benefit in memberBenefits" :key="benefit.id"
                        @tap="navigateTo(benefit.link)">
                        <!-- <view class="icon" :class="benefit.icon"></view> -->
                        <image class="icon" :src="benefit.icon" mode="aspectFit" />
                        <text class="title">{{ benefit.title }}</text>
                    </view>
                </view>
            </view>

            <!-- 我的功能 -->
            <view class="mine-functions">
                <view class="section-title">我的功能</view>
                <view class="functions-grid">
                    <view class="function-item" v-for="func in mineFunctions" :key="func.id"
                        @tap="navigateTo(func.link)">
                        <!-- <view class="icon" :class="func.icon"></view> -->
                        <image class="icon" :src="func.icon" mode="aspectFit" />
                        <text class="title">{{ func.title }}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMineUserInfo, getMemberInfo, getMemberBenefits, getMineFunctions } from '@/utils/api/mine'
import type { MineUserInfo, MemberInfo, MemberBenefit, MineFunction } from '@/utils/api/mine'

// 响应式数据
const userInfo = ref<MineUserInfo | null>(null)
const memberInfo = ref<MemberInfo | null>(null)
const memberBenefits = ref<MemberBenefit[]>([])
const mineFunctions = ref<MineFunction[]>([])

// 加载数据
const loadData = async () => {
    try {
        const [user, member, benefits, functions] = await Promise.all([
            getMineUserInfo(),
            getMemberInfo(),
            getMemberBenefits(),
            getMineFunctions()
        ])

        userInfo.value = user
        memberInfo.value = member
        memberBenefits.value = benefits
        mineFunctions.value = functions
    } catch (error) {
        console.error('加载数据失败：', error)
    }
}

// 页面跳转
const navigateTo = (url: string) => {
    uni.navigateTo({
        url,
        fail: (err: UniApp.NavigateToFailCallback) => {
            console.error('页面跳转失败：', err)
            uni.showToast({
                title: '页面跳转失败',
                icon: 'none'
            })
        }
    })
}

const UserInfoDetails=()=>{
	
	navigateTo('/pages/info/index')
}
// 生命周期
onMounted(() => {
    loadData()
})
</script>

<style lang="scss" scoped>
.mine {
    min-height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;

    .mine-header {
        width: 100%;
        height: 460rpx;
        overflow: hidden;
        display: flex;
        flex-direction: column;

        .bg-image {
            width: 100%;
            flex: 1;
            object-fit: cover;
        }

        &::after {
            content: '';
            width: 100%;
            height: 120rpx;
            background: linear-gradient(180deg, rgba(245, 245, 245, 0) 0%, #f5f5f5 100%);
        }
    }

    .content-wrapper {
        flex: 1;
        margin-top: -180rpx; // 让内容区域上移，覆盖在背景上
        padding: 0 20rpx;
    }

    .user-info {
        display: flex;
        justify-content: space-between;
        background-color: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 16rpx;
        padding: 20rpx;
        margin-bottom: 20rpx;
        box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);

        &__main {
            display: flex;
            align-items: center;
            margin-bottom: 20rpx;

            .avatar {
                width: 120rpx;
                height: 120rpx;
                border-radius: 50%;
                margin-right: 20rpx;
            }

            .info {
                .nickname {
                    font-size: 36rpx;
                    font-weight: bold;
                    margin-bottom: 8rpx;
                    display: block;
                }

                .member-code {
                    font-size: 24rpx;
                    color: #999;
                }
            }
        }

        &__stats {
            display: flex;
            padding-top: 20rpx;
            gap: 20px;

            .stat-item {
                flex: 1;
                text-align: center;

                .value {
                    font-size: 32rpx;
                    font-weight: bold;
                    color: #333;
                    display: block;
                }

                .label {
                    font-size: 24rpx;
                    color: #999;
                }
            }
        }
    }

    .member-card {
        background-color: rgba(14, 158, 62, 0.75);
        border-radius: 16rpx;
        padding: 30rpx;
        color: #fff;
        margin-bottom: 20rpx;

        &__header {
            margin-bottom: 20rpx;

            .level {
                font-size: 24rpx;
                margin-bottom: 8rpx;
                display: block;
            }

            .level-name {
                font-size: 36rpx;
                font-weight: bold;
            }
        }

        &__body {
            .expire-date {
                font-size: 24rpx;
                margin-bottom: 20rpx;
                display: block;
            }

            .growth-bar {
                height: 8rpx;
                background-color: rgba(255, 255, 255, 0.3);
                border-radius: 4rpx;
                margin-bottom: 16rpx;

                .progress {
                    height: 100%;
                    background-color: #fff;
                    border-radius: 4rpx;
                    transition: width 0.3s;
                }
            }

            .growth-text {
                font-size: 24rpx;
                margin-bottom: 8rpx;
                display: block;
            }

            .next-level {
                font-size: 24rpx;
                opacity: 0.8;
            }
        }
    }

    .section-title {
        font-size: 32rpx;
        font-weight: bold;
        margin-bottom: 20rpx;
    }

    .member-benefits,
    .mine-functions {
        background-color: #ffffff;
        border-radius: 16rpx;
        padding: 30rpx;
        margin-bottom: 20rpx;

        .benefits-grid,
        .functions-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20rpx;

            .benefit-item,
            .function-item {
                display: flex;
                flex-direction: column;
                align-items: center;

                .icon {
                    width: 80rpx;
                    height: 80rpx;
                    margin-bottom: 12rpx;
                    background-size: contain;
                    background-repeat: no-repeat;
                    background-position: center;
                    // background-color: #f5f5f5; // 临时占位背景色
                }

                .title {
                    font-size: 24rpx;
                    color: #333;
                }
            }
        }
    }
}
</style>