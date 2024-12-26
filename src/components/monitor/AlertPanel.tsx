'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

interface Alert {
  id: number
  level: 'high' | 'medium' | 'low'
  message: string
  time: string
}

export default function AlertPanel() {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].monitor.alerts
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    // 生成模拟预警数据
    const generateMockAlerts = () => {
      const alertMessages = {
        high: {
          zh: [
            '检测到车辆超速行驶',
            '发现车辆逆行',
            '收费站设备故障',
          ],
          en: [
            'Vehicle speeding detected',
            'Wrong-way driving detected',
            'Toll station equipment failure',
          ],
        },
        medium: {
          zh: [
            'ETC设备响应延迟',
            '车流量接近峰值',
            '系统负载较高',
          ],
          en: [
            'ETC device response delay',
            'Traffic flow near peak',
            'System load is high',
          ],
        },
        low: {
          zh: [
            '车辆未正确识别',
            '系统性能波动',
            '数据同步延迟',
          ],
          en: [
            'Vehicle not properly identified',
            'System performance fluctuation',
            'Data sync delay',
          ],
        },
      }

      const levels: ('high' | 'medium' | 'low')[] = ['high', 'medium', 'low']
      
      return Array.from({ length: 5 }, (_, index) => {
        const level = levels[Math.floor(Math.random() * levels.length)]
        const messages = alertMessages[level][language as keyof typeof alertMessages[typeof level]]
        const message = messages[Math.floor(Math.random() * messages.length)]
        
        return {
          id: index + 1,
          level,
          message,
          time: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(
            language === 'zh' ? 'zh-CN' : 'en-US'
          ),
        }
      }).sort((a, b) => {
        const levelPriority = { high: 3, medium: 2, low: 1 }
        return levelPriority[b.level] - levelPriority[a.level]
      })
    }

    setAlerts(generateMockAlerts())

    // 定时更新预警信息
    const timer = setInterval(() => {
      setAlerts(generateMockAlerts())
    }, 8000)

    return () => clearInterval(timer)
  }, [language])

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {t.title}
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center p-4 rounded-lg bg-gray-50 dark:bg-gray-900"
          >
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-3 ${getLevelColor(
                alert.level
              )}`}
            >
              {t.level[alert.level]}
            </span>
            <div className="flex-1">
              <p className="text-sm text-gray-900 dark:text-white">
                {alert.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {alert.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 