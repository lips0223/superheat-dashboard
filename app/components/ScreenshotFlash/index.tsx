'use client'

import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ScreenshotFlashProps {
  isVisible: boolean
  onComplete?: () => void
  duration?: number
  className?: string
}

export default function ScreenshotFlash({ 
  isVisible, 
  onComplete, 
  duration = 800,
  className = ''
}: ScreenshotFlashProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isVisible) {
      // 闪烁完成后调用回调
      const timer = setTimeout(() => {
        onComplete?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onComplete])

  if (!mounted || !isVisible) return null

  return createPortal(
    <div
      className={`
        fixed inset-0 z-[9999] pointer-events-none
        bg-white/90 animate-screenshot-flash
        ${className}
      `}
      style={{
        '--flash-duration': `${duration}ms`,
        animationFillMode: 'forwards'
      } as React.CSSProperties}
    />,
    document.body
  )
}

// 导出用于在其他地方使用的 Hook
export function useScreenshotFlash(duration = 800) {
  const [isFlashing, setIsFlashing] = useState(false)

  const triggerFlash = () => {
    setIsFlashing(true)
  }

  const handleFlashComplete = () => {
    setIsFlashing(false)
  }

  const FlashComponent = () => (
    <ScreenshotFlash
      isVisible={isFlashing}
      onComplete={handleFlashComplete}
      duration={duration}
    />
  )

  return {
    isFlashing,
    triggerFlash,
    FlashComponent
  }
}