<template>
  <view class="page" :style="{ paddingTop: headerPadding }" @touchmove.stop.prevent="() => {}">
    <view class="coins">
      <view v-for="(coin, idx) in coins" :key="idx" class="coin-wrap">
        <view
          class="coin"
          :class="{
            'coin--flipping': flippingState[idx],
            'coin--back': !flippingState[idx] && coin === 2
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
          <view class="line-marker" v-if="line">
            <text v-if="line === 6" class="marker-x">×</text>
            <text v-if="line === 9" class="marker-o">○</text>
          </view>
        </view>
      </view>
    </view>

    <view class="bottom">
      <nut-button type="primary" block :disabled="isAnyFlipping || lines.length >= 6" @click="tossOneLine">
        {{ messages.ui.divination.toss }}
      </nut-button>
      <view class="hint">{{ hintText }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro, { useDidShow } from '@tarojs/taro'
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import type { CoinValue, LineValue } from '@/utils/iching'
import { coinsToLine, isMovingLine, tossThreeCoins } from '@/utils/iching'
import { useDivinationStore } from '@/stores/divination'
// @ts-ignore
import tossStartSrc from '@/assets/toss_start.mp3'
// @ts-ignore
import tossEndSrc from '@/assets/toss_end.mp3'
import { useSettingsStore } from '@/stores/settings'
import { getLocaleMessages } from '@/utils/i18n'

const store = useDivinationStore()
const settingsStore = useSettingsStore()
const messages = computed(() => getLocaleMessages(settingsStore.language))

watch(messages, (newVal) => {
  Taro.setNavigationBarTitle({
    title: newVal.ui.divination.title
  })
}, { immediate: true })

const coinFrontSrc =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImciIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSI+PHN0b3Agb2Zmc2V0PSI3MCUiIHN0b3AtY29sb3I9IiNlMmIwNmEiLz48c3RvcCBvZmZzZXQ9Ijk1JSIgc3RvcC1jb2xvcj0iIzhkNWEyYiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzVhM2ExZCIvPjwvcmFkaWFsR3JhZGllbnQ+PG1hc2sgaWQ9Im0iPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSJ3aGl0ZSIvPjxyZWN0IHg9Ijc0IiB5PSI3NCIgd2lkdGg9IjUyIiBoZWlnaHQ9IjUyIiBmaWxsPSJibGFjayIvPjwvbWFzaz48L2RlZnM+PGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI5OCIgZmlsbD0idXJsKCNnKSIgbWFzaz0idXJsKCNtKSIvPjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTgiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzVhM2ExZCIgc3Ryb2tlLXdpZHRoPSI0Ii8+PHJlY3QgeD0iNzAiIHk9IjcwIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzVhM2ExZCIgc3Ryb2tlLXdpZHRoPSIzIiByeD0iMiIgbWFzaz0idXJsKCNtKSIvPjx0ZXh0IHg9IjEwMCIgeT0iNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJTVEthaXRpLCBLYWlUaSwgc2VyaWYiIGZvbnQtc2l6ZT0iMzgiIGZpbGw9IiM1YTNhMWQiIGZvbnQtd2VpZ2h0PSJib2xkIj7mtKo8L3RleHQ+PHRleHQgeD0iMTAwIiB5PSIxNzgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJTVEthaXRpLCBLYWlUaSwgc2VyaWYiIGZvbnQtc2l6ZT0iMzgiIGZpbGw9IiM1YTNhMWQiIGZvbnQtd2VpZ2h0PSJib2xkIj7mraY8L3RleHQ+PHRleHQgeD0iMTYyIiB5PSIxMTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJTVEthaXRpLCBLYWlUaSwgc2VyaWYiIGZvbnQtc2l6ZT0iMzgiIGZpbGw9IiM1YTNhMWQiIGZvbnQtd2VpZ2h0PSJib2xkIj7pgJo8L3RleHQ+PHRleHQgeD0iMzgiIHk9IjExNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IlNUS2FpdGksIEthaVRpLCBzZXJpZiIgZm9udC1zaXplPSIzOCIgZmlsbD0iIzVhM2ExZCIgZm9udC13ZWlnaHQ9ImJvbGQiPuWvtjwvdGV4dD48L3N2Zz4='

const coinBackSrc =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImcyIiBjeD0iNTAlIiBjeT0iNTAlIiByPSI1MCUiPjxzdG9wIG9mZnNldD0iNzAlIiBzdG9wLWNvbG9yPSIjZTJiMDZhIi8+PHN0b3Agb2Zmc2V0PSI5NSUiIHN0b3AtY29sb3I9IiM4ZDVhMmIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiM1YTNhMWQiLz48L3JhZGlhbEdyYWRpZW50PjxtYXNrIGlkPSJtMiI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iNzQiIHk9Ijc0IiB3aWR0aD0iNTIiIGhlaWdodD0iNTIiIGZpbGw9ImJsYWNrIi8+PC9tYXNrPjwvZGVmcz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9Ijk4IiBmaWxsPSJ1cmwoI2cyKSIgbWFzaz0idXJsKCNtMikiLz48Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9Ijk4IiBmaWxsPSJub25lIiBzdHJva2U9IiM1YTNhMWQiIHN0cm9rZS13aWR0aD0iNCIvPjxyZWN0IHg9IjcwIiB5PSI3MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSJub25lIiBzdHJva2U9IiM1YTNhMWQiIHN0cm9rZS13aWR0aD0iMyIgcng9IjIiIG1hc2s9InVybCgjbTIpIi8+PHBhdGggZD0iTTUwIDEyMCBRODAgMTUwIDE1MCAxMjAiIHN0cm9rZT0iIzVhM2ExZCIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjYiLz48Y2lyY2xlIGN4PSIxMzAiIGN5PSI4MCIgcj0iMTUiIHN0cm9rZT0iIzVhM2ExZCIgc3Ryb2tlLXdpZHRoPSIzIiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjYiLz48cGF0aCBkPSJNMTMwIDk1IEwxMzAgMTIwIiBzdHJva2U9IiM1YTNhMWQiIHN0cm9rZS13aWR0aD0iMyIgZmlsbD0ibm9uZSIgb3BhY2l0eT0iMC42Ii8+PC9zdmc+'

const headerPadding = ref('0px')
const flippingState = ref([false, false, false])
const flippingDuration = ref(['0s', '0s', '0s'])
const coins = ref<CoinValue[]>([3, 3, 3])
const lines = ref<LineValue[]>([])

const isAnyFlipping = computed(() => flippingState.value.some(s => s))

// Shake detection variables
let lastX = 0
let lastY = 0
let lastZ = 0
let lastTime = 0
const SHAKE_THRESHOLD = 800
const MIN_TIME_BETWEEN_SHAKES = 1000

let tossAudioContext: Taro.InnerAudioContext | null = null
let stopAudioContext: Taro.InnerAudioContext | null = null

useDidShow(() => {
  // Do NOT reset topic here
  store.setLines([])
  flippingState.value = [false, false, false]
  coins.value = [3, 3, 3]
  lines.value = []
  
  // Init sound effects
  if (!tossAudioContext) {
    tossAudioContext = Taro.createInnerAudioContext()
    tossAudioContext.src = tossStartSrc
  }
  if (!stopAudioContext) {
    stopAudioContext = Taro.createInnerAudioContext()
    stopAudioContext.src = tossEndSrc
  }
})

onMounted(() => {
  const systemInfo = Taro.getSystemInfoSync()
  const statusBarHeight = systemInfo.statusBarHeight || 0
  headerPadding.value = `${statusBarHeight + 10}px`

  startShakeDetection()
})

onUnmounted(() => {
  if (tossAudioContext) tossAudioContext.destroy()
  if (stopAudioContext) stopAudioContext.destroy()
  stopShakeDetection()
})

function startShakeDetection() {
  Taro.startAccelerometer({ interval: 'game' })
  Taro.onAccelerometerChange((res) => {
    const currentTime = Date.now()
    if ((currentTime - lastTime) > 100) {
      const diffTime = currentTime - lastTime
      lastTime = currentTime
      const x = res.x
      const y = res.y
      const z = res.z
      const speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000

      if (speed > SHAKE_THRESHOLD) {
        tossOneLine()
      }

      lastX = x
      lastY = y
      lastZ = z
    }
  })
}

function stopShakeDetection() {
  Taro.stopAccelerometer()
}

const hintText = computed(() => {
  if (lines.value.length >= 6) return messages.value.ui.divination.hint_done
  return messages.value.ui.divination.hint_progress.replace('{count}', lines.value.length.toString())
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

function playTossSound() {
  if (tossAudioContext) {
    tossAudioContext.stop()
    tossAudioContext.play()
  }
}

function playStopSound() {
  if (stopAudioContext) {
    stopAudioContext.stop()
    stopAudioContext.play()
  }
}

function tossOneLine() {
  if (lines.value.length >= 6) return
  if (isAnyFlipping.value) return

  // Play start sound
  playTossSound()

  // Start animation
  flippingState.value = [true, true, true]
  flippingDuration.value = [
    1 + Math.random() * 0.5 + 's',
    1 + Math.random() * 0.5 + 's',
    1 + Math.random() * 0.5 + 's'
  ]

  // Determine result
  const newCoins = tossThreeCoins()
  
  // Stop after delay
  setTimeout(() => {
    flippingState.value = [false, false, false]
    coins.value = newCoins
    
    const newLine = coinsToLine(newCoins)
    lines.value = [...lines.value, newLine]
    store.setLines(lines.value)
    
    // Play stop sound
    playStopSound()
    
    // Auto navigate if done
    if (lines.value.length === 6) {
      setTimeout(() => {
        Taro.navigateTo({ url: '/pages/result/index' })
      }, 1500)
    }
  }, 1200)
}
</script>

<style lang="scss">
@use "@/styles/tokens.scss" as *;

.page {
  height: 100vh;
  overflow: hidden;
  background: $bg-color;
  padding: 0 20px 150px;
  box-sizing: border-box;
}

.coins {
  display: flex;
  justify-content: center;
  gap: 18px;
  margin-top: 15vh;
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
  animation: coinFlip 0.2s linear infinite;
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
    transform: rotateX(1080deg);
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
  position: relative;
}

.line-marker {
  position: absolute;
  right: -24px;
  width: 20px;
  height: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #8d5a2b;
  font-weight: bold;
  z-index: 10;
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
  bottom: 120px;
}

.hint {
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
}
</style>
