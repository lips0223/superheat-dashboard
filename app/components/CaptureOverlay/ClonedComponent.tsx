'use client'

import React, { useEffect, useState } from 'react'
import { CaptureAnimationState, ComponentRect } from '@/app/context/captureContext/useCapture'

interface ClonedComponentProps {
  targetRect: ComponentRect
  animationState: CaptureAnimationState
}

export default function ClonedComponent({
  targetRect,
  animationState
}: ClonedComponentProps) {
  const [mounted, setMounted] = useState(false)
  const [clonedContent, setClonedContent] = useState('')

  useEffect(() => {
    setMounted(true)
  }, [])

  // 克隆目标元素的内容
  useEffect(() => {
    if (mounted && targetRect.element) {
      // 克隆元素并获取其 HTML
      const cloned = targetRect.element.cloneNode(true) as HTMLElement
      
      // 移除可能的 ID 重复
      const removeIds = (element: HTMLElement) => {
        element.removeAttribute('id')
        Array.from(element.children).forEach(child => {
          if (child instanceof HTMLElement) {
            removeIds(child)
          }
        })
      }
      removeIds(cloned)
      
      setClonedContent(cloned.outerHTML)
    }
  }, [mounted, targetRect.element])

  // 计算变换属性 - 居中并缩放到80%
  const getTransformStyle = () => {
    if (!targetRect) return {}

    const screenCenterX = window.innerWidth / 2
    const screenCenterY = window.innerHeight / 2
    
    // 原始位置（相对于视窗）
    const originalCenterX = targetRect.x + targetRect.width / 2
    const originalCenterY = targetRect.y + targetRect.height / 2
    
    // 计算需要移动的距离
    const translateX = screenCenterX - originalCenterX
    const translateY = screenCenterY - originalCenterY
    
    // 在 CAPTURING 和 SHARING 状态下缩放到80%
    const scale = animationState === CaptureAnimationState.CAPTURING || 
                  animationState === CaptureAnimationState.SHARING ? 0.8 : 1

    return {
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      transformOrigin: 'center center'
    }
  }

  if (!mounted) return null

  // 在分享状态下隐藏克隆组件
  if (animationState === CaptureAnimationState.SHARING) {
    return null
  }

  return (
    <div
      className="absolute z-10 pointer-events-none transition-transform duration-800 ease-out opacity-100"
      style={{
        left: targetRect.x,
        top: targetRect.y,
        width: targetRect.width,
        height: targetRect.height,
        ...getTransformStyle()
      }}
    >
      {/* 高亮边框效果 */}
      <div 
        className={`
          absolute inset-0 rounded-lg
          ${animationState === CaptureAnimationState.CAPTURING
            ? 'ring-2 ring-white/50 shadow-2xl' : ''
          }
        `}
      />
      
      {/* 克隆的组件内容 */}
      <div
        className={`
          w-full h-full rounded-lg overflow-hidden
          ${animationState === CaptureAnimationState.CAPTURING
            ? 'bg-white/90 backdrop-blur-sm' : 'bg-transparent'
          }
        `}
        dangerouslySetInnerHTML={{ __html: clonedContent }}
      />
      
      {/* 发光效果 */}
      {animationState === CaptureAnimationState.CAPTURING && (
        <div className="absolute inset-0 rounded-lg shadow-white/25 shadow-2xl pointer-events-none" />
      )}
    </div>
  )
}