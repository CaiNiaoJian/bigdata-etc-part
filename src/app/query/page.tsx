'use client'

import { useState } from 'react'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'
import QueryBuilder from '@/components/query/QueryBuilder'
import SQLEditor from '@/components/query/SQLEditor'
import ResultTable from '@/components/query/ResultTable'

export default function QueryPage() {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].query.page
  
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [columns, setColumns] = useState<{ key: string; title: string }[]>([])

  const handleSearch = async (params: any) => {
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockData = [
        {
          CP: '粤B12345',
          CX: '小型车',
          RZSJ: '2024-01-15 08:30:00',
          CZSJ: '2024-01-15 10:45:00',
          SFZRKMC: '广州南站',
          SFZCKMC: '深圳北站',
          BZ: '正常'
        },
        {
          CP: '粤A67890',
          CX: '中型车',
          RZSJ: '2024-01-15 09:15:00',
          CZSJ: '2024-01-15 11:30:00',
          SFZRKMC: '东莞站',
          SFZCKMC: '惠州站',
          BZ: '超时'
        }
      ]
      setResults(mockData)
      setColumns([
        { key: 'CP', title: t.plateNumber },
        { key: 'CX', title: t.vehicleType },
        { key: 'RZSJ', title: t.entryTime },
        { key: 'CZSJ', title: t.exitTime },
        { key: 'SFZRKMC', title: t.entryStation },
        { key: 'SFZCKMC', title: t.exitStation },
        { key: 'BZ', title: t.notes }
      ])
    } catch (error) {
      console.error('查询失败:', error)
      setResults([])
      setColumns([])
    } finally {
      setLoading(false)
    }
  }

  const handleExecuteSQL = async (sql: string) => {
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      const mockData = [
        {
          total_count: 150,
          vehicle_type: '小型车',
          avg_time: '1.5小时'
        },
        {
          total_count: 80,
          vehicle_type: '中型车',
          avg_time: '2小时'
        }
      ]
      setResults(mockData)
      setColumns([
        { key: 'total_count', title: t.totalCount },
        { key: 'vehicle_type', title: t.vehicleType },
        { key: 'avg_time', title: t.avgTime }
      ])
    } catch (error) {
      console.error('SQL执行失败:', error)
      setResults([])
      setColumns([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        {t.title}
      </h1>

      <div className="space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t.queryBuilder}
          </h2>
          <QueryBuilder onSearch={handleSearch} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t.sqlEditor}
          </h2>
          <SQLEditor onExecute={handleExecuteSQL} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {t.queryResults}
          </h2>
          <ResultTable
            data={results}
            columns={columns}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
} 