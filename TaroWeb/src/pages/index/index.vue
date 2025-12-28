<template>
  <view class="page" :style="{ paddingTop: headerPadding }">
    <view class="center">
      <view class="taiji-wrapper">
        <view class="taiji">
          <view class="taiji__dot taiji__dot--top" />
          <view class="taiji__dot taiji__dot--bottom" />
        </view>
        <view class="taiji__text">易心</view>
      </view>
    </view>

    <view class="bottom">
      <nut-button type="primary" block @click="openTopicSelect">诚心起卦</nut-button>
    </view>

    <view v-if="showTopicSelect" class="overlay" @tap="closeTopicSelect">
      <view class="sheet" @tap.stop>
        <view class="sheet__title">请选择求问方向</view>
        <view class="sheet__sub">诚心诚意，一事一测</view>
        <view class="topic-grid">
          <view v-for="t in topics" :key="t" class="topic-btn">
            <nut-button 
              size="normal" 
              block 
              :type="t === selectedTopic ? 'primary' : 'default'" 
              @click="handleSelect(t)"
            >
              {{ t }}
            </nut-button>
          </view>
        </view>
        <view class="sheet__action">
          <nut-button block type="info" :disabled="!selectedTopic" @click="confirmStart">开始起卦</nut-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { ref, onMounted } from 'vue'
import { useDivinationStore } from '@/stores/divination'

const store = useDivinationStore()
const showTopicSelect = ref(false)
const selectedTopic = ref('综合')
const topics = ['综合', '爱情', '事业', '学业', '财运', '健康', '人际'] as const
const headerPadding = ref('0px')

onMounted(() => {
  const systemInfo = Taro.getSystemInfoSync()
  const statusBarHeight = systemInfo.statusBarHeight || 0
  headerPadding.value = `${statusBarHeight + 10}px`
})

function openTopicSelect() {
  showTopicSelect.value = true
}

function closeTopicSelect() {
  showTopicSelect.value = false
}

function handleSelect(t: string) {
  selectedTopic.value = t
}

function confirmStart() {
  store.setLines([])
  store.setTopic(selectedTopic.value)
  showTopicSelect.value = false
  Taro.navigateTo({ url: '/pages/divination/index' })
}
</script>

<style lang="scss">
@use "@/styles/tokens.scss" as *;

.page {
  min-height: 100vh;
  background: $bg-color;
  padding: 0 20px 110px;
  box-sizing: border-box;
}

.center {
  min-height: calc(100vh - 110px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.taiji-wrapper {
  position: relative;
  width: 220px;
  height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.taiji {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background: linear-gradient(90deg, #111111 50%, #ffffff 50%);
  animation: spin 12s linear infinite;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
}

.taiji__text {
  position: absolute;
  z-index: 100;
  font-family: "STKaiti", "KaiTi", serif;
  font-size: 48px;
  font-weight: bold;
  color: #D4AF37; /* Gold color */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  pointer-events: none;
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
  z-index: 1;
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
  z-index: 2;
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
  z-index: 10;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes counter-spin {
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}

.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.42);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 18px 16px 18px;
  box-sizing: border-box;
  z-index: 100;
}

.sheet {
  width: 100%;
  max-width: 520px;
  background: #ffffff;
  border-radius: 18px;
  padding: 20px 16px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sheet__title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.sheet__sub {
  text-align: center;
  font-size: 14px;
  color: #666;
  margin-top: -8px;
  margin-bottom: 4px;
}

.topic-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.topic-btn {
  width: calc((100% - 12px) / 2);
}

.sheet__action {
  margin-top: 8px;
}
</style>
