"use client"

import { useState, useEffect } from 'react'
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
  const [allData, setAllData] = useState<QueryData[]>([])

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/etc_data.json')
        const data = await response.json()
        setAllData(data.map((item: any) => ({
          XH: item.xh,
          CP: item.cp,
          CX: item.cx,
          RKSJ: item.rksj,
          CKSJ: item.cksj,
          SFZRKMC: item.sfzrkmc,
          SFZCKMC: item.sfzckmc,
          BZ: item.bz
        })))
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
    loadData()
  }, [])

  const handleSearch = async (formData: Partial<QueryData>) => {
    // 过滤数据
    const filteredData = allData.filter(item => {
      return Object.entries(formData).every(([key, value]) => {
        if (!value) return true // 空值不过滤
        const itemValue = item[key as keyof QueryData]
        if (key === 'RKSJ' || key === 'CKSJ') {
          // 时间范围匹配
          return itemValue.startsWith(value)
        }
        // 模糊匹配
        return itemValue.toLowerCase().includes(value.toLowerCase())
      })
    })
    
    // 限制返回数量，避免数据量过大
    setQueryResults(filteredData.slice(0, 100))
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