// Cookie 中存储语言偏好的键名
export const LOCALE_COOKIE_NAME = 'locale'

// 国际化基础配置
export const i18n = {
  defaultLocale: 'en-US',            // 默认语言：英文
  locales: ['zh-Hans', 'en-US'],     // 支持的语言列表
} as const

// 语言类型定义，从 locales 数组中推导
export type Locale = typeof i18n['locales'][number]