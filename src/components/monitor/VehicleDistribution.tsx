'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

export default function VehicleDistribution() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].monitor.vehicleTypes

  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current)

    const option = {
      title: {
        text: t.title,
        textStyle: {
          color: '#666',
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: [t.type1, t.type2, t.type3, t.type4, t.type5, t.type6],
        axisLabel: {
          interval: 0,
          rotate: 30,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: t.title,
          type: 'bar',
          data: [320, 480, 250, 180, 120, 90],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' },
              ]),
            },
          },
        },
      ],
    }

    chart.setOption(option)

    const handleResize = () => {
      chart.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      chart.dispose()
      window.removeEventListener('resize', handleResize)
    }
  }, [t])

  return <div ref={chartRef} className="w-full h-full" />
} 