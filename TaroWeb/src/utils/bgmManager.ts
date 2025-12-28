import Taro from '@tarojs/taro'
import { useSettingsStore } from '@/stores/settings'
// @ts-ignore
import bgmSrc from '@/assets/bgm.mp3'

let bgmContext: Taro.InnerAudioContext | HTMLAudioElement | null = null
// Use the imported local file path
const BGM_URL = bgmSrc

const isH5 = process.env.TARO_ENV === 'h5'

export function initBgm() {
  if (bgmContext) return

  const settings = useSettingsStore()

  if (isH5) {
    // H5 Native Audio Implementation
    const audio = new Audio()
    audio.src = BGM_URL
    audio.loop = true
    // Don't autoplay - respect user settings
    audio.autoplay = false

    // Attach to window to prevent GC
    // @ts-ignore
    window._bgm = audio

    audio.addEventListener('error', (e) => {
      console.error('BGM Error:', e)
    })

    audio.addEventListener('play', () => console.log('BGM Started Playing'))
    audio.addEventListener('pause', () => console.log('BGM Paused'))
    audio.addEventListener('ended', () => {
      console.log('BGM Ended - Replaying')
      playBgm()
    })

    bgmContext = audio

    // Only try WeChat autoplay if enabled
    if (settings.enableBgm) {
      tryWeixinAutoPlay()
    }
  } else {
    // Taro / Mini Program Implementation
    bgmContext = Taro.createInnerAudioContext()
    bgmContext.src = BGM_URL
    bgmContext.loop = true
    bgmContext.autoplay = false

    bgmContext.onError((res) => {
      console.error('BGM Error:', res.errMsg, res.errCode)
    })

    bgmContext.onPlay(() => {
      console.log('BGM Started Playing')
    })

    bgmContext.onStop(() => {
      console.log('BGM Stopped')
    })

    bgmContext.onPause(() => {
      console.log('BGM Paused')
    })

    bgmContext.onEnded(() => {
      console.log('BGM Ended - Replaying')
      playBgm()
    })
  }

  // Only play if enabled
  if (settings.enableBgm) {
    playBgm()
  }
}

function tryWeixinAutoPlay() {
  // @ts-ignore
  if (typeof window !== 'undefined') {
    // @ts-ignore
    if (window.WeixinJSBridge) {
      // @ts-ignore
      window.WeixinJSBridge.invoke('getNetworkType', {}, () => {
        playBgm()
      })
    } else {
      document.addEventListener("WeixinJSBridgeReady", () => {
        playBgm()
      }, false)
    }
  }
}

export function playBgm() {
  // Check if BGM is enabled before playing
  const settings = useSettingsStore()
  if (!settings.enableBgm) {
    return // Don't play if disabled
  }

  if (!bgmContext) {
    initBgm() // Re-init if missing
  }
  if (!bgmContext) return

  if (isH5) {
    const audio = bgmContext as HTMLAudioElement
    // Ensure src is set (in case it was reset)
    if (!audio.src || audio.src === '') {
      audio.src = BGM_URL
    }
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('BGM Autoplay prevented:', err)
        // Add one-time click listener to resume
        addUnlockListener()
      })
    }
  } else {
    const ctx = bgmContext as Taro.InnerAudioContext
    if (!ctx.src) {
      ctx.src = BGM_URL
    }
    ctx.play()
  }
}

export function pauseBgm() {
  if (!bgmContext) return
  if (isH5) {
    (bgmContext as HTMLAudioElement).pause()
  } else {
    (bgmContext as Taro.InnerAudioContext).pause()
  }
}

let unlockListenerAdded = false
function addUnlockListener() {
  if (!isH5 || unlockListenerAdded) return

  const unlock = () => {
    const settings = useSettingsStore()
    if (settings.enableBgm && bgmContext) {
      console.log('User interaction detected, resuming BGM')
      playBgm()
    }
    document.removeEventListener('click', unlock)
    document.removeEventListener('touchstart', unlock)
    unlockListenerAdded = false
  }

  document.addEventListener('click', unlock, true)
  document.addEventListener('touchstart', unlock, true)
  unlockListenerAdded = true
}


export function toggleBgm(enable: boolean) {
  if (enable) {
    playBgm()
  } else {
    pauseBgm()
  }
}
