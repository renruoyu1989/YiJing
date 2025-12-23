<template>
  <view class="page">
    <view class="card highlight-card">
      <view class="card__title">大师解卦（{{ currentTopic }}）</view>
      <view class="card__text">
        <view 
          v-for="(para, idx) in richInterpretationParagraphs" 
          :key="idx" 
          class="rich-text-paragraph"
        >
          {{ para }}
        </view>
      </view>
    </view>

    <view class="bottom">
      <nut-button type="primary" block @click="goBack">返回卦象</nut-button>
      <view class="spacer" />
      <nut-button plain block @click="goHome">返回首页</nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { computed } from 'vue'
import { useDivinationStore } from '@/stores/divination'
import { generateRichInterpretation, type Topic } from '@/utils/interpretationHelper'

definePageConfig({
  navigationBarTitleText: '大师解卦'
})

const store = useDivinationStore()

const currentLines = computed(() => store.lines)
const currentTopic = computed(() => store.topic || '综合')

const richInterpretation = computed(() => {
  return generateRichInterpretation(currentLines.value, currentTopic.value as Topic)
})

const richInterpretationParagraphs = computed(() => {
  if (!richInterpretation.value) return []
  return richInterpretation.value.split('\n')
})

function goBack() {
  Taro.navigateBack()
}

function goHome() {
  store.reset()
  Taro.reLaunch({ url: '/pages/index/index' })
}
</script>

<style lang="scss">
@use "@/styles/tokens.scss" as *;

.page {
  min-height: 100vh;
  background: $bg-color;
  padding: 28px 20px 150px;
  box-sizing: border-box;
}

.card {
  margin-top: 16px;
  padding: 18px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.62);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
}

.highlight-card {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.card__title {
  font-size: 14px;
  letter-spacing: 1px;
  color: rgba(0, 0, 0, 0.75);
}

.card__text {
  margin-top: 12px;
  font-size: 15px;
  line-height: 1.8;
  white-space: pre-wrap;
}

.rich-text-paragraph {
  min-height: 1em;
  margin-bottom: 6px;
  text-align: justify;
}

.bottom {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
