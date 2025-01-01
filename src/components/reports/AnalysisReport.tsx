'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'

type Report = {
  id: number
  title: {
    zh: string
    en: string
  }
  content: {
    zh: string
    en: string
  }
  date: string
  type: 'warning' | 'info' | 'success'
}

const reports: Report[] = [
  {
    id: 1,
    title: {
      zh: '交通流量异常预警',
      en: 'Traffic Flow Anomaly Alert'
    },
    content: {
      zh: '根据实时监测数据显示，深圳湾口岸在过去一小时内的车流量突增45%，建议及时调配人员进行疏导。预计此高峰将持续约2小时，请相关部门做好应对准备。',
      en: 'Real-time monitoring data shows a 45% surge in traffic flow at Shenzhen Bay Port in the past hour. It is recommended to deploy personnel for traffic guidance. This peak is expected to last about 2 hours. Please prepare accordingly.'
    },
    date: '2020-12-22 14:30',
    type: 'warning'
  },
  {
    id: 2,
    title: {
      zh: '流量预测分析报告',
      en: 'Traffic Flow Forecast Analysis'
    },
    content: {
      zh: '基于深度学习模型分析，预计明日早高峰期间（7:00-9:00）各主要口岸的平均通行时间将增加15-20分钟。建议提前发布预警信息，引导车辆错峰通行。',
      en: 'Based on deep learning model analysis, the average passage time at major ports during tomorrow\'s morning peak (7:00-9:00) is expected to increase by 15-20 minutes. It is recommended to issue early warnings and guide vehicles to travel at staggered peak hours.'
    },
    date: '2020-12-20 16:00',
    type: 'info'
  },
  {
    id: 3,
    title: {
      zh: '系统优化效果报告',
      en: 'System Optimization Effect Report'
    },
    content: {
      zh: '通过实施智能车道动态分配策略，本月各口岸的平均通行效率提升23%，高峰期等待时间减少约18分钟。系统预测准确率达到92%，为交通管理决策提供了有力支持。',
      en: 'Through the implementation of intelligent lane dynamic allocation strategy, the average passage efficiency of all ports increased by 23% this month, with peak waiting time reduced by about 18 minutes. The system prediction accuracy reached 92%, providing strong support for traffic management decisions.'
    },
    date: '2020-12-20 17:15',
    type: 'success'
  }
]

export default function AnalysisReport() {
  const { language } = useApp()
  const [activeReport, setActiveReport] = useState<Report | null>(null)

  useEffect(() => {
    // 默认显示第一个报告
    setActiveReport(reports[0])
  }, [])

  const getTypeColor = (type: Report['type']) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-500 dark:text-yellow-400'
      case 'info':
        return 'text-blue-500 dark:text-blue-400'
      case 'success':
        return 'text-green-500 dark:text-green-400'
      default:
        return 'text-gray-500 dark:text-gray-400'
    }
  }

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      case 'success':
        return '✅'
      default:
        return '📝'
    }
  }

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        {language === 'zh' ? '分析报告' : 'Analysis Report'}
      </h3>
      <div className="flex-1 flex">
        {/* 报告列表 */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 pr-4 space-y-2 overflow-y-auto">
          {reports.map((report) => (
            <motion.button
              key={report.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveReport(report)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                activeReport?.id === report.id
                  ? 'bg-primary bg-opacity-10 dark:bg-opacity-20'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{getTypeIcon(report.type)}</span>
                <span className={`font-medium ${getTypeColor(report.type)}`}>
                  {report.title[language as keyof typeof report.title]}
                </span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {report.date}
              </div>
            </motion.button>
          ))}
        </div>

        {/* 报告详情 */}
        <div className="flex-1 pl-4 overflow-y-auto">
          {activeReport && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl">{getTypeIcon(activeReport.type)}</span>
                <h4 className={`text-xl font-medium ${getTypeColor(activeReport.type)}`}>
                  {activeReport.title[language as keyof typeof activeReport.title]}
                </h4>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {activeReport.date}
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {activeReport.content[language as keyof typeof activeReport.content]}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
} 