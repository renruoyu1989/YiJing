<template>
  <view class="page" :style="{ paddingTop: headerPadding }">
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
    <view class="sub">{{ messages.ui.hexagram.upper }}：{{ upperName }}　{{ messages.ui.hexagram.lower }}：{{ lowerName }}</view>

    <view class="card">
      <view class="card__title">{{ messages.ui.hexagram.lines }}</view>
      <view class="meta-list">
        <view v-for="item in lineMetaItems" :key="item.key" class="meta-item" :class="item.isMoving ? 'meta-item--moving' : ''">
          <view class="meta-item__label">{{ item.label }}</view>
          <view class="meta-item__text">{{ item.kind }}（{{ item.value }}）</view>
        </view>
      </view>
    </view>

    <view class="card">
      <view class="card__title">{{ messages.ui.hexagram.guaci }}</view>
      <view class="card__text">{{ guaciText }}</view>
    </view>

    <view class="card">
      <view class="card__title">{{ messages.ui.hexagram.yaoci }}</view>
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

    <view v-if="hasChanging" class="card">
      <view class="card__title">{{ messages.ui.hexagram.changed }}</view>
      <view class="card__text">
        {{ changedCoreName }}（{{ messages.ui.hexagram.upper }}：{{ changedUpperName }}　{{ messages.ui.hexagram.lower }}：{{ changedLowerName }}）
      </view>
      <view class="card__text">{{ changedGuaciText }}</view>
    </view>

    <view class="card">
      <view class="card__title">{{ messages.ui.hexagram.source }}</view>
      <view class="pick-tip">{{ pickTip }}</view>
      <view class="pick-list">
        <view v-for="item in pickedTexts" :key="item.key" class="pick-item">
          <view class="pick-item__label">{{ item.label }}</view>
          <view class="pick-item__text">{{ item.text }}</view>
        </view>
      </view>
    </view>

    <view class="bottom">
      <nut-button type="primary" block @click="goToInterpretation">{{ messages.ui.hexagram.interpret }}</nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import { computed, ref, onMounted, watch } from 'vue'
import type { LineValue } from '@/utils/iching'
import { changedLines, isMovingLine, lineKindName, linesToSymbol } from '@/utils/iching'
import { findHexagramBySymbol } from '@/data/hexagrams'
import { useDivinationStore } from '@/stores/divination'
import { useSettingsStore } from '@/stores/settings'
import { getLocaleMessages } from '@/utils/i18n'

const store = useDivinationStore()
const settingsStore = useSettingsStore()
const messages = computed(() => getLocaleMessages(settingsStore.language))

watch(messages, (newVal) => {
  Taro.setNavigationBarTitle({
    title: newVal.ui.result.title
  })
}, { immediate: true })

const currentLines = ref<LineValue[]>([])
const headerPadding = ref('0px')

const trigramMap = computed(() => messages.value.trigram_names)
const yaoRank = computed(() => messages.value.yao_names)

onMounted(() => {
  const systemInfo = Taro.getSystemInfoSync()
  const statusBarHeight = systemInfo.statusBarHeight || 0
  headerPadding.value = `${Math.max(statusBarHeight, 20) + 44}px`
})

useDidShow(() => {
  if (store.lines.length !== 6) {
    Taro.reLaunch({ url: '/pages/index/index' })
    return
  }
  currentLines.value = [...store.lines]
})

const topDownLines = computed(() => [...currentLines.value].reverse())

const symbol = computed(() => linesToSymbol(currentLines.value))
const hexagram = computed(() => findHexagramBySymbol(symbol.value, settingsStore.language))

const lowerBits = computed(() => (symbol.value.length === 6 ? symbol.value.slice(0, 3) : ''))
const upperBits = computed(() => (symbol.value.length === 6 ? symbol.value.slice(3, 6) : ''))

const upperName = computed(() => trigramMap.value[upperBits.value as keyof typeof trigramMap.value] ?? '')
const lowerName = computed(() => trigramMap.value[lowerBits.value as keyof typeof trigramMap.value] ?? '')

