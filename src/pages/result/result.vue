<template>
  <view class="container">
    <view class="bg"></view>
    
    <scroll-view scroll-y class="scroll-content">
      <view class="result-card">
        <view class="hexagram-display">
          <view class="lines-container">
            <view v-for="(line, index) in store.currentLines" :key="index" 
                  class="line-item" 
                  :class="[line.type]">
              <view v-if="line.isYang" class="yang-line"></view>
              <view v-else class="yin-line">
                <view class="yin-part"></view>
                <view class="yin-part"></view>
              </view>
            </view>
          </view>
        </view>

        <view class="name-box">
          <text class="hex-name">{{ currentHex?.name || '未知卦象' }}</text>
          <view class="stamp" v-if="currentHex">占</view>
        </view>

        <view class="divider"></view>

        <view class="section">
          <view class="section-title">
            <text class="title-text">卦辞</text>
          </view>
          <text class="content-text">{{ currentHex?.description }}</text>
        </view>

        <view class="section" v-if="mutatedLines.length > 0">
          <view class="section-title">
            <text class="title-text">变爻</text>
          </view>
          <view v-for="idx in mutatedLines" :key="idx" class="mutation-item">
            <text class="line-idx">第{{ idx }}爻：</text>
            <text class="content-text">{{ currentHex?.lines[idx] }}</text>
          </view>
        </view>

        <view class="section" v-if="currentHex?.interpretation">
          <view class="section-title">
            <text class="title-text">解说</text>
          </view>
          <text class="content-text interpretation">{{ currentHex.interpretation }}</text>
        </view>
      </view>

      <view class="buttons">
        <button class="btn-home" @click="goHome">返回首页</button>
      </view>
      
      <view class="spacer"></view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useIChingStore } from '@/store/iching';

const store = useIChingStore();

const currentHex = computed(() => store.currentHexagram);
const mutatedLines = computed(() => store.mutatedLinesIndices);

const goHome = () => {
  uni.reLaunch({
    url: '/pages/index/index'
  });
};
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  background-color: $yx-color-paper;
  position: relative;
}

.bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: url('@/static/bg_texture.png');
  background-size: cover;
  opacity: 0.5;
  z-index: 0;
}

.scroll-content {
  position: relative;
  z-index: 1;
  height: 100%;
}

.result-card {
  margin: 120rpx 40rpx 40rpx;
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(5px);
  border: 1px solid rgba($yx-color-light-ink, 0.1);
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hexagram-display {
  width: 200rpx;
  margin-bottom: 60rpx;
  
  .lines-container {
    display: flex;
    flex-direction: column-reverse; /* Bottom up */
    gap: 16rpx;
  }

  .line-item {
    height: 12rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    .yang-line {
      width: 100%;
      height: 100%;
      background-color: $yx-color-ink;
    }

    .yin-line {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-between;

      .yin-part {
        width: 42%;
        height: 100%;
        background-color: $yx-color-ink;
      }
    }
    
    &.old-yin, &.old-yang {
      .yang-line, .yin-part {
        background-color: $yx-color-cinnabar;
      }
    }
  }
}

.name-box {
  position: relative;
  margin-bottom: 40rpx;
  
  .hex-name {
    font-size: 64rpx;
    font-family: "Songti SC", serif;
    font-weight: bold;
    color: $yx-color-ink;
    letter-spacing: 10rpx;
  }

  .stamp {
    position: absolute;
    right: -60rpx;
    top: 10rpx;
    width: 50rpx;
    height: 50rpx;
    border: 3rpx solid $yx-color-cinnabar;
    color: $yx-color-cinnabar;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    transform: rotate(15deg);
    border-radius: 4rpx;
    font-weight: bold;
  }
}

.divider {
  width: 100rpx;
  height: 2rpx;
  background-color: $yx-color-cinnabar;
  margin-bottom: 60rpx;
}

.section {
  width: 100%;
  margin-bottom: 50rpx;

  .section-title {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    &::before {
      content: '';
      width: 8rpx;
      height: 30rpx;
      background-color: $yx-color-cinnabar;
      margin-right: 16rpx;
    }

    .title-text {
      font-size: 32rpx;
      font-weight: bold;
      color: $yx-color-ink;
    }
  }

  .content-text {
    font-size: 30rpx;
    line-height: 1.8;
    color: #444;
    text-align: justify;
    display: block;
    
    &.interpretation {
      font-style: italic;
      color: $yx-color-light-ink;
    }
  }

  .mutation-item {
    margin-bottom: 20rpx;
    padding: 20rpx;
    background-color: rgba($yx-color-cinnabar, 0.05);
    border-radius: 10rpx;
    
    .line-idx {
      font-weight: bold;
      color: $yx-color-cinnabar;
      margin-bottom: 10rpx;
      display: block;
    }
  }
}

.buttons {
  padding: 40rpx;
}

.btn-home {
  background-color: transparent;
  border: 1px solid $yx-color-ink;
  color: $yx-color-ink;
  border-radius: 50rpx;
  font-size: 28rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spacer {
  height: 100rpx;
}
</style>
