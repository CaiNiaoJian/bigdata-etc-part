'use client'

import { useApp } from '@/context/AppContext'
import WeatherWidget from '@/components/reports/WeatherWidget'
import StationFlowForecast from '@/components/reports/StationFlowForecast'
import TimeSeriesFlow from '@/components/reports/TimeSeriesFlow'
import AnalysisReport from '@/components/reports/AnalysisReport'

export default function ReportsPage() {
  const { language } = useApp()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-4 space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {language === 'zh' ? '分析报告' : 'Analysis Reports'}
        </h2>
        
        <div className="grid grid-cols-12 gap-4">
          {/* 天气组件 */}
          <div className="col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <WeatherWidget />
          </div>

          {/* 站点流量预测 */}
          <div className="col-span-9 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            <StationFlowForecast />
          </div>

          {/* 时间序列流量 */}
          <div className="col-span-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[400px]">
            <TimeSeriesFlow />
          </div>

          {/* 分析报告 */}
          <div className="col-span-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[400px]">
            <AnalysisReport />
          </div>
        </div>
      </div>
    </div>
  )
} 