<template>
  <view class="container">
    <view class="bg"></view>
    
    <view class="content">
      <view class="header">
        <text class="title">易心</text>
        <view class="subtitle-wrap">
          <text class="subtitle">数 字 易 经</text>
        </view>
      </view>

      <view class="logo-box">
        <view class="taiji-logo">
          <view class="yang"></view>
          <view class="yin"></view>
        </view>
      </view>

      <view class="footer">
        <button class="btn-start" @click="handleStart">
          <text class="btn-text">诚心起卦</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useIChingStore } from '@/store/iching';

const store = useIChingStore();

const handleStart = () => {
  store.resetDivination();
  uni.navigateTo({
    url: '/pages/divination/divination'
  });
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  background-color: $yx-color-paper;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('@/static/bg_texture.png');
  background-size: cover;
  opacity: 0.6;
  z-index: 0;
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 100rpx 0;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 60rpx;

  .title {
    writing-mode: vertical-rl;
    font-size: 120rpx;
    font-family: "Songti SC", "Source Han Serif", serif;
    color: $yx-color-ink;
    letter-spacing: 20rpx;
    font-weight: 600;
  }

  .subtitle-wrap {
    margin-top: 40rpx;
    padding-top: 20rpx;
    border-top: 1px solid $yx-color-light-ink;
  }

  .subtitle {
    font-size: 28rpx;
    color: $yx-color-light-ink;
    letter-spacing: 10rpx;
  }
}

.logo-box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.taiji-logo {
  width: 300rpx;
  height: 300rpx;
  border-radius: 50%;
  position: relative;
  border: 4rpx solid $yx-color-ink;
  animation: rotate 15s linear infinite;
  overflow: hidden;

  .yang {
    width: 100%;
    height: 50%;
    background-color: $yx-color-ink;
    position: relative;
    border-radius: 150rpx 150rpx 0 0;
    
    &::after {
      content: '';
      position: absolute;
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
      background-color: $yx-color-paper;
      right: 0;
      bottom: -75rpx;
      z-index: 2;
    }
    
    &::before {
      content: '';
      position: absolute;
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      background-color: $yx-color-ink;
      right: 55rpx;
      bottom: -95rpx;
      z-index: 3;
    }
  }

  .yin {
    width: 100%;
    height: 50%;
    background-color: $yx-color-paper;
    position: relative;
    border-radius: 0 0 150rpx 150rpx;

    &::after {
      content: '';
      position: absolute;
      width: 150rpx;
      height: 150rpx;
      border-radius: 50%;
      background-color: $yx-color-ink;
      left: 0;
      top: -75rpx;
      z-index: 2;
    }

    &::before {
      content: '';
      position: absolute;
      width: 40rpx;
      height: 40rpx;
      border-radius: 50%;
      background-color: $yx-color-paper;
      left: 55rpx;
      top: -95rpx;
      z-index: 3;
    }
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.footer {
  display: flex;
  justify-content: center;
  margin-bottom: 100rpx;
}

.btn-start {
  width: 280rpx;
  height: 280rpx;
  border-radius: 50%;
  background-color: $yx-color-cinnabar;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10rpx 30rpx rgba($yx-color-cinnabar, 0.3);
  border: none;
  transition: transform 0.2s active;

  &:active {
    transform: scale(0.95);
  }

  .btn-text {
    color: white;
    font-size: 36rpx;
    font-family: "PingFang SC", sans-serif;
    letter-spacing: 4rpx;
  }
}
</style>
