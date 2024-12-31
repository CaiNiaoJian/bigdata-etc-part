"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'
import type { QueryData } from '@/app/query/page'

interface QueryTableProps {
  data: QueryData[]
}

export default function QueryTable({ data }: QueryTableProps) {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].query
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // 计算分页数据
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const currentData = data.slice(startIndex, endIndex)

  // 页码变化处理
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // 每页数量变化处理
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // 重置到第一页
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center"
      >
        <p className="text-gray-500 dark:text-gray-400">{t.noData}</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {Object.keys(currentData[0]).map((key) => (
                <th
                  key={key}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap"
                >
                  {t.fields[key as keyof typeof t.fields]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentData.map((row, rowIndex) => (
              <motion.tr
                key={row.XH}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: rowIndex * 0.1 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {Object.entries(row).map(([key, value]) => (
                  <td
                    key={key}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                  >
                    {value}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分页控件 */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              每页显示
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="mx-2 rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:ring-primary focus:border-primary"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              条
            </span>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              显示 {startIndex + 1}-{endIndex} 条，共 {totalItems} 条
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上一页
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = currentPage
              if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              if (pageNum > 0 && pageNum <= totalPages) {
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === pageNum
                        ? 'bg-primary text-white'
                        : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    } transition-colors`}
                  >
                    {pageNum}
                  </button>
                )
              }
              return null
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 