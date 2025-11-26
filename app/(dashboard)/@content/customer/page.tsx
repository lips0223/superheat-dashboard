'use client'

import { useTranslation } from 'react-i18next'

export default function TradingPage() {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('common.menu.trading')}</h1>
        <p className="text-gray-600 mt-2">比特币交易平台</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">买入 BTC</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">数量 (BTC)</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">价格 (USD)</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0.00"
              />
            </div>
            <button className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600">
              买入
            </button>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">卖出 BTC</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">数量 (BTC)</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">价格 (USD)</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border rounded-md"
                placeholder="0.00"
              />
            </div>
            <button className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600">
              卖出
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}