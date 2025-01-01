'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

export default function ShenzhenFlow() {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].monitor
  const [inFlow, setInFlow] = useState(0)
  const [outFlow, setOutFlow] = useState(0)
  const [inFlowIncrement, setInFlowIncrement] = useState(0)
  const [outFlowIncrement, setOutFlowIncrement] = useState(0)

  useEffect(() => {
    const handleVehicleDataUpdate = (event: CustomEvent) => {
      const vehicleData = event.detail
      const totalFlow = Object.values(vehicleData).reduce((acc: number, val: any) => acc + val, 0)
      
      // 限制总流量增长不超过150
      const limitedTotalFlow = Math.min(totalFlow, 150)
      
      // 计算深圳入/出的增量
      const inFlowInc = Math.floor(limitedTotalFlow * 0.55)
      const outFlowInc = limitedTotalFlow - inFlowInc

      // 设置增量显示
      setInFlowIncrement(inFlowInc)
      setOutFlowIncrement(outFlowInc)
      
      // 更新累计流量
      setInFlow(prev => prev + inFlowInc)
      setOutFlow(prev => prev + outFlowInc)
    }

    // 注册自定义事件监听器
    window.addEventListener('vehicleDataUpdate' as any, handleVehicleDataUpdate)

    return () => {
      window.removeEventListener('vehicleDataUpdate' as any, handleVehicleDataUpdate)
    }
  }, [])

  const FlowItem = ({ label, value, increment, color }: { label: string; value: number; increment: number; color: string }) => (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm"
    >
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{label}</div>
      <div className="flex items-baseline space-x-2">
        <motion.div
          key={value}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`text-2xl font-bold ${color}`}
        >
          {value.toLocaleString()}
        </motion.div>
        {increment > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            +{increment}
          </motion.div>
        )}
      </div>
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
          increment={inFlowIncrement}
          color="text-emerald-500"
        />
        <FlowItem
          label="离开深圳"
          value={outFlow}
          increment={outFlowIncrement}
          color="text-blue-500"
        />
      </div>
    </div>
  )
} 
