'use client'

import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface VehicleData {
  type: '小型车' | '中型车' | '大型车' | '特大型车' | '客车' | '货车'
  value: number
}

// 模拟数据
const mockData: VehicleData[] = [
  { type: '小型车' as const, value: 38 },
  { type: '中型车' as const, value: 52 },
  { type: '大型车' as const, value: 61 },
  { type: '特大型车' as const, value: 45 },
  { type: '客车' as const, value: 48 },
  { type: '货车' as const, value: 38 }
].sort((a, b) => b.value - a.value)

export default function VehicleDistribution() {
  const { language } = useApp()
  const { theme } = useTheme()
  const chartRef = useRef<HTMLDivElement>(null)
  const [chart, setChart] = useState<echarts.ECharts | null>(null)
  const t = translations[language as keyof typeof translations].monitor.distribution

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current) return

    const newChart = echarts.init(chartRef.current, theme === 'dark' ? 'dark' : undefined)
    setChart(newChart)

    return () => {
      newChart.dispose()
    }
  }, [theme])

  // 更新图表配置
  useEffect(() => {
    if (!chart) return

    // 计算最大值，用于设置x轴范围
    const maxValue = Math.max(...mockData.map(item => item.value))
    const xAxisMax = Math.ceil(maxValue * 1.3) // 将最大值扩大30%

    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: '{b}: {c}辆'
      },
      grid: {
        top: '5%',
        left: '12%',
        right: '12%',
        bottom: '5%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: (value: any) => Math.ceil(value.max / 50) * 50, // 将最大值调整为50的倍数
        interval: 50, // 设置间隔为50
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
        splitLine: {
          show: true,
          lineStyle: {
            color: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            type: 'dashed',
            width: 1
          }
        },
        axisLabel: {
          color: theme === 'dark' ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
          margin: 12,
          fontSize: 12,
          formatter: '{value}辆'
        }
      },
      yAxis: {
        type: 'category',
        data: mockData.map(item => item.type),
        axisLine: {
          show: true,
          lineStyle: {
            color: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          }
        },
        axisTick: {
          show: true,
          length: 4,
          lineStyle: {
            color: theme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
          }
        },
        axisLabel: {
          color: theme === 'dark' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)',
          fontSize: 13,
          margin: 16,
          padding: [0, 16, 0, 0]
        }
      },
      series: [
        {
          name: '车辆数量',
          type: 'bar',
          data: mockData.map(item => ({
            value: item.value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#1a365d' },
                { offset: 1, color: '#3182ce' }
              ])
            }
          })),
          barWidth: '50%', // 减小柱子宽度
          barGap: '30%',
          showBackground: true,
          backgroundStyle: {
            color: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
            borderRadius: [0, 4, 4, 0]
          },
          itemStyle: {
            borderRadius: [0, 4, 4, 0]
          },
          label: {
            show: true,
            position: 'right',
            distance: 10,
            color: theme === 'dark' ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.85)',
            fontSize: 14,
            fontWeight: 'bold',
            formatter: '{c}辆'
          },
          emphasis: {
            itemStyle: {
              opacity: 0.9,
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.3)'
            }
          }
        }
      ],
      animationDuration: 1500,
      animationEasing: 'cubicInOut'
    }

    chart.setOption(option)
  }, [chart, theme])

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
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>实时数据</span>
        </div>
      </div>
      <div ref={chartRef} className="h-[320px] w-full transition-all duration-300" />
    </div>
  )
} 