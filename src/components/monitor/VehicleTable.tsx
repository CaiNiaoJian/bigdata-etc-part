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
      const stations = ['站点A', 'Station A', '站点B', 'Station B', '站点C', 'Station C']
      const plates = ['京A12345', '沪B67890', '粤C13579', '津D24680']
      const types = ['一型车', 'Type 1', '二型车', 'Type 2', '三型车', 'Type 3']
      
      return Array.from({ length: 10 }, (_, index) => ({
        id: index + 1,
        plate: plates[Math.floor(Math.random() * plates.length)],
        type: language === 'zh' 
          ? types[Math.floor(Math.random() * types.length)].replace(/Type \d/, match => 
              match.replace('Type', '').trim() + '型车')
          : types[Math.floor(Math.random() * types.length)].replace(/[一二三]型车/, match =>
              'Type ' + '一二三'.indexOf(match[0]) + 1),
        entryTime: new Date(Date.now() - Math.random() * 86400000).toLocaleString(
          language === 'zh' ? 'zh-CN' : 'en-US'
        ),
        exitTime: new Date(Date.now() - Math.random() * 43200000).toLocaleString(
          language === 'zh' ? 'zh-CN' : 'en-US'
        ),
        entryStation: language === 'zh'
          ? stations[Math.floor(Math.random() * stations.length)].replace(/Station/, '站点')
          : stations[Math.floor(Math.random() * stations.length)].replace(/站点/, 'Station'),
        exitStation: language === 'zh'
          ? stations[Math.floor(Math.random() * stations.length)].replace(/Station/, '站点')
          : stations[Math.floor(Math.random() * stations.length)].replace(/站点/, 'Station'),
        notes: language === 'zh' ? '正常' : 'Normal'
      }))
    }

    setRecords(generateMockData())

    // 定时更新数据
    const timer = setInterval(() => {
      setRecords(generateMockData())
    }, 10000)

    return () => clearInterval(timer)
  }, [language])

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {Object.values(t.columns).map((column, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {records.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {record.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {record.plate}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {record.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {record.entryTime}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {record.exitTime}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {record.entryStation}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {record.exitStation}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {record.notes}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 