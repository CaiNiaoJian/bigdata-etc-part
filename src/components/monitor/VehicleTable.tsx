'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

interface VehicleRecord {
  id: number
  plate: string
  type: string
  entryTime: string
  exitTime: string
  entryStation: string
  exitStation: string
  notes: string
}

export default function VehicleTable() {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].monitor.table
  const [records, setRecords] = useState<VehicleRecord[]>([])

  useEffect(() => {
    // 生成模拟数据
    const generateMockData = () => {
      // 深圳入口收费站点
      const entryStations = [
        { name: '广东罗田主线站', weight: 70 },  // 70% 概率
        { name: '广东水郎D站', weight: 15 },     // 15% 概率
        { name: '松山南湖', weight: 15 }         // 15% 概率
      ]
      
      // 车牌前缀（90% 是粤）
      const platePrefix = Math.random() < 0.9 ? '粤' : ['京', '沪', '津', '苏'][Math.floor(Math.random() * 4)]
      
      // 车型（80% 是一型车）
      const getVehicleType = () => {
        const rand = Math.random()
        if (rand < 0.8) return language === 'zh' ? '一型车' : 'Type 1'
        if (rand < 0.9) return language === 'zh' ? '二型车' : 'Type 2'
        return language === 'zh' ? '三型车' : 'Type 3'
      }
      
      // 随机生成车牌号（后三位用 * 代替，倒数第四位可能是字母）
      const generatePlate = () => {
        const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
        const numbers = '0123456789'
        const secondChar = letters[Math.floor(Math.random() * letters.length)]
        const thirdChar = Math.random() < 0.5 
          ? numbers[Math.floor(Math.random() * numbers.length)]
          : letters[Math.floor(Math.random() * letters.length)]
        const fourthChar = Math.random() < 0.5
          ? numbers[Math.floor(Math.random() * numbers.length)]
          : letters[Math.floor(Math.random() * letters.length)]
        return `${platePrefix}${secondChar}${thirdChar}${fourthChar}***`
      }
      
      // 随机选择入口收费站（基于权重）
      const getEntryStation = () => {
        const rand = Math.random() * 100
        let sum = 0
        for (const station of entryStations) {
          sum += station.weight
          if (rand < sum) return station.name
        }
        return entryStations[0].name
      }
      
      // 生成 15 条模拟数据
      return Array.from({ length: 15 }, (_, index) => {
        // 随机决定是深圳入还是深圳出
        const isEntry = Math.random() < 0.6 // 60% 是深圳入
        const now = Date.now()
        
        return {
          id: index + 1,
          plate: generatePlate(),
          type: getVehicleType(),
          // 入站时间在过去 24 小时内
          entryTime: new Date(now - Math.random() * 86400000).toLocaleString(
            language === 'zh' ? 'zh-CN' : 'en-US'
          ),
          // 出站时间在入站时间之后，但不超过 12 小时
          exitTime: new Date(now - Math.random() * 43200000).toLocaleString(
            language === 'zh' ? 'zh-CN' : 'en-US'
          ),
          entryStation: isEntry ? getEntryStation() : '广东罗田主线站',
          exitStation: isEntry ? 'null' : '深圳湾口岸',
          notes: isEntry ? '深圳入' : '深圳出'
        }
      })
    }

    setRecords(generateMockData())

    // 定时更新数据（每 10 秒更新一次）
    const timer = setInterval(() => {
      setRecords(generateMockData())
    }, 10000)

    return () => clearInterval(timer)
  }, [language])

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {language === 'zh' ? '车辆信息' : 'Vehicle Information'}
      </h3>
      <div className="flex-1 overflow-hidden">
        <div className="w-full h-full overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                {Object.values(t.columns).map((column, index) => (
                  <th
                    key={index}
                    className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    {record.id}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-900 dark:text-gray-100">
                    {record.plate}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    {record.type}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    {record.entryTime}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    {record.exitTime}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    {record.entryStation}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    {record.exitStation}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    {record.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 