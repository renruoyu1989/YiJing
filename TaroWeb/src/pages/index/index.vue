<template>
  <view class="page" :style="{ paddingTop: headerPadding }">
    <view class="settings-btn" :style="{ top: btnTop }" @click="goToSettings">
      <view class="settings-icon">⚙</view>
    </view>

    <view class="center">
      <view class="taiji-wrapper">
        <view class="taiji__text">{{ messages.ui.home.title }}</view>
        <view class="taiji">
          <view class="taiji__dot taiji__dot--top" />
          <view class="taiji__dot taiji__dot--bottom" />
        </view>
      </view>
    </view>

    <view class="bottom">
      <nut-button type="primary" block @click="openTopicSelect">{{ messages.ui.home.start_btn }}</nut-button>
    </view>

    <view v-if="showTopicSelect" class="overlay" @tap="closeTopicSelect">
      <view class="sheet" @tap.stop>
        <view class="sheet__title">{{ messages.ui.home.select_topic_title }}</view>
        <view class="sheet__sub">{{ messages.ui.home.select_topic_sub }}</view>
        <view class="topic-grid">
          <view v-for="t in topics" :key="t" class="topic-btn">
            <nut-button 
              size="normal" 
              block 
              :type="t === selectedTopic ? 'primary' : 'default'" 
              @click="handleSelect(t)"
            >
              {{ messages.topics[t] }}
            </nut-button>
          </view>
        </view>
        <view class="sheet__action">
          <nut-button block type="info" :disabled="!selectedTopic" @click="confirmStart">{{ messages.ui.home.confirm_start }}</nut-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { ref, onMounted, computed, watch } from 'vue'
import { useDivinationStore } from '@/stores/divination'
import { useSettingsStore } from '@/stores/settings'
import { getLocaleMessages } from '@/utils/i18n'
import { playBgm } from '@/utils/bgmManager'

const store = useDivinationStore()
const settingsStore = useSettingsStore()
const messages = computed(() => getLocaleMessages(settingsStore.language))

watch(messages, (newVal) => {
  Taro.setNavigationBarTitle({
    title: newVal.app.title
  })
}, { immediate: true })

const showTopicSelect = ref(false)
const selectedTopic = ref('general')
const topics = ['general', 'love', 'career', 'academics', 'wealth', 'health', 'relationships'] as const
const headerPadding = ref('0px')
const btnTop = ref('0px')

onMounted(() => {
  const systemInfo = Taro.getSystemInfoSync()
  let top = systemInfo.statusBarHeight || 0
  
  if (process.env.TARO_ENV === 'weapp') {
    const menuButton = Taro.getMenuButtonBoundingClientRect()
    top = menuButton.top + (menuButton.height - 44) / 2
  } else if (process.env.TARO_ENV === 'h5') {
    // H5 specific logic
    // Use CSS variable if available or default
    // We will set a value here, but the style binding will be overridden by a specific class if needed
    top = 10 // Default fallback
  } else {
    // RN or other
    top += 10
  }
  
  // Ensure minimal spacing
  top = Math.max(top, 10)
  
  btnTop.value = `${top}px`
  headerPadding.value = `${top + 54}px` // 44px button + 10px margin
  
  if (process.env.TARO_ENV === 'h5') {
     btnTop.value = 'calc(env(safe-area-inset-top) + 10px)'
  }

  // Try to play BGM on home page mount (backup for onLaunch)
  if (settingsStore.enableBgm) {
    playBgm()
  }
})

function goToSettings() {
  playBgm()
  Taro.navigateTo({ url: '/pages/settings/index' })
}

function openTopicSelect() {
  playBgm()
  showTopicSelect.value = true
}

function closeTopicSelect() {
  showTopicSelect.value = false
}

function handleSelect(t: string) {
  playBgm()
  selectedTopic.value = t
}

function confirmStart() {
  playBgm()
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

.settings-btn {
  position: fixed;
  left: 20px;
  z-index: 10000; /* Max z-index */
  width: 44px; /* Increased size */
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9); /* More opaque */
  border-radius: 50%;
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  cursor: pointer; /* Add pointer cursor */
}

.settings-icon {
  font-size: 24px;
  line-height: 1;
  color: #666;
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
  /* height: 220px; Remove fixed height to allow stacking */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.taiji {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background: linear-gradient(90deg, #111111 50%, #ffffff 50%);
  animation: spin 12s linear infinite;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.08);
}

.taiji__text {
  /* position: absolute; Remove absolute */
  /* z-index: 100; */
  font-family: "STKaiti", "KaiTi", serif;
  font-size: 48px;
  font-weight: bold;
  color: #D4AF37; /* Gold color */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1); /* Lighter shadow */
  pointer-events: none;
  margin-bottom: 20px; /* Add space between text and icon */
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
