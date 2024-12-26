'use client'

import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'
import { useEffect, useState } from 'react'

interface VehicleInfo {
  id: number
  plateNumber: string
  type: '小型车' | '中型车' | '大型车' | '特大型车' | '客车' | '货车'
  entryTime: string
  exitTime: string
}

// 生成随机车牌号
const generatePlateNumber = () => {
  const provinces = ['粤', '京', '沪', '浙', '苏', '鄂', '湘', '闽']
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const numbers = '0123456789'
  
  const province = provinces[Math.floor(Math.random() * provinces.length)]
  const letter = letters[Math.floor(Math.random() * letters.length)]
  const number = Array(5).fill(0).map(() => numbers[Math.floor(Math.random() * numbers.length)]).join('')
  
  return `${province}${letter}${number}`
}

// 生成随机时间
const generateTime = (baseTime: Date, rangeInMinutes: number) => {
  const randomMinutes = Math.floor(Math.random() * rangeInMinutes)
  const time = new Date(baseTime.getTime() - randomMinutes * 60000)
  return time.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
}

// 生成模拟数据池
const generateMockDataPool = (count: number): VehicleInfo[] => {
  const vehicleTypes = ['小型车', '中型车', '大型车', '特大型车', '客车', '货车'] as const
  const now = new Date()
  
  return Array(count).fill(0).map((_, index) => {
    const entryTime = generateTime(now, 120) // 在过去2小时内的随机时间
    const exitTime = generateTime(new Date(now.getTime() + 3600000), 60) // 在未来1小时内的随机时间
    
    return {
      id: index + 1,
      plateNumber: generatePlateNumber(),
      type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      entryTime,
      exitTime
    }
  })
}

export default function VehicleTable() {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].monitor.table
  const [dataPool] = useState(() => generateMockDataPool(100)) // 生成100条数据的数据池
  const [displayData, setDisplayData] = useState<VehicleInfo[]>([])
  
  useEffect(() => {
    // 更新显示数据的函数
    const updateDisplayData = () => {
      const startIndex = Math.floor(Math.random() * (dataPool.length - 8))
      setDisplayData(dataPool.slice(startIndex, startIndex + 8))
    }
    
    // 初始更新
    updateDisplayData()
    
    // 设置30秒定时更新
    const interval = setInterval(updateDisplayData, 30000)
    
    return () => clearInterval(interval)
  }, [dataPool])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.title}
          </h2>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>实时数据</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">序号</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">车牌号</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">车型</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">入站时间</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900 dark:text-white">出站时间</th>
            </tr>
          </thead>
          <tbody>
            {displayData.map((vehicle, index) => (
              <tr
                key={vehicle.id}
                className={`
                  border-b border-gray-100 dark:border-gray-700 last:border-0
                  ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'}
                `}
              >
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{index + 1}</td>
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{vehicle.plateNumber}</td>
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{vehicle.type}</td>
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{vehicle.entryTime}</td>
                <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">{vehicle.exitTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 