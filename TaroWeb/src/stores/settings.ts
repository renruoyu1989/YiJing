import { defineStore } from 'pinia'
import Taro from '@tarojs/taro'
import { toggleBgm } from '@/utils/bgmManager'

export const useSettingsStore = defineStore('settings', {
  state: () => {
    const storedBgm = Taro.getStorageSync('enableBgm')
    // Handle empty string (missing key) case
    const enableBgm = (storedBgm === '' || storedBgm === null || storedBgm === undefined) ? true : storedBgm
    
    return {
      enableBgm,
      language: Taro.getStorageSync('language') || 'zh-TW' // 'zh-CN' | 'zh-TW'
    }
  },
  actions: {
    setEnableBgm(val: boolean) {
      this.enableBgm = val
      Taro.setStorageSync('enableBgm', val)
      toggleBgm(val)
    },
    setLanguage(val: string) {
      this.language = val
      Taro.setStorageSync('language', val)
    }
  }
})
