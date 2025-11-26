'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { CaptureAnimationState, ComponentRect } from '@/app/context/captureContext/useCapture'
import ClonedComponent from './ClonedComponent'
import SharePanel from './SharePanel'

interface CaptureOverlayProps {
  animationState: CaptureAnimationState
  targetRect: ComponentRect | null
  capturedBlob: Blob | null
  onCancel: () => void
  onShareComplete?: () => void
}

export default function CaptureOverlay({
  animationState,
  targetRect,
  capturedBlob,
  onCancel,
  onShareComplete
}: CaptureOverlayProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 处理 ESC 键取消
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel()
      }
    }

    if (mounted && animationState !== CaptureAnimationState.IDLE) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [mounted, animationState, onCancel])

  // 处理背景点击取消
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel()
    }
  }

  // 只在 CAPTURING 和 SHARING 状态下显示遮罩
  const shouldRender = mounted && 
    (animationState === CaptureAnimationState.CAPTURING || 
     animationState === CaptureAnimationState.SHARING)

  if (!shouldRender) {
    return null
  }

  return createPortal(
    <div
      className={`
        fixed inset-0 z-[9998] 
        bg-black/60 backdrop-blur-sm
        flex items-center justify-center
        ${animationState === CaptureAnimationState.CAPTURING ? 'animate-mask-scale' : ''}
      `}
      onClick={handleBackgroundClick}
    >
      {/* 克隆组件容器 */}
      {targetRect && (
        <ClonedComponent
          targetRect={targetRect}
          animationState={animationState}
        />
      )}

      {/* 分享面板 */}
      {animationState === CaptureAnimationState.SHARING && capturedBlob && (
        <SharePanel
          blob={capturedBlob}
          onClose={onCancel}
          onShareComplete={onShareComplete}
        />
      )}

      {/* 取消按钮 */}
      {animationState !== CaptureAnimationState.SHARING && (
        <button
          onClick={onCancel}
          className={`
            absolute top-4 right-4 z-10
            w-10 h-10 rounded-full 
            bg-white/20 hover:bg-white/30
            backdrop-blur-md
            flex items-center justify-center
            text-white hover:text-gray-200
            transition-all duration-300 ease-out
          `}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>,
    document.body
  )
}