const coreName = computed(() => {
  const bits = symbol.value
  if (bits.length !== 6) return hexagram.value?.name ?? messages.value.ui.hexagram.unknown
  return hexagram.value?.name ?? messages.value.ui.hexagram.unknown
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
  if (!h) return messages.value.ui.hexagram.none
  return h.guaci || messages.value.ui.hexagram.none
})

const lineMetaItems = computed(() => {
  const lines = currentLines.value
  if (lines.length !== 6) return []
  return lines.map((line, idx) => {
    const rank = yaoRank.value[idx]
    const num = isYang(line) ? messages.value.ui.common.nine : messages.value.ui.common.six
    return {
      key: idx,
      label: `${rank}${num}`,
      kind: messages.value.line_kinds[lineKindName(line)],
      value: line,
      isMoving: isMovingLine(line)
    }
  })
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
    const rank = yaoRank.value[idx]
    const num = isYang(line) ? messages.value.ui.common.nine : messages.value.ui.common.six
    const label = `${rank}${num}（${messages.value.line_kinds[lineKindName(line)]}）`
    const text = h.yaoci[idx] || ''
    return {
      key: idx,
      label,
      text,
      isMoving: isMovingLine(line)
    }
  })
})

const movingIndexes = computed(() => {
  const lines = currentLines.value
  const indexes: number[] = []
  lines.forEach((line, idx) => {
    if (isMovingLine(line)) indexes.push(idx)
  })
  return indexes
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
  if (lines.every((l) => l === 9)) return messages.value.ui.hexagram.use_nine
  if (lines.every((l) => l === 6)) return messages.value.ui.hexagram.use_six
  return ''
})

const hasChanging = computed(() => movingIndexes.value.length > 0)

const changed = computed(() => {
  const lines = currentLines.value
  if (lines.length !== 6) return []
  return changedLines(lines)
})

const changedSymbol = computed(() => (changed.value.length === 6 ? linesToSymbol(changed.value) : ''))
const changedHexagram = computed(() => findHexagramBySymbol(changedSymbol.value, settingsStore.language))

const changedLowerBits = computed(() => (changedSymbol.value.length === 6 ? changedSymbol.value.slice(0, 3) : ''))
const changedUpperBits = computed(() => (changedSymbol.value.length === 6 ? changedSymbol.value.slice(3, 6) : ''))
const changedUpperName = computed(() => trigramMap.value[changedUpperBits.value as keyof typeof trigramMap.value] ?? '')
const changedLowerName = computed(() => trigramMap.value[changedLowerBits.value as keyof typeof trigramMap.value] ?? '')
const changedCoreName = computed(() => changedHexagram.value?.name ?? messages.value.ui.hexagram.unknown)
const changedGuaciText = computed(() => changedHexagram.value?.guaci ?? messages.value.ui.hexagram.none)

type PickedText = { key: string; label: string; text: string }

const pickTip = computed(() => {
  const count = movingIndexes.value.length
  if (count === 0) return messages.value.ui.pick_tips.no_moving
  if (count === 1) return messages.value.ui.pick_tips.one_moving
  if (count === 2) return messages.value.ui.pick_tips.two_moving
  if (count === 3) return messages.value.ui.pick_tips.three_moving
  if (count === 4) return messages.value.ui.pick_tips.four_moving
  if (count === 5) return messages.value.ui.pick_tips.five_moving
  const lines = currentLines.value
  if (lines.length !== 6) return messages.value.ui.pick_tips.six_moving
  if (lines.every((l) => l === 9)) return messages.value.ui.pick_tips.six_moving_yang
  if (lines.every((l) => l === 6)) return messages.value.ui.pick_tips.six_moving_yin
  return messages.value.ui.pick_tips.six_moving
})

