'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

const stations = [
  { id: 1, name: '广东水朗D站', weight: 0.25 },
  { id: 2, name: '广东罗田主线站', weight: 0.50 },
  { id: 3, name: '松山湖南', weight: 0.25 }
]

export default function TrafficPressure() {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].monitor
  const [currentStation, setCurrentStation] = useState(stations[0])
  const [stationPressures, setStationPressures] = useState({
    1: 0,
    2: 0,
    3: 0
  })
  const prevPressuresRef = useRef(stationPressures)
  const animationRef = useRef<number | null>(null)
  const totalFlowRef = useRef({
    1: 0,
    2: 0,
    3: 0
  })

  // 计算总车流量
  const calculateTotalFlow = (vehicleData: any) => {
    return Object.values(vehicleData).reduce((acc: number, val: any) => acc + val, 0)
  }

  // 将累计流量转换为当前压力值（0-300范围）
  const calculatePressure = (flow: number) => {
    // 使用正弦函数模拟交通压力的周期性变化
    const baseFlow = flow % 1000 // 每1000辆车一个周期
    const phase = (baseFlow / 1000) * Math.PI * 2 // 将基础流量映射到 0-2π
    const variation = Math.sin(phase) // -1 到 1 的变化
    
    // 生成 0-300 范围内的压力值
    const basePressure = 150 // 基础压力值
    const amplitude = 100 // 压力波动幅度
    const randomFactor = Math.random() * 50 // 随机因子，增加一些随机性
    
    // 计算最终压力值
    let pressure = basePressure + variation * amplitude + randomFactor
    
    // 确保压力值在 0-300 范围内
    pressure = Math.max(0, Math.min(300, pressure))
    
    return Math.floor(pressure)
  }

  // 分配车流量到各站点
  const distributeFlow = (totalFlow: number) => {
    // 更新累计流量
    totalFlowRef.current = {
      1: totalFlowRef.current[1] + Math.floor(totalFlow * stations[0].weight),
      2: totalFlowRef.current[2] + Math.floor(totalFlow * stations[1].weight),
      3: totalFlowRef.current[3] + Math.floor(totalFlow * stations[2].weight)
    }

    // 返回当前压力值
    return {
      1: calculatePressure(totalFlowRef.current[1]),
      2: calculatePressure(totalFlowRef.current[2]),
      3: calculatePressure(totalFlowRef.current[3])
    }
  }

  // 平滑动画函数
  const animatePressure = (targetPressures: any) => {
    const startTime = Date.now()
    const duration = 3000 // 3秒完成动画
    const startPressures = { ...prevPressuresRef.current }

    const animate = () => {
      const currentTime = Date.now()
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)

      // 使用缓动函数使动画更自然
      const easeProgress = 1 - Math.pow(1 - progress, 3)

      const newPressures = {
        1: Math.floor(startPressures[1] + (targetPressures[1] - startPressures[1]) * easeProgress),
        2: Math.floor(startPressures[2] + (targetPressures[2] - startPressures[2]) * easeProgress),
        3: Math.floor(startPressures[3] + (targetPressures[3] - startPressures[3]) * easeProgress)
      }

      setStationPressures(newPressures)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        prevPressuresRef.current = targetPressures
      }
    }

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    animationRef.current = requestAnimationFrame(animate)
  }

  // 监听全局车流量数据变化
  useEffect(() => {
    const handleVehicleDataUpdate = (event: CustomEvent) => {
      const vehicleData = event.detail
      const totalFlow = calculateTotalFlow(vehicleData)
      const newPressures = distributeFlow(totalFlow)
      animatePressure(newPressures)
    }

    // 注册自定义事件监听器
    window.addEventListener('vehicleDataUpdate' as any, handleVehicleDataUpdate)

    return () => {
      window.removeEventListener('vehicleDataUpdate' as any, handleVehicleDataUpdate)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // 计算当前站点的仪表盘角度
  const startAngle = -180
  const endAngle = 0
  const range = endAngle - startAngle
  const currentPressure = stationPressures[currentStation.id as keyof typeof stationPressures]
  const normalizedPressure = Math.min(100, (currentPressure / 300) * 100) // 将压力值标准化到0-100
  const currentAngle = startAngle + (range * normalizedPressure) / 100

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

  // 获取压力等级对应的颜色
  const getPressureColor = (pressure: number) => {
    if (pressure < 100) return '#52c41a'
    if (pressure < 200) return '#faad14'
    return '#ff4d4f'
  }

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
                stroke={getPressureColor(currentPressure)}
                strokeWidth="18"
                strokeLinecap="round"
                initial={false}
                animate={{ d: pathData }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
              {/* 数值文本 */}
              <motion.text
                x="100"
                y="140"
                textAnchor="middle"
                className="text-2xl font-bold fill-gray-900 dark:fill-gray-100"
                initial={false}
                animate={{ opacity: 1 }}
                key={currentPressure}
              >
                {currentPressure}
              </motion.text>
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