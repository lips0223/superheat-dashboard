'use client'

import React, { createContext, useContext, useCallback, ReactNode, useState, useEffect } from 'react'
import { domToBlob } from 'modern-screenshot'

// 导入闪烁效果组件
import { useScreenshotFlash } from '@/app/components/ScreenshotFlash/index'
import CaptureOverlay from '@/app/components/CaptureOverlay'

// 动画状态枚举
export enum CaptureAnimationState {
  IDLE = 'idle',           // 初始状态
  FLASHING = 'flashing',   // 闪烁阶段
  CAPTURING = 'capturing', // 遮罩显示 + 缩放动画
  SHARING = 'sharing'      // 分享面板显示
}

// 组件位置信息类型
export interface ComponentRect {
  x: number
  y: number
  width: number
  height: number
  element: HTMLElement
}

// 截图配置类型
export interface CaptureOptions {
  quality?: number
  backgroundColor?: string | null
  allowTaint?: boolean
  useCORS?: boolean
  scale?: number
  width?: number
  height?: number
  x?: number
  y?: number
  format?: 'png' | 'jpeg' | 'webp'
}

// 截图结果类型
export interface CaptureResult {
  success: boolean
  blob?: Blob
  dataUrl?: string
  error?: string
}

// Context 类型
export interface CaptureContextType {
  captureElement: (element: HTMLElement, options?: CaptureOptions) => Promise<CaptureResult>
  captureElementById: (elementId: string, options?: CaptureOptions) => Promise<CaptureResult>
  copyToClipboard: (blob: Blob) => Promise<boolean>
  downloadImage: (blob: Blob, filename?: string) => void
  // 动画序列相关
  animationState: CaptureAnimationState
  targetRect: ComponentRect | null
  capturedBlob: Blob | null
  startCaptureSequence: (element: HTMLElement, options?: CaptureOptions) => Promise<void>
  cancelCapture: () => void
  // 闪烁效果相关
  isFlashing: boolean
  triggerFlash: () => void
}

// 创建 Context
const CaptureContext = createContext<CaptureContextType | undefined>(undefined)

// Provider Props
interface CaptureProviderProps {
  children: ReactNode
  defaultOptions?: Partial<CaptureOptions>
}

// 默认配置
const DEFAULT_OPTIONS: CaptureOptions = {
  backgroundColor: '#ffffff',
  allowTaint: true,
  useCORS: true,
  scale: 2,
  quality: 0.9
}

