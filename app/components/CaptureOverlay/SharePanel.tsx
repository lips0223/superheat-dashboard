'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Download, Copy, X } from 'lucide-react'
import { toast } from 'sonner'

interface SharePanelProps {
  blob: Blob
  onClose: () => void
  onShareComplete?: () => void
}

export default function SharePanel({
  blob,
  onClose,
  onShareComplete
}: SharePanelProps) {
  
  // 复制到剪贴板
  const handleCopy = async () => {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type]: blob })
      ])
      toast.success('截图已复制到剪贴板！')
      onShareComplete?.()
    } catch (error) {
      toast.error('复制失败，请重试')
    }
  }

  // 下载图片
  const handleDownload = () => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.download = `screenshot-${Date.now()}.png`
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('截图开始下载！')
    onShareComplete?.()
  }

  // 分享（如果支持）
  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        const file = new File([blob], 'screenshot.png', { type: blob.type })
        await navigator.share({
          files: [file],
          title: '分享截图',
          text: '查看我的截图'
        })
        toast.success('分享成功！')
        onShareComplete?.()
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          toast.error('分享失败')
        }
      }
    } else {
      toast.info('您的浏览器不支持分享功能')
    }
  }

  // 创建预览图片 URL
  const [previewUrl, setPreviewUrl] = React.useState<string>('')
  const [debugInfo, setDebugInfo] = React.useState<string>('')

  React.useEffect(() => {
    if (blob) {
      console.log('收到 Blob:', {
        size: blob.size,
        type: blob.type,
      });
      
      setDebugInfo(`Blob 大小: ${blob.size} bytes, 类型: ${blob.type}`);
      
      // 检查 blob 是否为空
      if (blob.size === 0) {
        console.error('警告: Blob 大小为 0!');
        setDebugInfo('错误: Blob 大小为 0');
        return;
      }

      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      console.log('预览图片 URL 已创建:', url)
      
      // 清理函数
      return () => {
        URL.revokeObjectURL(url)
      }
    }
  }, [blob])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* 背景遮罩 - 点击关闭 */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      
      {/* 面板内容 */}
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full mx-4 animate-in slide-in-from-bottom-4 duration-300">
        {/* 标题 */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
            <Share2 className="h-5 w-5 text-blue-500" />
            分享截图
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        {/* 预览图片 */}
        <div className="mb-4 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
          {previewUrl ? (
            <>
              <img
                src={previewUrl}
                alt="截图预览"
                className="w-full h-40 object-contain"
                onError={(e) => {
                  console.error('图片加载失败:', e)
                  toast.error('图片预览加载失败')
                }}
                onLoad={(e) => {
                  const img = e.target as HTMLImageElement;
                  console.log('图片预览加载成功, 尺寸:', img.naturalWidth, 'x', img.naturalHeight)
                }}
              />
              {debugInfo && (
                <div className="text-xs text-gray-500 p-2 text-center">
                  {debugInfo}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-40 flex flex-col items-center justify-center text-gray-400">
              <span>加载预览中...</span>
              {debugInfo && (
                <span className="text-xs mt-2 text-red-500">{debugInfo}</span>
              )}
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="space-y-2">
          <Button
            onClick={handleCopy}
            className="w-full flex items-center gap-2"
            variant="default"
          >
            <Copy className="h-4 w-4" />
            复制到剪贴板
          </Button>
          
          <Button
            onClick={handleDownload}
            className="w-full flex items-center gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            下载图片
          </Button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <Button
              onClick={handleShare}
              className="w-full flex items-center gap-2"
              variant="outline"
            >
              <Share2 className="h-4 w-4" />
              分享
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}