'use client'

import { useTranslation } from 'react-i18next'
import { DeviceProvider } from './context/useDevice'
import DeviceStatsCards from './components/DeviceStatsCards'
import LocationSelector from '../../../../components/ui/LocationSelector'
import DeviceTable from './components/DeviceTable'
function DeviceContent() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6 min-w-0 max-w-full">
      {/* 页面标题和位置选择器 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal text-[#1f1f1f]">Device Management</h1>
        </div>
        <LocationSelector />
      </div>
      
      {/* 设备统计卡片 */}
      <DeviceStatsCards />
      
      {/* 设备列表区域 - 暂时占位 */}
      <div className="bg-white rounded-lg shadow min-w-0 max-w-full overflow-hidden">
        <DeviceTable />
      </div>
    </div>
  )
}

export default function DevicePage() {
  return (
    <DeviceProvider>
      <DeviceContent />
    </DeviceProvider>
  )
}