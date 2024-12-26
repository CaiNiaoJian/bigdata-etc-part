'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

export default function ShenzhenFlow() {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].monitor
  const [inFlow, setInFlow] = useState(0)
  const [outFlow, setOutFlow] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      // 每5秒更新一次，增加3-50辆车
      setInFlow(prev => prev + Math.floor(Math.random() * 48 + 3))
      setOutFlow(prev => prev + Math.floor(Math.random() * 48 + 3))
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const FlowItem = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
    >
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{label}</div>
      <motion.div
        key={value}
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`text-2xl font-bold ${color}`}
      >
        {value.toLocaleString()}
      </motion.div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">今日累计</div>
    </motion.div>
  )

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        深圳入/深圳出
      </h3>
      <div className="flex-1 flex flex-col justify-center space-y-4">
        <FlowItem
          label="进入深圳"
          value={inFlow}
          color="text-emerald-500"
        />
        <FlowItem
          label="离开深圳"
          value={outFlow}
          color="text-blue-500"
        />
      </div>
    </div>
  )
} 