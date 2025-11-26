'use client'  // 客户端专用代码

// i18next 核心库
import i18n from 'i18next'
// React i18n 集成
import { initReactI18next } from 'react-i18next'
// 语言资源加载函数
import { loadLangResources } from '../i18n-config/client'

// 客户端 i18n 初始化函数
const initI18n = async () => {
  // 防止重复初始化
  if (!i18n.isInitialized) {
    // 预加载中英文资源（首屏优化）
    const zhResources = await loadLangResources('zh-Hans')
    const enResources = await loadLangResources('en-US')

    await i18n
      // 使用 React i18n 集成
      .use(initReactI18next)
      // 初始化配置
      .init({
        lng: 'en-US',                // 默认语言
        fallbackLng: 'en-US',        // 回退语言
        // 预加载的语言资源
        resources: {
          'zh-Hans': { translation: zhResources },
          'en-US': { translation: enResources },
        },
        interpolation: {
          escapeValue: false,        // React 已经防 XSS，不需要转义
        },
        react: {
          useSuspense: false,        // 不使用 Suspense（避免 SSR 问题）
        },
      })
  }
}

// 立即执行初始化
initI18n()

// 导出 i18n 实例供组件使用
export default i18n