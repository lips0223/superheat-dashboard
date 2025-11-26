'use client'

import { ReactNode } from 'react'
import { CaptureProvider } from '@/app/context/captureContext/useCapture'
import { Toaster } from 'sonner'

interface ClientProvidersProps {
  children: ReactNode
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <CaptureProvider>
      {children}
      {/* Toast 通知组件 */}
      <Toaster richColors position="top-right" />
    </CaptureProvider>
  )
}