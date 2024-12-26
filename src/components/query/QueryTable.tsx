"use client"

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
              {Object.keys(data[0]).map((key) => (
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
            {data.map((row, rowIndex) => (
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
    </motion.div>
  )
} 