// Provider 组件
export function CaptureProvider({ children, defaultOptions = {} }: CaptureProviderProps) {
  const [isClient, setIsClient] = useState(false)
  const mergedOptions = { ...DEFAULT_OPTIONS, ...defaultOptions }

  // 集成闪烁效果
  const { isFlashing, triggerFlash, FlashComponent } = useScreenshotFlash(800)

  // 动画状态管理
  const [animationState, setAnimationState] = useState<CaptureAnimationState>(CaptureAnimationState.IDLE)
  const [targetRect, setTargetRect] = useState<ComponentRect | null>(null)
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null)

  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true)
  }, [])

  // 核心截图方法
  const captureElement = useCallback(async (
    element: HTMLElement, 
    options: CaptureOptions = {}
  ): Promise<CaptureResult> => {
    if (!isClient) {
      return {
        success: false,
        error: '截图功能仅在客户端可用'
      }
    }

    try {
      const finalOptions = { ...mergedOptions, ...options }
      
      console.log('🚀 使用 modern-screenshot 开始截图...')
      
      // ✨ 使用 modern-screenshot - 原生支持现代 CSS
      const blob = await domToBlob(element, {
        backgroundColor: finalOptions.backgroundColor || '#ffffff',
        scale: finalOptions.scale || 2,
        width: finalOptions.width,
        height: finalOptions.height,
        style: {
          // 确保元素可见
          transform: 'none',
          opacity: '1',
        }
      })
      
      if (!blob) {
        return {
          success: false,
          error: '无法生成图片 Blob'
        }
      }
      
      console.log('✅ 截图成功,大小:', blob.size, 'bytes')
      
      // 转换为 Data URL (可选)
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.readAsDataURL(blob)
      })
      
      return {
        success: true,
        blob,
        dataUrl
      }
    } catch (error) {
      console.error('截图失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }, [mergedOptions, isClient])

  // 通过 ID 截图
  const captureElementById = useCallback(async (
    elementId: string, 
    options: CaptureOptions = {}
  ): Promise<CaptureResult> => {
    const element = document.getElementById(elementId)
    if (!element) {
      return {
        success: false,
        error: `找不到 ID 为 "${elementId}" 的元素`
      }
    }
    return captureElement(element, options)
  }, [captureElement])

  // 复制到剪贴板
  const copyToClipboard = useCallback(async (blob: Blob): Promise<boolean> => {
    if (!isClient) {
      console.warn('剪贴板功能仅在客户端可用')
      return false
    }

    try {
      if (navigator.clipboard && window.ClipboardItem) {
        const item = new ClipboardItem({ [blob.type]: blob })
        await navigator.clipboard.write([item])
        return true
      } else {
        console.warn('浏览器不支持剪贴板 API')
        return false
      }
    } catch (error) {
      console.error('复制到剪贴板失败:', error)
      return false
    }
  }, [isClient])

  // 下载图片
  const downloadImage = useCallback((blob: Blob, filename = 'screenshot.png') => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, [])

  // 获取元素位置信息
  const getElementRect = useCallback((element: HTMLElement): ComponentRect => {
    const rect = element.getBoundingClientRect()
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
      element
    }
  }, [])

  // 电影级截图序列
  const startCaptureSequence = useCallback(async (element: HTMLElement, options: CaptureOptions = {}) => {
    if (!isClient) {
      console.warn('截图功能仅在客户端可用')
      return
    }

    try {
      // 1. 获取元素位置信息
      const rect = getElementRect(element)
      setTargetRect(rect)

      // 2. 同时开始闪烁和进入捕获状态
      setAnimationState(CaptureAnimationState.FLASHING)
      triggerFlash()
      
      // 等待闪烁完成
      await new Promise(resolve => setTimeout(resolve, 800))

      // 3. 进入捕获状态（显示遮罩和缩放）
      setAnimationState(CaptureAnimationState.CAPTURING)
      
      // 等待缩放动画完成
      await new Promise(resolve => setTimeout(resolve, 800))
      
      // 4. 执行实际截图
      const result = await captureElement(element, options)
      
      if (result.success && result.blob) {
        setCapturedBlob(result.blob)
        // 5. 显示分享选项
        setAnimationState(CaptureAnimationState.SHARING)
      } else {
        // 截图失败，回到初始状态
        cancelCapture()
        throw new Error(result.error || '截图失败')
      }
    } catch (error) {
      console.error('捕获序列失败:', error)
      cancelCapture()
      throw error
    }
  }, [isClient, getElementRect, triggerFlash, captureElement])

  // 取消捕获
  const cancelCapture = useCallback(() => {
    setAnimationState(CaptureAnimationState.IDLE)
    setTargetRect(null)
    setCapturedBlob(null)
  }, [])

  const value: CaptureContextType = {
    captureElement,
    captureElementById,
    copyToClipboard,
    downloadImage,
    animationState,
    targetRect,
    capturedBlob,
    startCaptureSequence,
    cancelCapture,
    isFlashing,
    triggerFlash
  }

  return (
    <CaptureContext.Provider value={value}>
      {children}
      {/* 闪烁效果组件 - 只在客户端显示 */}
      {isClient && <FlashComponent />}
      {/* 捕获遮罩组件 - 只在客户端显示 */}
      {isClient && (
        <CaptureOverlay
          animationState={animationState}
          targetRect={targetRect}
          capturedBlob={capturedBlob}
          onCancel={cancelCapture}
          onShareComplete={cancelCapture}
        />
      )}
    </CaptureContext.Provider>
  )
}

// Hook
export function useCapture() {
  const context = useContext(CaptureContext)
  if (!context) {
    throw new Error('useCapture must be used within a CaptureProvider')
  }
  return context
}

// 便捷 Hook：带 ref 的截图
export function useCaptureRef<T extends HTMLElement = HTMLDivElement>() {
  const { captureElement, copyToClipboard, downloadImage } = useCapture()
  const ref = React.useRef<T>(null)

  const capture = useCallback(async (options?: CaptureOptions): Promise<CaptureResult> => {
    if (!ref.current) {
      return {
        success: false,
        error: 'Ref 未绑定到元素'
      }
    }
    return captureElement(ref.current, options)
  }, [captureElement])

  const captureAndCopy = useCallback(async (options?: CaptureOptions): Promise<{ success: boolean; copied?: boolean; error?: string }> => {
    const result = await capture(options)
    if (result.success && result.blob) {
      const copied = await copyToClipboard(result.blob)
      return {
        success: true,
        copied
      }
    }
    return {
      success: false,
      error: result.error
    }
  }, [capture, copyToClipboard])

  const captureAndDownload = useCallback(async (filename?: string, options?: CaptureOptions): Promise<{ success: boolean; error?: string }> => {
    const result = await capture(options)
    if (result.success && result.blob) {
      downloadImage(result.blob, filename)
      return {
        success: true
      }
    }
    return {
      success: false,
      error: result.error
    }
  }, [capture, downloadImage])

  return {
    ref,
    capture,
    captureAndCopy,
    captureAndDownload
  }
}
