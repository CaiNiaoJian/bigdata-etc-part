"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import QueryForm from '@/components/query/QueryForm'
import QueryTable from '@/components/query/QueryTable'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

export type QueryData = {
  XH: string
  CP: string
  CX: string
  RKSJ: string
  CKSJ: string
  SFZRKMC: string
  SFZCKMC: string
  BZ: string
}

export default function QueryPage() {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].query
  const [queryResults, setQueryResults] = useState<QueryData[]>([])

  const handleSearch = async (formData: Partial<QueryData>) => {
    // 模拟API调用
    console.log('Search with:', formData)
    // TODO: 替换为实际的API调用
    const mockData: QueryData[] = [
      {
        XH: "001",
        CP: "浙A12345",
        CX: "小型车",
        RKSJ: "2024-01-01 08:00:00",
        CKSJ: "2024-01-01 10:30:00",
        SFZRKMC: "杭州东站",
        SFZCKMC: "绍兴北站",
        BZ: "正常通行"
      }
    ]
    setQueryResults(mockData)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-4">{t.title}</h1>
          <p className="text-gray-600 dark:text-gray-300">{t.description}</p>
        </div>

        <div className="space-y-8">
          <QueryForm onSearch={handleSearch} />
          <QueryTable data={queryResults} />
        </div>
      </motion.div>
    </div>
  )
} 