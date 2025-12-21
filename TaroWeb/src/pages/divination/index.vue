<template>
  <view class="page">
    <view class="coins">
      <view v-for="(coin, idx) in coins" :key="idx" class="coin-wrap">
        <view
          class="coin"
          :class="{
            'coin--flipping': isFlipping,
            'coin--back': !isFlipping && coin === 2
          }"
        >
          <view class="coin__face coin__face--front">
            <image class="coin__img" :src="coinFrontSrc" mode="aspectFill" />
          </view>
          <view class="coin__face coin__face--back">
            <image class="coin__img" :src="coinBackSrc" mode="aspectFill" />
          </view>
        </view>
      </view>
    </view>

    <view class="lines">
      <view class="lines__stack">
        <view v-for="(line, slotIdx) in lineSlots" :key="slotIdx" class="line-slot">
          <view class="line" :class="[line ? lineClass(line) : null, line ? 'line--shown' : 'line--hidden']">
            <view v-if="line != null && isYang(line)" class="line__yang">
              <view class="line__bar" />
            </view>
            <view v-else-if="line != null" class="line__yin">
              <view class="line__bar line__bar--half" />
              <view class="line__gap" />
              <view class="line__bar line__bar--half" />
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom">
      <nut-button type="primary" block :disabled="isFlipping || lines.length >= 6" @click="tossOneLine">
        掷一爻
      </nut-button>
      <view class="hint">{{ hintText }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import { computed, ref } from 'vue'
import type { CoinValue, LineValue } from '@/utils/iching'
import { coinsToLine, isMovingLine, tossThreeCoins } from '@/utils/iching'
import { useDivinationStore } from '@/stores/divination'

const store = useDivinationStore()

const coinFrontSrc =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj4KICA8ZGVmcz4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZyIgY3g9IjMwJSIgY3k9IjMwJSIgcj0iODAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZjRkNiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjQ1JSIgc3RvcC1jb2xvcj0iI2UyYjA2YSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ijc4JSIgc3RvcC1jb2xvcj0iI2I4N2IzZiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM4ZDVhMmIiLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9ImcyIiBjeD0iMzUlIiBjeT0iMzUlIiByPSI3MCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmZmOWVhIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTUlIiBzdG9wLWNvbG9yPSIjZWZjODhhIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2IwN2E0MCIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICA8L2RlZnM+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIgZmlsbD0idXJsKCNnKSIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZkM2YxYSIgc3Ryb2tlLXdpZHRoPSIzIiBvcGFjaXR5PSIwLjY1Ii8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI3MiIgZmlsbD0idXJsKCNnMikiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjcwIiBmaWxsPSJub25lIiBzdHJva2U9IiM3YTRhMjAiIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iMC40NSIvPgogIDxyZWN0IHg9Ijc4IiB5PSI3OCIgd2lkdGg9IjQ0IiBoZWlnaHQ9IjQ0IiByeD0iNSIgZmlsbD0iIzVhM2ExZCIgb3BhY2l0eT0iMC4yMiIvPgogIDxyZWN0IHg9IjgxIiB5PSI4MSIgd2lkdGg9IjM4IiBoZWlnaHQ9IjM4IiByeD0iNCIgZmlsbD0iIzJiMWIwZiIgb3BhY2l0eT0iMC4zNSIvPgogIDxyZWN0IHg9IjgyIiB5PSI4MiIgd2lkdGg9IjM2IiBoZWlnaHQ9IjM2IiByeD0iNCIgZmlsbD0iIzFiMTIwYSIgb3BhY2l0eT0iMC41NSIvPgogIDx0ZXh0IHg9IjEwMCIgeT0iNjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjIiIGZvbnQtZmFtaWx5PSJTb25ndGkgU0MsIFNpbVN1biwgc2VyaWYiIGZpbGw9IiMyYTE2MDgiIG9wYWNpdHk9IjAuOSI+5Lm+PC90ZXh0PgogIDx0ZXh0IHg9IjEwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIyIiBmb250LWZhbWlseT0iU29uZ3RpIFNDLCBTaW1TdW4sIHNlcmlmIiBmaWxsPSIjMmExNjA4IiBvcGFjaXR5PSIwLjkiPumahjwvdGV4dD4KICA8dGV4dCB4PSI1NiIgeT0iMTEyIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjIyIiBmb250LWZhbWlseT0iU29uZ3RpIFNDLCBTaW1TdW4sIHNlcmlmIiBmaWxsPSIjMmExNjA4IiBvcGFjaXR5PSIwLjkiPumAmjwvdGV4dD4KICA8dGV4dCB4PSIxNDQiIHk9IjExMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyMiIgZm9udC1mYW1pbHk9IlNvbmd0aSBTQywgU2ltU3VuLCBzZXJpZiIgZmlsbD0iIzJhMTYwOCIgb3BhY2l0eT0iMC45Ij7lrp08L3RleHQ+Cjwvc3ZnPg=='
const coinBackSrc =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj4KICA8ZGVmcz4KICAgIDxyYWRpYWxHcmFkaWVudCBpZD0iZyIgY3g9IjMwJSIgY3k9IjMwJSIgcj0iODAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI2ZmZjZlMSIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjQ1JSIgc3RvcC1jb2xvcj0iI2U2Yjc3NSIvPgogICAgICA8c3RvcCBvZmZzZXQ9Ijc4JSIgc3RvcC1jb2xvcj0iI2MzODc0YiIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM5MTU5MmIiLz4KICAgIDwvcmFkaWFsR3JhZGllbnQ+CiAgICA8cmFkaWFsR3JhZGllbnQgaWQ9ImcyIiBjeD0iMzUlIiBjeT0iMzUlIiByPSI3MCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmZmYWYwIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTglIiBzdG9wLWNvbG9yPSIjZjJkMTljIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2I4N2Y0NSIvPgogICAgPC9yYWRpYWxHcmFkaWVudD4KICA8L2RlZnM+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIgZmlsbD0idXJsKCNnKSIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzZkM2YxYSIgc3Ryb2tlLXdpZHRoPSIzIiBvcGFjaXR5PSIwLjYyIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI3MiIgZmlsbD0idXJsKCNnMikiLz4KICA8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjcwIiBmaWxsPSJub25lIiBzdHJva2U9IiM3YTRhMjAiIHN0cm9rZS13aWR0aD0iMiIgb3BhY2l0eT0iMC40MiIvPgogIDxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNDQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJhMTYwOCIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjI1Ii8+CiAgPHBhdGggZD0iTTYwIDEyMGMxOC00MCA2Mi00OCA4MC0xMmM5IDE4LTIgMzktMjEgNDRjLTIyIDYtNDQtOS01MC0zMnoiIGZpbGw9IiMyYTE2MDgiIG9wYWNpdHk9IjAuMTIiLz4KICA8dGV4dCB4PSIxMDAiIHk9IjExMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyMCIgZm9udC1mYW1pbHk9IlNvbmd0aSBTQywgU2ltU3VuLCBzZXJpZiIgZmlsbD0iIzJhMTYwOCIgb3BhY2l0eT0iMC44NSI+5aSp5LiL5aSq5bmzPC90ZXh0Pgo8L3N2Zz4='

const isFlipping = ref(false)
const coins = ref<CoinValue[]>([3, 3, 3])
const lines = ref<LineValue[]>([])

useDidShow(() => {
  store.reset()
  isFlipping.value = false
  coins.value = [3, 3, 3]
  lines.value = []
})

const hintText = computed(() => {
  if (lines.value.length >= 6) return '卦成，正在解卦…'
  return `已得 ${lines.value.length}/6 爻`
})

const lineSlots = computed(() => {
  const slots: Array<LineValue | null> = Array.from({ length: 6 }, () => null)
  lines.value.forEach((line, idx) => {
    const slotIndex = 5 - idx
    if (slotIndex >= 0 && slotIndex < 6) slots[slotIndex] = line
  })
  return slots
})

function isYang(line: LineValue) {
  return line === 7 || line === 9
}

function lineClass(line: LineValue) {
  return {
    'line--moving': isMovingLine(line)
  }
}

function tossOneLine() {
  if (isFlipping.value) return
  if (lines.value.length >= 6) return

  const nextCoins = tossThreeCoins()
  const nextLine = coinsToLine(nextCoins)

  isFlipping.value = true
  Taro.vibrateShort()

  setTimeout(() => {
    coins.value = [...nextCoins]
    lines.value = [...lines.value, nextLine]
    isFlipping.value = false

    if (lines.value.length >= 6) {
      store.setLines(lines.value)
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/result/index' })
      }, 200)
    }
  }, 1000)
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

