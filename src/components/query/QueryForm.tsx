"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'
import type { QueryData } from '@/app/query/page'

interface QueryFormProps {
  onSearch: (formData: Partial<QueryData>) => void
}

export default function QueryForm({ onSearch }: QueryFormProps) {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].query
  const [formData, setFormData] = useState<Partial<QueryData>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(formData)
  }

  const handleInputChange = (field: keyof QueryData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleReset = () => {
    setFormData({})
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 车牌号 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.fields.CP}
            </label>
            <input
              type="text"
              value={formData.CP || ''}
              onChange={(e) => handleInputChange('CP', e.target.value)}
              className="query-input"
              placeholder={t.placeholders.CP}
            />
          </div>

          {/* 车型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.fields.CX}
            </label>
            <input
              type="text"
              value={formData.CX || ''}
              onChange={(e) => handleInputChange('CX', e.target.value)}
              className="query-input"
              placeholder={t.placeholders.CX}
            />
          </div>

          {/* 入站时间 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.fields.RKSJ}
            </label>
            <input
              type="datetime-local"
              value={formData.RKSJ || ''}
              onChange={(e) => handleInputChange('RKSJ', e.target.value)}
              className="query-input"
            />
          </div>

          {/* 出站时间 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.fields.CKSJ}
            </label>
            <input
              type="datetime-local"
              value={formData.CKSJ || ''}
              onChange={(e) => handleInputChange('CKSJ', e.target.value)}
              className="query-input"
            />
          </div>

          {/* 入口收费站 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.fields.SFZRKMC}
            </label>
            <input
              type="text"
              value={formData.SFZRKMC || ''}
              onChange={(e) => handleInputChange('SFZRKMC', e.target.value)}
              className="query-input"
              placeholder={t.placeholders.SFZRKMC}
            />
          </div>

          {/* 出口收费站 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.fields.SFZCKMC}
            </label>
            <input
              type="text"
              value={formData.SFZCKMC || ''}
              onChange={(e) => handleInputChange('SFZCKMC', e.target.value)}
              className="query-input"
              placeholder={t.placeholders.SFZCKMC}
            />
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t.fields.BZ}
            </label>
            <input
              type="text"
              value={formData.BZ || ''}
              onChange={(e) => handleInputChange('BZ', e.target.value)}
              className="query-input"
              placeholder={t.placeholders.BZ}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {t.buttons.reset}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            {t.buttons.search}
          </motion.button>
        </div>
      </form>
    </motion.div>
  )
} 