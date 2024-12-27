'use client'

import { useEffect, useRef } from 'react'
import { useApp } from '@/context/AppContext'
import ReactECharts from 'echarts-for-react'

const generateTimeSeriesData = () => {
  const now = new Date()
  const data = []
  
  // 生成过去7天的数据
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 3600000)
    const dayOfWeek = date.getDay()
    
    // 工作日和周末的基础流量不同
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const baseFlow = isWeekend ? 15000 : 20000
    
    data.push({
      date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      actual: Math.floor(baseFlow * (1 + Math.random() * 0.2)),
      predicted: Math.floor(baseFlow * (1 + Math.random() * 0.2))
    })
  }
  
  // 生成未来7天的预测数据
  for (let i = 1; i <= 7; i++) {
    const date = new Date(now.getTime() + i * 24 * 3600000)
    const dayOfWeek = date.getDay()
    
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const baseFlow = isWeekend ? 15000 : 20000
    
    data.push({
      date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      predicted: Math.floor(baseFlow * (1 + Math.random() * 0.2))
    })
  }
  
  return data
}

export default function TimeSeriesFlow() {
  const { language } = useApp()
  const chartRef = useRef<ReactECharts>(null)
  const data = generateTimeSeriesData()

  const getOption = () => ({
    title: {
      text: language === 'zh' ? '时间序列流量预测' : 'Time Series Flow Prediction',
      textStyle: {
        color: language === 'zh' ? '#1f2937' : '#111827',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any[]) => {
        let result = `${params[0].axisValue}<br/>`
        params.forEach(param => {
          const value = param.value || '-'
          const name = language === 'zh'
            ? param.seriesName === 'Actual' ? '实际流量' : '预测流量'
            : param.seriesName
          result += `${name}: ${value}<br/>`
        })
        return result
      }
    },
    legend: {
      data: [
        { name: 'Actual', textStyle: { color: language === 'zh' ? '#1f2937' : '#111827' } },
        { name: 'Predicted', textStyle: { color: language === 'zh' ? '#1f2937' : '#111827' } }
      ],
      formatter: (name: string) => {
        if (language === 'zh') {
          return name === 'Actual' ? '实际流量' : '预测流量'
        }
        return name
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
      boundaryGap: false,
      data: data.map(item => item.date),
      axisLine: {
        lineStyle: {
          color: language === 'zh' ? '#1f2937' : '#111827'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: language === 'zh' ? '总流量 (辆/天)' : 'Total Flow (vehicles/day)',
      axisLine: {
        lineStyle: {
          color: language === 'zh' ? '#1f2937' : '#111827'
        }
      }
    },
    series: [
      {
        name: 'Actual',
        type: 'line',
        data: data.map(item => item.actual),
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: '#10B981'
        },
        emphasis: {
          focus: 'series'
        }
      },
      {
        name: 'Predicted',
        type: 'line',
        data: data.map(item => item.predicted),
        smooth: true,
        showSymbol: false,
        itemStyle: {
          color: '#3B82F6'
        },
        emphasis: {
          focus: 'series'
        }
      }
    ]
  })

  useEffect(() => {
    if (chartRef.current) {
      const chart = chartRef.current.getEchartsInstance()
      chart.setOption(getOption())
    }
  }, [language])

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
        {language === 'zh' ? '时间序列流量预测' : 'Time Series Flow Prediction'}
      </h3>
      <div className="flex-1">
        <ReactECharts
          ref={chartRef}
          option={getOption()}
          style={{ height: '100%', width: '100%' }}
        />
      </div>
    </div>
  )
} 