.coins {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-top: 14px;
}

.coin-wrap {
  perspective: 800px;
}

.coin {
  width: 74px;
  height: 74px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 180ms linear;
}

.coin--back {
  transform: rotateX(180deg);
}

.coin--flipping {
  animation: coinFlip 1s ease-in-out;
}

.coin__face {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  backface-visibility: hidden;
  overflow: hidden;
  border: 2px solid rgba(0, 0, 0, 0.18);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
}

.coin__face--back {
  transform: rotateX(180deg);
}

.coin__img {
  width: 100%;
  height: 100%;
}

@keyframes coinFlip {
  0% {
    transform: rotateX(0deg);
  }
  100% {
    transform: rotateX(720deg);
  }
}

.lines {
  margin-top: 26px;
  display: flex;
  justify-content: center;
}

.lines__stack {
  width: 240px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.62);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
}

.line-slot {
  height: 12px;
  display: flex;
  align-items: center;
}

.line {
  width: 100%;
  transition: opacity 240ms ease, transform 240ms ease;
}

.line--hidden {
  opacity: 0;
  transform: translateY(12px) scale(0.98);
}

.line--shown {
  opacity: 1;
  transform: translateY(0) scale(1);
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

.bottom {
  position: fixed;
  left: 20px;
  right: 20px;
  bottom: 26px;
}

.hint {
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
}
</style>
