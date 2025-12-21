<template>
  <view class="page">
    <view class="center">
      <view class="taiji">
        <view class="taiji__dot taiji__dot--top" />
        <view class="taiji__dot taiji__dot--bottom" />
      </view>
    </view>

    <view class="bottom">
      <nut-button type="primary" block @click="goDivination">诚心起卦</nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'

function goDivination() {
  Taro.navigateTo({ url: '/pages/divination/index' })
}
</script>

<style lang="scss">
@use "@/styles/tokens.scss" as *;

.page {
  min-height: 100vh;
  background: $bg-color;
  padding: 24px 20px 110px;
  box-sizing: border-box;
}

.center {
  min-height: calc(100vh - 110px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.taiji {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background: linear-gradient(180deg, #111111 0% 50%, #ffffff 50% 100%);
  animation: spin 12s linear infinite;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
}

.taiji::before,
.taiji::after {
  content: "";
  position: absolute;
  left: 50%;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  transform: translateX(-50%);
}

.taiji::before {
  top: 0;
  background: #111111;
}

.taiji::after {
  bottom: 0;
  background: #ffffff;
}

.taiji__dot {
  position: absolute;
  left: 50%;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  transform: translateX(-50%);
}

.taiji__dot--top {
  top: 42px;
  background: #ffffff;
}

.taiji__dot--bottom {
  bottom: 42px;
  background: #111111;
}

.bottom {
  position: fixed;
  left: 20px;
  right: 20px;
  bottom: 26px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
