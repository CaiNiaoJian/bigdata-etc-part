'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'
import RealTimeHeader from '../../components/monitor/RealTimeHeader'
import VehicleTable from '../../components/monitor/VehicleTable'
import AlertPanel from '../../components/monitor/AlertPanel'

// 动态导入图表组件以优化性能
const AMapComponent = dynamic(() => import('../../components/monitor/AMapComponent'), { ssr: false })
const VehicleDistribution = dynamic(() => import('../../components/monitor/VehicleDistribution'), { ssr: false })
const ProvinceDistribution = dynamic(() => import('../../components/monitor/ProvinceDistribution'), { ssr: false })
const TrafficFlow = dynamic(() => import('../../components/monitor/TrafficFlow'), { ssr: false })
const HeatMap = dynamic(() => import('../../components/monitor/HeatMap'), { ssr: false })
const SankeyChart = dynamic(() => import('../../components/monitor/SankeyChart'), { ssr: false })
const TrafficPressure = dynamic(() => import('../../components/monitor/TrafficPressure'), { ssr: false })
const ShenzhenFlow = dynamic(() => import('../../components/monitor/ShenzhenFlow'), { ssr: false })

export default function MonitorPage() {
  const { language } = useApp()
  const t = translations[language as keyof typeof translations]
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟加载过程
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-16">
      <RealTimeHeader />
      <div className="container mx-auto p-4 space-y-4">
        {/* 第一行：交通压力引擎 + 地图 + 深圳入/深圳出 */}
        <div className="grid grid-cols-12 gap-4">
          {/* 左侧区域 */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {/* 交通压力引擎 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[300px]">
              <TrafficPressure />
            </div>
            {/* 车型分布 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[300px]">
              <VehicleDistribution />
            </div>
          </div>

          {/* 中央地图 */}
          <div className="col-span-12 lg:col-span-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[600px]">
            <AMapComponent />
          </div>

          {/* 右侧区域 */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            {/* 深圳入/深圳出 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[300px]">
              <ShenzhenFlow />
            </div>
            {/* 省份分布 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[300px]">
              <ProvinceDistribution />
            </div>
          </div>
        </div>

        {/* 第二行：车流量统计 + 出口流量热力图 */}
        <div className="grid grid-cols-12 gap-4">
          {/* 流量展示 */}
          <div className="col-span-12 lg:col-span-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[400px]">
            <TrafficFlow />
          </div>

          {/* 热力图 */}
          <div className="col-span-12 lg:col-span-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[400px]">
            <HeatMap />
          </div>
        </div>

        {/* 第三行：车辆信息 + 预警信息 */}
        <div className="grid grid-cols-12 gap-4">
          {/* 车辆信息表格 */}
          <div className="col-span-12 lg:col-span-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[400px] overflow-hidden">
            <VehicleTable />
          </div>

          {/* 预警信息 */}
          <div className="col-span-12 lg:col-span-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[400px]">
            <AlertPanel />
          </div>
        </div>

        {/* 第四行：广东流路径流向图 */}
        <div className="grid grid-cols-12 gap-4">
          {/* 车流路径流向图 */}
          <div className="col-span-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[400px]">
            <SankeyChart />
          </div>
        </div>
      </div>
    </div>
  )
} 