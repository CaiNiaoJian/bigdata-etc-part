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
      <div className="container mx-auto p-4 grid grid-cols-12 gap-4">
        {/* 中央地图 */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[500px]">
          <AMapComponent />
        </div>

        {/* 车型分布 */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[500px]">
          <VehicleDistribution />
        </div>

        {/* 省份分布 */}
        <div className="col-span-12 lg:col-span-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[400px]">
          <ProvinceDistribution />
        </div>

        {/* 流量展示 */}
        <div className="col-span-12 lg:col-span-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[400px]">
          <TrafficFlow />
        </div>

        {/* 热力图 */}
        <div className="col-span-12 lg:col-span-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[400px]">
          <HeatMap />
        </div>

        {/* 车辆信息表格 */}
        <div className="col-span-12 lg:col-span-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[400px] overflow-hidden">
          <VehicleTable />
        </div>

        {/* 预警信息 */}
        <div className="col-span-12 lg:col-span-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <AlertPanel />
        </div>

        {/* 车流路径流向图 */}
        <div className="col-span-12 lg:col-span-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-[400px]">
          <SankeyChart />
        </div>
      </div>
    </div>
  )
} 