const pickedTexts = computed<PickedText[]>(() => {
  const h = hexagram.value
  const ch = changedHexagram.value
  const lines = currentLines.value
  if (!h || lines.length !== 6) return []

  const idxs = [...movingIndexes.value].sort((a, b) => a - b)
  const count = idxs.length

  if (count === 0) {
    return [{ key: 'guaci', label: messages.value.ui.hexagram.guaci, text: h.guaci || messages.value.ui.hexagram.none }]
  }

  if (count === 6) {
    return useText.value
      ? [{ key: 'use', label: useLabel.value, text: useText.value }]
      : ch
        ? [{ key: 'changed-guaci', label: messages.value.ui.hexagram.changed + messages.value.ui.hexagram.guaci, text: ch.guaci || messages.value.ui.hexagram.none }]
        : [{ key: 'guaci', label: messages.value.ui.hexagram.guaci, text: h.guaci || messages.value.ui.hexagram.none }]
  }

  if (count === 5) {
    const staticIdx = [0, 1, 2, 3, 4, 5].find((i) => !idxs.includes(i))
    if (staticIdx == null) return []
    const line = lines[staticIdx]
    const rank = yaoRank.value[staticIdx]
    const num = isYang(line) ? messages.value.ui.common.nine : messages.value.ui.common.six
    const label = `${rank}${num}`
    return [{ key: `yao-${staticIdx}`, label, text: h.yaoci[staticIdx] || '' }]
  }

  if (count === 4) {
    const staticIdxs = [0, 1, 2, 3, 4, 5].filter((i) => !idxs.includes(i))
    const items: PickedText[] = []
    if (ch) items.push({ key: 'changed-guaci', label: messages.value.ui.hexagram.changed + messages.value.ui.hexagram.guaci, text: ch.guaci || messages.value.ui.hexagram.none })
    staticIdxs.forEach((i) => {
      const line = lines[i]
      const rank = yaoRank.value[i]
      const num = isYang(line) ? messages.value.ui.common.nine : messages.value.ui.common.six
      const label = `${rank}${num}`
      items.push({ key: `yao-${i}`, label, text: h.yaoci[i] || '' })
    })
    return items
  }

  if (count === 3) {
    const items: PickedText[] = [{ key: 'guaci', label: messages.value.ui.hexagram.guaci, text: h.guaci || messages.value.ui.hexagram.none }]
    if (ch) items.push({ key: 'changed-guaci', label: messages.value.ui.hexagram.changed + messages.value.ui.hexagram.guaci, text: ch.guaci || messages.value.ui.hexagram.none })
    return items
  }

  if (count === 2) {
    const items: PickedText[] = []
    idxs.forEach((i) => {
      const line = lines[i]
      const rank = yaoRank.value[i]
      const num = isYang(line) ? messages.value.ui.common.nine : messages.value.ui.common.six
      const label = `${rank}${num}`
      items.push({ key: `yao-${i}`, label, text: h.yaoci[i] || '' })
    })
    return items
  }

  const i = idxs[0]
  const line = lines[i]
  const rank = yaoRank.value[i]
  const num = isYang(line) ? messages.value.ui.common.nine : messages.value.ui.common.six
  const label = `${rank}${num}`
  return [{ key: `yao-${i}`, label, text: h.yaoci[i] || '' }]
})

const currentTopic = computed(() => store.topic || messages.value.topics.general)

function goToInterpretation() {
  Taro.navigateTo({ url: '/pages/interpretation/index' })
}
</script>

<style lang="scss">
@use "@/styles/tokens.scss" as *;

.page {
  min-height: 100vh;
  background: $bg-color;
  padding: 0 20px 150px;
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

.meta-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.meta-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.meta-item__label {
  flex: 0 0 56px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.75);
}

.meta-item__text {
  flex: 1;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.62);
}

.meta-item--moving .meta-item__label {
  color: $highlight-color;
}

.meta-item--moving .meta-item__text {
  color: rgba(0, 0, 0, 0.78);
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

.pick-tip {
  margin-top: 10px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.62);
}

.spacer {
  height: 12px;
}

.pick-list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pick-item__label {
  font-size: 13px;
  color: rgba(0, 0, 0, 0.75);
}

.pick-item__text {
  margin-top: 6px;
  font-size: 15px;
  line-height: 1.8;
  white-space: pre-wrap;
}

.bottom {
  position: fixed;
  left: 20px;
  right: 20px;
  bottom: 26px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>