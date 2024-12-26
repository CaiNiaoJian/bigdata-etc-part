'use client'

import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

type TimeRange = 'hour' | 'day' | 'week' | 'month' | 'year'

interface TimeRangeOption {
  label: string
  value: TimeRange
  interval: number // 数据点之间的间隔（分钟）
  dataPoints: number // 需要生成的数据点数量
}

const timeRangeOptions: TimeRangeOption[] = [
  { label: '1小时', value: 'hour', interval: 5, dataPoints: 12 },
  { label: '24小时', value: 'day', interval: 60, dataPoints: 24 },
  { label: '7天', value: 'week', interval: 360, dataPoints: 28 },
  { label: '30天', value: 'month', interval: 1440, dataPoints: 30 },
  { label: '1年', value: 'year', interval: 43200, dataPoints: 12 }
]

// 获取一天中的流量基准值 (0-1之间)
const getDayBaseValue = (hour: number) => {
  // 深夜和凌晨(0-5点)：很少车辆
  if (hour >= 0 && hour < 5) {
    return 0.1 + Math.random() * 0.1
  }
  // 早高峰(7-9点)：车流量大
  if (hour >= 7 && hour < 9) {
    return 0.8 + Math.random() * 0.2
  }
  // 晚高峰(17-19点)：车流量大
  if (hour >= 17 && hour < 19) {
    return 0.9 + Math.random() * 0.1
  }
  // 中午(11-14点)：中等车流量
  if (hour >= 11 && hour < 14) {
    return 0.5 + Math.random() * 0.3
  }
  // 其他时间：正常车流量
  return 0.3 + Math.random() * 0.3
}

// 获取周内流量系数 (0-1之间)
const getWeekMultiplier = (dayOfWeek: number) => {
  // 周末(周六日)：车流量大
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return 1.3 + Math.random() * 0.2
  }
  // 周五：车流量较大
  if (dayOfWeek === 5) {
    return 1.2 + Math.random() * 0.1
  }
  // 工作日：正常车流量
  return 0.9 + Math.random() * 0.2
}

// 获取月度流量系数 (0-1之间)
const getMonthMultiplier = (month: number) => {
  // 暑假期间(7-8月)：车流量大
  if (month === 6 || month === 7) {
    return 1.4 + Math.random() * 0.2
  }
  // 国庆期间(10月初)：车流量大
  if (month === 9) {
    return 1.5 + Math.random() * 0.2
  }
  // 春节期间(12-1月)：车流量大
  if (month === 11 || month === 0) {
    return 1.6 + Math.random() * 0.2
  }
  // 其他月份：正常车流量
  return 0.8 + Math.random() * 0.3
}

// 生成模拟数据
const generateMockData = (range: TimeRange) => {
  const option = timeRangeOptions.find(opt => opt.value === range)!
  const now = new Date()
  const baseValue = 200 // 基准车流量
  const data = []

  for (let i = option.dataPoints - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * option.interval * 60 * 1000)
    let value = baseValue

    switch (range) {
      case 'hour':
        // 小时视图：主要反映当前小时内的细微波动
        value *= getDayBaseValue(time.getHours())
        value *= (0.9 + Math.random() * 0.2) // 添加随机波动
        break
      
      case 'day':
        // 天视图：反映一天内的规律变化
        value *= getDayBaseValue(time.getHours())
        value *= (0.95 + Math.random() * 0.1) // 添加较小随机波动
        break
      
      case 'week':
        // 周视图：反映工作日和周末的差异
        value *= getDayBaseValue(time.getHours()) * 0.7
        value *= getWeekMultiplier(time.getDay())
        break
      
      case 'month':
        // 月视图：反映月度内的周期性变化
        value *= getWeekMultiplier(time.getDay()) * 0.8
        value *= (0.9 + Math.random() * 0.2)
        break
      
      case 'year':
        // 年视图：反映节假日和季节性变化
        value *= getMonthMultiplier(time.getMonth())
        value *= (0.9 + Math.random() * 0.2)
        break
    }

    // 确保值为整数
    value = Math.round(value)
    
    data.push({
      time: time,
      value: value
    })
  }

  return data
}

// 格式化时间
const formatTime = (date: Date, range: TimeRange) => {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  }

  switch (range) {
    case 'hour':
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    case 'day':
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    case 'week':
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit' })
    case 'month':
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    case 'year':
      return date.toLocaleDateString([], { month: 'short' })
    default:
      return date.toLocaleString()
  }
}

export default function TrafficFlow() {
  const { language } = useApp()
  const { theme } = useTheme()
  const chartRef = useRef<HTMLDivElement>(null)
  const [chart, setChart] = useState<echarts.ECharts | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>('hour')
  const [data, setData] = useState(generateMockData('hour'))
  const t = translations[language as keyof typeof translations].monitor.trafficFlow

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current) return

    const newChart = echarts.init(chartRef.current, theme === 'dark' ? 'dark' : undefined)
    setChart(newChart)

    return () => {
      newChart.dispose()
    }
  }, [theme])

  // 更新数据
  useEffect(() => {
    setData(generateMockData(timeRange))
  }, [timeRange])

  // 更新图表配置
  useEffect(() => {
    if (!chart) return

    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
            type: 'dashed'
          }
        },
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex
          const time = formatTime(data[dataIndex].time, timeRange)
          const value = params[0].value
          const unit = timeRange === 'hour' ? '辆/分钟' : '辆/小时'
          return `${time}<br/>流量：${value} ${unit}`
        }
      },
      grid: {
        top: '10%',
        left: '8%',
        right: '5%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map(item => formatTime(item.time, timeRange)),
        axisLine: {
          show: true,
          lineStyle: {
            color: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
          }
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          length: 4,
          lineStyle: {
            color: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
          }
        },
        axisLabel: {
          color: theme === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
          margin: 12,
          fontSize: 12,
          hideOverlap: true
        }
      },
      yAxis: {
        type: 'value',
        name: '车流量 (辆/分钟)',
        nameLocation: 'middle',
        nameGap: 50,
        nameTextStyle: {
          color: theme === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
          fontSize: 13,
          padding: [0, 0, 0, 0]
        },
        min: 0,
        max: (value: any) => Math.ceil(value.max * 1.2),
        splitNumber: 6,
        splitLine: {
          show: true,
          lineStyle: {
            color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            type: 'dashed',
            width: 1
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
          }
        },
        axisTick: {
          show: true,
          length: 4,
          lineStyle: {
            color: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'
          }
        },
        axisLabel: {
          show: true,
          color: theme === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
          margin: 12,
          fontSize: 12,
          formatter: '{value}'
        }
      },
      series: [
        {
          name: '车流量',
          type: 'line',
          smooth: true,
          symbol: 'none',
          sampling: 'average',
          itemStyle: {
            color: '#3182ce'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: theme === 'dark' 
                  ? 'rgba(49,130,206,0.3)'
                  : 'rgba(49,130,206,0.3)'
              },
              {
                offset: 1,
                color: theme === 'dark'
                  ? 'rgba(49,130,206,0.05)'
                  : 'rgba(49,130,206,0.05)'
              }
            ])
          },
          data: data.map(item => item.value)
        }
      ],
      animationDuration: 1000,
      animationEasing: 'cubicInOut'
    }

    chart.setOption(option)
  }, [chart, theme, data, timeRange])

  // 响应窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      chart?.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [chart])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t.title}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          {timeRangeOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setTimeRange(option.value)}
              className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
                timeRange === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div ref={chartRef} className="h-[380px] w-full transition-all duration-300" />
    </div>
  )
} 