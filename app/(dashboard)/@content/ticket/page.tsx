'use client'

import { useTranslation } from 'react-i18next'
import { setLocaleOnClient } from '@/i18n-config/client'

export default function SettingsPage() {
  const { t, i18n } = useTranslation()

  const handleLanguageChange = (locale: 'zh-Hans' | 'en-US') => {
    setLocaleOnClient(locale, false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('common.menu.settings')}</h1>
        <p className="text-gray-600 mt-2">应用设置和偏好</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">语言设置</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input 
                type="radio" 
                name="language" 
                checked={i18n.language === 'zh-Hans'}
                onChange={() => handleLanguageChange('zh-Hans')}
                className="mr-2"
              />
              简体中文
            </label>
            <label className="flex items-center">
              <input 
                type="radio" 
                name="language" 
                checked={i18n.language === 'en-US'}
                onChange={() => handleLanguageChange('en-US')}
                className="mr-2"
              />
              English
            </label>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">通知设置</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              价格提醒
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              交易通知
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              系统更新
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}