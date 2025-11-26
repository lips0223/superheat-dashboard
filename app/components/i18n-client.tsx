'use client'  // 客户端组件标记

// React i18n Provider 组件
import { I18nextProvider } from 'react-i18next'
// 客户端 i18n 实例
import i18n from '@/lib/i18n-client'

// 客户端国际化 Provider 包装组件
export default function I18nClient({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  )
}