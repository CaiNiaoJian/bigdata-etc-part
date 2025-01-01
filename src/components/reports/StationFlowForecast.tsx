'use client'

import { useEffect, useRef, useState } from 'react'
import { useApp } from '@/context/AppContext'
import * as echarts from 'echarts'
import ReactECharts from 'echarts-for-react'

type Station = {
  id: number
  name: {
    zh: string
    en: string
  }
}

const stations: Station[] = [
  { id: 1, name: { zh: '广东水郎D站', en: 'Shenzhen Bay Port' } },
  { id: 2, name: { zh: '松山南湖', en: 'Futian Port' } },
  { id: 3, name: { zh: '广东罗田', en: 'Huanggang Port' } }
]

const generateForecastData = () => {
  const now = new Date()
  const data = []
  
  for (let i = 0; i < 24; i++) {
    const time = new Date(now.getTime() + i * 3600000)
    const hour = time.getHours()
    
    // 模拟不同时段的流量变化
    let baseFlow = 1000
    if (hour >= 7 && hour <= 9) baseFlow = 2000 // 早高峰
    else if (hour >= 17 && hour <= 19) baseFlow = 1800 // 晚高峰
    else if (hour >= 0 && hour <= 5) baseFlow = 500 // 凌晨
    
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', hour12: false }),
      '广东水郎D站': Math.floor(baseFlow * (1 + Math.random() * 0.3)),
      '松山南湖': Math.floor(baseFlow * 0.8 * (1 + Math.random() * 0.3)),
      '广东罗田': Math.floor(baseFlow * 0.6 * (1 + Math.random() * 0.3))
    })
  }
  
  return data
}

export default function StationFlowForecast() {
  const { language } = useApp()
  const chartRef = useRef<ReactECharts>(null)
  const data = generateForecastData()
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'))
    
    // 监听主题变化
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

    return () => observer.disconnect()
  }, [])

  const getOption = () => ({
    title: {
      text: language === 'zh' ? '24小时流量预测' : '24-Hour Flow Forecast',
      textStyle: {
        color: isDarkMode ? '#ffffff' : '#1f2937',
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        let result = `${params[0].axisValue}<br/>`
        params.forEach((param: any) => {
          const station = stations.find(s => s.name.zh === param.seriesName)
          const stationName = station ? station.name[language as keyof typeof station.name] : param.seriesName
          result += `${stationName}: ${param.value}<br/>`
        })
        return result
      }
    },
    legend: {
      data: stations.map(station => station.name.zh),
      formatter: (name: string) => {
        const station = stations.find(s => s.name.zh === name)
        return station ? station.name[language as keyof typeof station.name] : name
      },
      textStyle: {
        color: isDarkMode ? '#ffffff' : '#1f2937'
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
      data: data.map(item => item.time),
      axisLabel: {
        color: isDarkMode ? '#ffffff' : '#1f2937'
      },
      axisLine: {
        lineStyle: {
          color: isDarkMode ? '#ffffff' : '#1f2937'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: language === 'zh' ? '车流量 (辆/小时)' : 'Traffic Flow (vehicles/hour)',
      nameTextStyle: {
        color: isDarkMode ? '#ffffff' : '#1f2937'
      },
      axisLabel: {
        color: isDarkMode ? '#ffffff' : '#1f2937'
      },
      axisLine: {
        lineStyle: {
          color: isDarkMode ? '#ffffff' : '#1f2937'
        }
      }
    },
    series: stations.map(station => ({
      name: station.name.zh,
      type: 'line',
      smooth: true,
      data: data.map(item => item[station.name.zh as keyof typeof item]),
      showSymbol: false,
      emphasis: {
        focus: 'series'
      }
    }))
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
        {language === 'zh' ? '站点流量预测' : 'Station Flow Forecast'}
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