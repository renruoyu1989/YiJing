<template>
  <view class="page" :style="{ paddingTop: headerPadding }">
    <view class="group">
      <view class="group__title">{{ messages.settings.title }}</view>
      
      <view class="cell">
        <view class="cell__label">{{ messages.settings.bgm }}</view>
        <switch :checked="settings.enableBgm" color="#D4AF37" @change="handleBgmChange" />
      </view>

      <view class="cell-col">
        <view class="cell__label">{{ messages.settings.language }}</view>
        <view class="radio-group">
          <view 
            class="radio-item" 
            :class="{ active: settings.language === 'zh-CN' }"
            @click="setLang('zh-CN')"
          >
            {{ messages.settings.langCN }}
          </view>
          <view 
            class="radio-item" 
            :class="{ active: settings.language === 'zh-TW' }"
            @click="setLang('zh-TW')"
          >
            {{ messages.settings.langTW }}
          </view>
        </view>
      </view>
    </view>

    <view class="bottom">
      <nut-button block type="default" @click="goBack">{{ messages.ui.result.back }}</nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'
import { ref, onMounted, computed, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { getLocaleMessages } from '@/utils/i18n'

const settings = useSettingsStore()
const messages = computed(() => getLocaleMessages(settings.language))
const headerPadding = ref('0px')

watch(messages, (newVal) => {
  Taro.setNavigationBarTitle({
    title: newVal.settings.title
  })
}, { immediate: true })

onMounted(() => {
  const systemInfo = Taro.getSystemInfoSync()
  const statusBarHeight = systemInfo.statusBarHeight || 0
  headerPadding.value = `${statusBarHeight + 10}px`
})

function handleBgmChange(e) {
  settings.setEnableBgm(e.detail.value)
}

function setLang(lang: string) {
  settings.setLanguage(lang)
}

function goBack() {
  Taro.navigateBack()
}
</script>

<style lang="scss">
@use "@/styles/tokens.scss" as *;

.page {
  min-height: 100vh;
  background: $bg-color;
  padding: 0 20px;
  box-sizing: border-box;
}

.group {
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.62);
  border-radius: 16px;
  padding: 0 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.group__title {
  padding: 16px 0 8px;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.5);
  font-weight: bold;
}

.cell {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:last-child {
    border-bottom: none;
  }
}

.cell-col {
  padding: 16px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  &:last-child {
    border-bottom: none;
  }
}

.cell__label {
  font-size: 16px;
  color: #333;
}

.radio-group {
  margin-top: 12px;
  display: flex;
  gap: 12px;
}

.radio-item {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 8px;
  background: #f0f0f0;
  color: #666;
  font-size: 14px;
  border: 1px solid transparent;
  transition: all 0.3s;
}

.radio-item.active {
  background: rgba(212, 175, 55, 0.1);
  color: #D4AF37;
  border-color: #D4AF37;
  font-weight: bold;
}

.bottom {
  margin-top: 40px;
}
</style>
