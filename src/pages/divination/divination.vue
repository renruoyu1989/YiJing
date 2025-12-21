<template>
  <view class="container">
    <view class="bg"></view>
    
    <view class="header">
      <view class="progress-bar">
        <view class="progress-inner" :style="{ width: (store.currentLines.length / 6) * 100 + '%' }"></view>
      </view>
      <text class="progress-text">第 {{ store.currentLines.length + (isTossing ? 1 : 0) }} 爻 / 共 6 爻</text>
    </view>

    <view class="coin-area">
      <view v-for="(coin, index) in localCoins" :key="index" 
            class="coin-wrapper" 
            :class="{ 'tossing': isTossing }">
        <view class="coin" :class="{ 'is-back': coin === 2 }">
          <image src="/static/coin_front.png" class="coin-face front" mode="aspectFit"></image>
          <image src="/static/coin_back.png" class="coin-face back" mode="aspectFit"></image>
        </view>
      </view>
    </view>

    <view class="hexagram-area">
      <view class="hexagram-lines">
        <view v-for="(line, index) in store.currentLines" :key="index" 
              class="line-item" 
              :class="[line.type, { 'is-new': index === store.currentLines.length - 1 }]">
          <view v-if="line.isYang" class="yang-line"></view>
          <view v-else class="yin-line">
            <view class="yin-part"></view>
            <view class="yin-part"></view>
          </view>
          <text v-if="line.isChanging" class="changing-mark">●</text>
        </view>
      </view>
    </view>

    <view class="footer">
      <button class="btn-shake" :disabled="isTossing || store.currentLines.length >= 6" @click="handleToss">
        <text class="btn-text">{{ store.currentLines.length >= 6 ? '即将解卦...' : '掷钱起爻' }}</text>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useIChingStore } from '@/store/iching';
import { tossCoins } from '@/utils/iching';

const store = useIChingStore();
const isTossing = ref(false);
const localCoins = ref([3, 2, 3]); // Initial visual state

const handleToss = async () => {
  if (isTossing.value || store.currentLines.length >= 6) return;

  isTossing.value = true;
  uni.vibrateShort({});

  // Artificial delay for animation
  setTimeout(() => {
    const result = tossCoins();
    localCoins.value = result.coins;
    
    setTimeout(() => {
      store.addLine(result);
      isTossing.value = false;

      if (store.currentLines.length === 6) {
        setTimeout(() => {
          uni.showLoading({ title: '诚心感悟...' });
          setTimeout(() => {
            uni.hideLoading();
            uni.navigateTo({ url: '/pages/result/result' });
          }, 1500);
        }, 800);
      }
    }, 1000); // Wait for coin animation to settle
  }, 100);
};
</script>

<style lang="scss" scoped>
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: $yx-color-paper;
  position: relative;
  overflow: hidden;
}

.bg {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background-image: url('@/static/bg_texture.png');
  background-size: cover;
  opacity: 0.5;
  z-index: 0;
}

.header {
  position: relative;
  z-index: 1;
  padding: 100rpx 40rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;

  .progress-bar {
    width: 300rpx;
    height: 6rpx;
    background-color: rgba($yx-color-light-ink, 0.2);
    border-radius: 3rpx;
    margin-bottom: 20rpx;
    overflow: hidden;

    .progress-inner {
      height: 100%;
      background-color: $yx-color-cinnabar;
      transition: width 0.3s ease;
    }
  }

  .progress-text {
    font-size: 24rpx;
    color: $yx-color-light-ink;
    letter-spacing: 2rpx;
  }
}

.coin-area {
  position: relative;
  z-index: 1;
  height: 300rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 40rpx;
  margin: 40rpx 0;
}

.coin-wrapper {
  perspective: 1000rpx;
  width: 140rpx;
  height: 140rpx;

  &.tossing {
    animation: toss-jump 1s ease-out-bounce;
    .coin {
      animation: toss-spin 1s linear;
    }
  }
}

@keyframes toss-jump {
  0% { transform: translateY(0) scale(1); }
  30% { transform: translateY(-150rpx) scale(1.2); }
  60% { transform: translateY(-200rpx) scale(1.3); }
  100% { transform: translateY(0) scale(1); }
}

@keyframes toss-spin {
  0% { transform: rotateX(0deg); }
  100% { transform: rotateX(1080deg); }
}

.coin {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &.is-back {
    transform: rotateX(180deg);
  }

  .coin-face {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    
    &.back {
      transform: rotateX(180deg);
    }
  }
}

.hexagram-area {
  flex: 1;
  display: flex;
  flex-direction: column-reverse; /* Lines grow from bottom */
  align-items: center;
  padding-bottom: 40rpx;
  position: relative;
  z-index: 1;
}

.hexagram-lines {
  display: flex;
  flex-direction: column-reverse; /* Bottom to top */
  gap: 24rpx;
  width: 400rpx;
}

.line-item {
  height: 24rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  &.is-new {
    animation: fadeIn 0.5s ease;
  }

  &.old-yin, &.old-yang {
    .yang-line, .yin-part {
      background-color: $yx-color-cinnabar;
    }
  }

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

  .changing-mark {
    position: absolute;
    right: -60rpx;
    font-size: 24rpx;
    color: $yx-color-cinnabar;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.footer {
  position: relative;
  z-index: 1;
  padding: 60rpx 0 100rpx;
  display: flex;
  justify-content: center;
}

.btn-shake {
  width: 400rpx;
  height: 100rpx;
  background-color: $yx-color-ink;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  box-shadow: 0 10rpx 20rpx rgba(0,0,0,0.1);

  &[disabled] {
    opacity: 0.6;
  }

  .btn-text {
    color: white;
    font-size: 32rpx;
    letter-spacing: 8rpx;
  }
}
</style>
