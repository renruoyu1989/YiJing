import { createApp, h } from 'vue'
import { createPinia } from 'pinia'
import NutUI from '@nutui/nutui-taro'
import '@nutui/nutui-taro/dist/style.css'
import './app.scss'

const app = createApp({
  onShow() {},
  onHide() {},
  render() {
    return h('block', {}, this.$slots.default?.())
  }
})

app.use(createPinia())
app.use(NutUI)

export default app
