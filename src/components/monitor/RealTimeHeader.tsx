'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

export default function RealTimeHeader() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const { language } = useApp()
  const t = translations[language as keyof typeof translations]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', options)
  }

  return (
    <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md shadow-lg p-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold gradient-text mb-2 md:mb-0">
          {t.monitor.title}
        </h1>
        <div className="flex items-center space-x-4">
          <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {formatDate(currentTime)}
          </div>
        </div>
      </div>
    </div>
  )
} 