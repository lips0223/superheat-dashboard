'use client'  // 标记为客户端专用代码

// i18next 核心库
import i18n from 'i18next'
// React i18n 集成库
import { initReactI18next } from 'react-i18next'
// Cookie 操作库
import Cookies from 'js-cookie'

// 导入基础配置
import { Locale, LOCALE_COOKIE_NAME } from './index'

// 安全的动态语言资源加载函数
const requireSilent = async (lang: string, namespace: string) => {
  try {
    // 尝试加载指定语言的资源文件
    return (await import(`../i18n/${lang}/${namespace}`)).default
  } catch {
    // 加载失败时回退到英文资源
    return (await import(`../i18n/en-US/${namespace}`)).default
  }
}

// 支持的命名空间列表（简化版，只需要 common）
const NAMESPACES = ['common']

// 按需加载指定语言的所有资源
export const loadLangResources = async (lang: string) => {
  // 并行加载所有命名空间的资源文件
  const modules = await Promise.all(NAMESPACES.map(ns => requireSilent(lang, ns)))
  
  // 将加载的模块转换为资源对象
  const resources = modules.reduce((acc, mod, index) => {
    acc[NAMESPACES[index]] = mod
    return acc
  }, {} as Record<string, any>)
  
  return resources
}

// 客户端语言切换函数
export const changeLanguage = async (lng?: string) => {
  const resolvedLng = lng ?? 'en-US'  // 默认英文
  
  // 动态加载语言资源
  const resource = await loadLangResources(resolvedLng)
  
  // 如果资源未加载，则添加到 i18n 实例中
  if (!i18n.hasResourceBundle(resolvedLng, 'translation'))
    i18n.addResourceBundle(resolvedLng, 'translation', resource, true, true)
    
  // 切换到目标语言
  await i18n.changeLanguage(resolvedLng)
}

// 客户端语言设置函数（带持久化）
export const setLocaleOnClient = async (locale: Locale, reloadPage = true) => {
  // 将语言选择保存到 Cookie（365天过期）
  Cookies.set(LOCALE_COOKIE_NAME, locale, { expires: 365 })
  
  // 切换语言
  await changeLanguage(locale)
  
  // 可选择是否重新加载页面以应用更改
  reloadPage && window.location.reload()
}

// 客户端语言获取函数
export const getLocaleOnClient = (): Locale => {
  // 从 Cookie 获取语言设置，失败时回退到默认语言
  return (Cookies.get(LOCALE_COOKIE_NAME) as Locale) || 'en-US'
}