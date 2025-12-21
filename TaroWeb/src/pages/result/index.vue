<template>
  <view class="page">
    <view class="hexagram">
      <view v-for="(line, idx) in topDownLines" :key="idx" class="line" :class="lineClass(line)">
        <view v-if="isYang(line)" class="line__yang">
          <view class="line__bar" />
        </view>
        <view v-else class="line__yin">
          <view class="line__bar line__bar--half" />
          <view class="line__gap" />
          <view class="line__bar line__bar--half" />
        </view>
      </view>
    </view>

    <view class="title">{{ coreName }}</view>
    <view class="sub">上卦：{{ upperName }}　下卦：{{ lowerName }}</view>

    <view class="card">
      <view class="card__title">卦辞</view>
      <view class="card__text">{{ guaciText }}</view>
    </view>

    <view class="card">
      <view class="card__title">爻辞</view>
      <view class="yao-list">
        <view v-for="item in yaociItems" :key="item.key" class="yao-item" :class="item.isMoving ? 'yao-item--moving' : ''">
          <view class="yao-item__label">{{ item.label }}</view>
          <view class="yao-item__text">{{ item.text }}</view>
        </view>
      </view>
      <view v-if="useText" class="use-line">
        <view class="use-line__label">{{ useLabel }}</view>
        <view class="use-line__text">{{ useText }}</view>
      </view>
    </view>

    <view class="bottom">
      <nut-button type="primary" block @click="goBack">返回</nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import { computed, ref } from 'vue'
import type { LineValue } from '@/utils/iching'
import { isMovingLine, linesToSymbol } from '@/utils/iching'
import { findHexagramBySymbol } from '@/data/hexagrams'
import { useDivinationStore } from '@/stores/divination'

const store = useDivinationStore()
const currentLines = ref<LineValue[]>([])

const trigramMap: Record<string, string> = {
  '111': '天',
  '000': '地',
  '010': '水',
  '101': '火',
  '100': '雷',
  '011': '风',
  '001': '山',
  '110': '泽'
}

const yaoRank = ['初', '二', '三', '四', '五', '上'] as const

useDidShow(() => {
  if (store.lines.length !== 6) {
    Taro.reLaunch({ url: '/pages/index/index' })
    return
  }
  currentLines.value = [...store.lines]
})

const topDownLines = computed(() => [...currentLines.value].reverse())

const symbol = computed(() => linesToSymbol(currentLines.value))
const hexagram = computed(() => findHexagramBySymbol(symbol.value))

const lowerBits = computed(() => (symbol.value.length === 6 ? symbol.value.slice(0, 3) : ''))
const upperBits = computed(() => (symbol.value.length === 6 ? symbol.value.slice(3, 6) : ''))

const upperName = computed(() => trigramMap[upperBits.value] ?? '')
const lowerName = computed(() => trigramMap[lowerBits.value] ?? '')

const coreName = computed(() => {
  const bits = symbol.value
  if (bits.length !== 6) return hexagram.value?.name ?? '未知卦'
  return hexagram.value?.name ?? '未知卦'
})

function isYang(line: LineValue) {
  return line === 7 || line === 9
}

function lineClass(line: LineValue) {
  return {
    'line--moving': isMovingLine(line)
  }
}

const guaciText = computed(() => {
  const h = hexagram.value
  if (!h) return '暂无卦辞'
  return h.guaci || '暂无卦辞'
})

const yaociItems = computed(() => {
  const h = hexagram.value
  const lines = currentLines.value
  if (!h || lines.length !== 6) {
    return Array.from({ length: 6 }, (_, idx) => ({
      key: idx,
      label: '',
      text: '',
      isMoving: false
    }))
  }

  return lines.map((line, idx) => {
    const rank = yaoRank[idx]
    const num = isYang(line) ? '九' : '六'
    const label = `${rank}${num}`
    const text = h.yaoci[idx] || ''
    return {
      key: idx,
      label,
      text,
      isMoving: isMovingLine(line)
    }
  })
})

const useText = computed(() => {
  const h = hexagram.value
  const lines = currentLines.value
  if (!h || lines.length !== 6) return ''
  if (lines.every((l) => l === 9) && h.yaoci.length >= 7) return h.yaoci[6] || ''
  if (lines.every((l) => l === 6) && h.yaoci.length >= 7) return h.yaoci[6] || ''
  return ''
})

const useLabel = computed(() => {
  const lines = currentLines.value
  if (lines.length !== 6) return ''
  if (lines.every((l) => l === 9)) return '用九'
  if (lines.every((l) => l === 6)) return '用六'
  return ''
})

function goBack() {
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

.hexagram {
  width: 260px;
  margin: 6px auto 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.62);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
}

.line__yang,
.line__yin {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.line__bar {
  height: 12px;
  width: 100%;
  border-radius: 8px;
  background: $primary-color;
}

.line__bar--half {
  width: 46%;
}

.line__gap {
  width: 8%;
}

.line--moving .line__bar {
  background: $highlight-color;
}

.title {
  text-align: center;
  font-size: 22px;
  letter-spacing: 1px;
  margin-top: 6px;
}

.sub {
  margin-top: 8px;
  text-align: center;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.58);
}

.card {
  margin-top: 16px;
  padding: 18px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.62);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
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

.yao-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.yao-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.yao-item__label {
  flex: 0 0 56px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.75);
}

.yao-item__text {
  flex: 1;
  font-size: 15px;
  line-height: 1.8;
  white-space: pre-wrap;
}

.yao-item--moving .yao-item__label {
  color: $highlight-color;
}

.use-line {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.use-line__label {
  flex: 0 0 56px;
  font-size: 13px;
  color: $highlight-color;
}

.use-line__text {
  flex: 1;
  font-size: 15px;
  line-height: 1.8;
  white-space: pre-wrap;
}

.bottom {
  position: fixed;
  left: 20px;
  right: 20px;
  bottom: 26px;
}
</style>
