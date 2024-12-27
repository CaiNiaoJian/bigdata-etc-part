'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { motion } from 'framer-motion'

type WeatherData = {
  temperature: number
  humidity: number
  windSpeed: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy'
  aqi: number
}

const weatherConditions = {
  sunny: {
    icon: '☀️',
    zh: '晴天',
    en: 'Sunny'
  },
  cloudy: {
    icon: '☁️',
    zh: '多云',
    en: 'Cloudy'
  },
  rainy: {
    icon: '🌧️',
    zh: '雨天',
    en: 'Rainy'
  },
  stormy: {
    icon: '⛈️',
    zh: '暴雨',
    en: 'Stormy'
  }
}

const getAqiLevel = (aqi: number) => {
  if (aqi <= 50) return { color: 'text-green-500', level: { zh: '优', en: 'Good' } }
  if (aqi <= 100) return { color: 'text-yellow-500', level: { zh: '良', en: 'Moderate' } }
  if (aqi <= 150) return { color: 'text-orange-500', level: { zh: '轻度污染', en: 'Unhealthy for Sensitive Groups' } }
  if (aqi <= 200) return { color: 'text-red-500', level: { zh: '中度污染', en: 'Unhealthy' } }
  if (aqi <= 300) return { color: 'text-purple-500', level: { zh: '重度污染', en: 'Very Unhealthy' } }
  return { color: 'text-rose-500', level: { zh: '严重污染', en: 'Hazardous' } }
}

export default function WeatherWidget() {
  const { language } = useApp()
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 25,
    humidity: 65,
    windSpeed: 3.5,
    condition: 'sunny',
    aqi: 45
  })

  useEffect(() => {
    // 模拟天气数据更新
    const interval = setInterval(() => {
      setWeather(prev => ({
        ...prev,
        temperature: Math.floor(Math.random() * 10) + 20,
        humidity: Math.floor(Math.random() * 30) + 50,
        windSpeed: Math.floor(Math.random() * 5) + 1,
        aqi: Math.floor(Math.random() * 100) + 1
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const aqiInfo = getAqiLevel(weather.aqi)

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        {language === 'zh' ? '天气信息' : 'Weather Info'}
      </h3>
      
      <div className="flex-1 space-y-6">
        {/* 天气状况 */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center justify-center space-x-4"
        >
          <span className="text-4xl">
            {weatherConditions[weather.condition].icon}
          </span>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {weather.temperature}°C
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              {weatherConditions[weather.condition][language as keyof typeof weatherConditions.sunny]}
            </div>
          </div>
        </motion.div>

        {/* 详细信息 */}
        <div className="space-y-4">
          {/* 湿度 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              {language === 'zh' ? '湿度' : 'Humidity'}
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {weather.humidity}%
            </span>
          </div>

          {/* 风速 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              {language === 'zh' ? '风速' : 'Wind Speed'}
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {weather.windSpeed} m/s
            </span>
          </div>

          {/* 空气质量 */}
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              {language === 'zh' ? '空气质量' : 'Air Quality'}
            </span>
            <div className="flex items-center space-x-2">
              <span className={aqiInfo.color}>{weather.aqi}</span>
              <span className="text-gray-900 dark:text-gray-100">
                ({aqiInfo.level[language as keyof typeof aqiInfo.level]})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 