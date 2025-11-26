// Next.js App Router 专用的服务端 API
import { cookies, headers } from 'next/headers'
// i18next 核心库，用于创建独立实例
import { createInstance } from 'i18next'
// 动态资源加载器，支持按需加载语言文件
import resourcesToBackend from 'i18next-resources-to-backend'
// 语言匹配器，用于匹配用户偏好语言
import { match } from '@formatjs/intl-localematcher'
// HTTP 内容协商库，解析 Accept-Language 头
import Negotiator from 'negotiator'

// 导入基础配置
import { Locale, i18n } from './index'

// 初始化服务端 i18n 实例
const initI18next = async (lng: Locale, ns: string) => {
  // 创建独立的 i18n 实例（避免服务端实例冲突）
  const i18nInstance = createInstance()
  
  await i18nInstance
    // 使用动态资源加载器，按需加载语言文件
    .use(resourcesToBackend((language: string, namespace: string) => 
      import(`../i18n/${language}/${namespace}.ts`)
    ))
    // 初始化配置
    .init({
      lng,                            // 当前语言
      ns,                            // 命名空间
      fallbackLng: i18n.defaultLocale,  // 回退语言
      supportedLngs: i18n.locales,    // 支持的语言列表
    })
    
  return i18nInstance
}

// 服务端翻译函数 - 支持 RSC 和 SSR
export async function useTranslation(lng: Locale, ns = 'common', options: Record<string, any> = {}) {
  // 初始化服务端 i18n 实例
  const i18nextInstance = await initI18next(lng, ns)
  
  return {
    // 获取固定语言的翻译函数
    t: i18nextInstance.getFixedT(lng, ns, options.keyPrefix),
    // 返回 i18n 实例（虽然服务端通常不需要）
    i18n: i18nextInstance,
  }
}

// 服务端语言检测 - 支持 RSC/SSR
export const getLocaleOnServer = async (): Promise<Locale> => {
  // 将只读的 locales 数组转为可变数组（修复 TypeScript 类型错误）
  const locales = [...i18n.locales]
  let languages: string[] = []
  
  // 第一优先级：从 Cookie 获取用户明确设置的语言偏好
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('locale')
  if (localeCookie?.value) {
    languages = [localeCookie.value]
  }

  // 第二优先级：从 HTTP 请求头获取浏览器语言偏好
  if (!languages.length) {
    const headersList = await headers()
    // 构建 negotiator 需要的 headers 对象
    const negotiatorHeaders: Record<string, string> = {}
    headersList.forEach((value, key) => (negotiatorHeaders[key] = value))
    // 解析 Accept-Language 头，获取语言偏好列表
    languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  }

  // 使用国际化标准算法匹配最佳语言
  return match(languages, locales, i18n.defaultLocale) as Locale
}