import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import NutUI from '@nutui/nutui-taro'
import '@nutui/nutui-taro/dist/style.css'
import './app.scss'
import { initBgm, playBgm, pauseBgm } from '@/utils/bgmManager'
import { useSettingsStore } from '@/stores/settings'

const app = createApp({
  onLaunch() {
    initBgm()
  },
  onShow() {
    // Resume BGM when app comes to foreground
    const settings = useSettingsStore()
    if (settings.enableBgm) {
      playBgm()
    }
  },
  onHide() {
    // Pause BGM when app goes to background
    pauseBgm()
  },
  render() {
    return h('block', {}, this.$slots.default?.())
  }
})

app.use(createPinia())
app.use(NutUI)

export default app
