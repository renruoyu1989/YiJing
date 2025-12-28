import zhCN from '@/locales/zh-CN'
import zhTW from '@/locales/zh-TW'

export type Locale = 'zh-CN' | 'zh-TW'
export type I18nSchema = typeof zhCN

const messages: Record<string, I18nSchema> = {
  'zh-CN': zhCN,
  'zh-TW': zhTW
}

export function getLocaleMessages(lang: string): I18nSchema {
  return messages[lang] || messages['zh-CN']
}
