'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

const stations = [
  { id: 1, name: '广东水朗D站' },
  { id: 2, name: '广东罗田主线站' },
  { id: 3, name: '松山湖南' }
]

export default function TrafficPressure() {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].monitor
  const [currentStation, setCurrentStation] = useState(stations[0])
  const [pressure, setPressure] = useState(0)

  // 模拟实时数据更新
  useEffect(() => {
    const timer = setInterval(() => {
      setPressure(Math.floor(Math.random() * 65 + 30)) // 30-90范围内的随机数
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  // 计算仪表盘角度
  const startAngle = -180
  const endAngle = 0
  const range = endAngle - startAngle
  const currentAngle = startAngle + (range * pressure) / 100

  // 计算圆弧路径
  const radius = 80
  const centerX = 100
  const centerY = 100
  const startRad = (startAngle * Math.PI) / 180
  const endRad = (currentAngle * Math.PI) / 180

  const startX = centerX + radius * Math.cos(startRad)
  const startY = centerY + radius * Math.sin(startRad)
  const endX = centerX + radius * Math.cos(endRad)
  const endY = centerY + radius * Math.sin(endRad)

  const largeArcFlag = Math.abs(currentAngle - startAngle) > 180 ? 1 : 0

  const pathData = `
    M ${startX} ${startY}
    A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
  `

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          交通压力引擎
        </h3>
        <div className="flex space-x-2">
          {stations.map((station) => (
            <motion.button
              key={station.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentStation(station)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                currentStation.id === station.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {station.name}
            </motion.button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStation.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <svg width="200" height="200" viewBox="0 0 200 200">
              {/* 背景圆弧 */}
              <path
                d="M 20 100 A 80 80 0 1 1 180 100"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="18"
                strokeLinecap="round"
                className="dark:stroke-gray-700"
              />
              {/* 进度圆弧 */}
              <motion.path
                d={pathData}
                fill="none"
                stroke={pressure >= 40 ? '#ff4d4f' : '#52c41a'}
                strokeWidth="18"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
              {/* 数值文本 */}
              <text
                x="100"
                y="140"
                textAnchor="middle"
                className="text-2xl font-bold fill-gray-900 dark:fill-gray-100"
              >
                {pressure}
              </text>
              <text
                x="100"
                y="160"
                textAnchor="middle"
                className="text-sm fill-gray-500 dark:fill-gray-400"
              >
                辆/分
              </text>
            </svg>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
} 