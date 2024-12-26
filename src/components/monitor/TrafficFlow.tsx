'use client'

import { useState, useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

type TimeRange = 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly'

export default function TrafficFlow() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)
  const { language } = useApp()
  const [timeRange, setTimeRange] = useState<TimeRange>('hourly')
  const t = translations[language as keyof typeof translations].monitor.trafficFlow

  // 生成时间范围数据
  const generateTimeData = (range: TimeRange) => {
    const now = new Date()
    const data = []
    
    switch (range) {
      case 'hourly':
        for (let i = 23; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 3600000)
          data.push(time.toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit' }))
        }
        break
      case 'daily':
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 86400000)
          data.push(date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }))
        }
        break
      case 'weekly':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 7 * 86400000)
          data.push(date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric' }))
        }
        break
      case 'monthly':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
          data.push(date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short' }))
        }
        break
      case 'yearly':
        for (let i = 4; i >= 0; i--) {
          data.push((now.getFullYear() - i).toString())
        }
        break
    }
    return data
  }

  // 生成流量数据
  const generateFlowData = (range: TimeRange) => {
    const baseValue = 1000
    const data = []
    const count = range === 'hourly' ? 24 : range === 'daily' ? 30 : range === 'weekly' ? 12 : range === 'monthly' ? 12 : 5

    for (let i = 0; i < count; i++) {
      let value = baseValue
      
      // 模拟不同时间段的流量特征
      switch (range) {
        case 'hourly':
          // 早晚高峰流量较大
          if ((i >= 7 && i <= 9) || (i >= 17 && i <= 19)) {
            value *= (2 + Math.random())
          } else if (i >= 23 || i <= 5) {
            value *= (0.3 + Math.random() * 0.3)
          } else {
            value *= (0.7 + Math.random())
          }
          break
        case 'daily':
          // 工作日流量较大
          value *= (0.8 + Math.random() * 0.8)
          if (i % 7 < 5) value *= 1.3
          break
        default:
          value *= (0.7 + Math.random())
      }
      
      data.push(Math.round(value))
    }
    return data
  }

  useEffect(() => {
    if (!chartRef.current) return

    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current)
    }

    const timeData = generateTimeData(timeRange)
    const flowData = generateFlowData(timeRange)

    const option = {
      title: {
        text: language === 'zh' ? '车流量统计' : 'Traffic Flow Statistics',
        textStyle: {
          color: '#666',
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: 'none'
          },
          magicType: { type: ['line', 'bar'] },
          restore: {},
          saveAsImage: {}
        },
        iconStyle: {
          borderColor: '#666'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: timeData,
        boundaryGap: true,
        axisLabel: {
          rotate: timeRange === 'daily' ? 45 : 0
        }
      },
      yAxis: {
        type: 'value',
        name: language === 'zh' ? '车流量' : 'Traffic Flow'
      },
      series: [
        {
          name: language === 'zh' ? '车流量' : 'Traffic Flow',
          type: 'line',
          data: flowData,
          smooth: true,
          showSymbol: false,
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#36DBFA' },
              { offset: 0.5, color: '#23AFDB' },
              { offset: 1, color: '#1683BC' }
            ])
          },
          areaStyle: {
            opacity: 0.3,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(54,219,250,0.5)' },
              { offset: 1, color: 'rgba(22,131,188,0.1)' }
            ])
          }
        }
      ]
    }

    chartInstance.current.setOption(option)

    // 定时更新数据
    const timer = setInterval(() => {
      const newData = generateFlowData(timeRange)
      chartInstance.current?.setOption({
        series: [{
          data: newData
        }]
      })
    }, 5000)

    const handleResize = () => {
      chartInstance.current?.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [timeRange, language])

  const timeRanges: { key: TimeRange; label: string }[] = [
    { key: 'hourly', label: t.hourly },
    { key: 'daily', label: t.daily },
    { key: 'weekly', label: t.weekly },
    { key: 'monthly', label: t.monthly },
    { key: 'yearly', label: t.yearly },
  ]

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-end space-x-2 mb-4">
        {timeRanges.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTimeRange(key)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              timeRange === key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div ref={chartRef} className="flex-1" />
    </div>
  )
} 