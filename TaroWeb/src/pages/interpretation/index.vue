<template>
  <view class="page" :style="{ paddingTop: headerPadding }">
    <view class="scroll-container">
      <view class="title">{{ messages.ui.interpretation.title }}（{{ topicName }}）</view>
      
      <view class="card">
        <view class="card__title">【{{ title }}】 {{ messages.ui.interpretation.analysis }}</view>
        <view class="rich-text">
          <view v-for="(p, idx) in formattedContent" :key="idx" class="rich-text-paragraph">
            {{ p }}
          </view>
        </view>
      </view>

      <view class="card" v-if="originalText">
        <view class="card__title">{{ messages.ui.interpretation.original }}</view>
        <view class="card__text">{{ originalText }}</view>
      </view>
      <!-- Add extra padding at bottom of scroll content -->
      <view style="height: 20px;"></view>
    </view>

    <view class="bottom">
      <nut-button plain block @click="goBack">{{ messages.ui.interpretation.back }}</nut-button>
      <nut-button plain block @click="goHome">{{ messages.ui.interpretation.home }}</nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { computed, ref, onMounted, watch } from 'vue'
import { useDivinationStore } from '@/stores/divination'
import { useSettingsStore } from '@/stores/settings'
import { generateRichInterpretation, type Topic } from '@/utils/interpretationHelper'
import { getLocaleMessages } from '@/utils/i18n'

definePageConfig({
  // navigationBarTitleText set dynamically
})

const store = useDivinationStore()
const settingsStore = useSettingsStore()
const headerPadding = ref('0px')

const currentLines = computed(() => store.lines)
const currentTopic = computed(() => store.topic || 'general')
const messages = computed(() => getLocaleMessages(settingsStore.language))

watch(messages, (newVal) => {
  Taro.setNavigationBarTitle({
    title: newVal.ui.interpretation_page.title
  })
}, { immediate: true })

const topicDisplayName = computed(() => {
  return messages.value.topics[currentTopic.value as Topic] || currentTopic.value
})

const richInterpretation = computed(() => {
  return generateRichInterpretation(
    currentLines.value, 
    currentTopic.value as Topic, 
    settingsStore.language
  )
})

const richInterpretationParagraphs = computed(() => {
  if (!richInterpretation.value) return []
  return richInterpretation.value.split('\n')
})

onMounted(() => {
  const systemInfo = Taro.getSystemInfoSync()
  const statusBarHeight = systemInfo.statusBarHeight || 0
  headerPadding.value = `${Math.max(statusBarHeight, 20) + 44}px`

  Taro.setNavigationBarTitle({
    title: messages.value.ui.interpretation_page.title
  })
})

function goBack() {
  Taro.navigateBack()
}

function goHome() {
  store.reset()
  Taro.reLaunch({ url: '/pages/index/index' })
}
</script>

<style lang="scss" scoped>
@use "@/styles/tokens.scss" as *;




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

.page {
  display: flex !important;
  flex-direction: column !important;
  height: 100vh !important;
  overflow: hidden !important;
  background: $bg-color;
  box-sizing: border-box;
}

.scroll-container {
  flex: 1;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.bottom {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: calc(16px + env(safe-area-inset-bottom, 0px));
}
</style>
