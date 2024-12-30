'use client'

import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

export default function VehicleDistribution() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].monitor.vehicleTypes
  
  // 初始数据
  const [vehicleData, setVehicleData] = useState({
    type1: 104,
    type2: 23,
    type3: 9,
    type4: 33,
    type5: 59,
    type6: 35
  })

  // 计算当前最大值，并返回合适的Y轴最大值
  const calculateYAxisMax = (currentMax: number) => {
    const baseMax = 500
    if (currentMax <= baseMax) return baseMax
    return Math.ceil(currentMax / 100) * 100
  }

  // 更新图表选项
  const updateChartOption = (chart: echarts.ECharts) => {
    const data = [
      vehicleData.type1,
      vehicleData.type2,
      vehicleData.type3,
      vehicleData.type4,
      vehicleData.type5,
      vehicleData.type6
    ]
    const currentMax = Math.max(...data)
    const yAxisMax = calculateYAxisMax(currentMax)

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
        max: yAxisMax
      },
      series: [
        {
          name: t.title,
          type: 'bar',
          data: data,
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
  }

  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current)
    chartInstanceRef.current = chart

    // 初始化图表
    updateChartOption(chart)

    // 每3秒更新数据
    const timer = setInterval(() => {
      setVehicleData(prev => ({
        type1: prev.type1 + Math.floor(Math.random() * 61 + 20), // 20-80辆
        type2: prev.type2 + (Math.random() < 0.3 ? 1 : 0), // 30%概率+1
        type3: prev.type3 + (Math.random() < 0.2 ? 1 : 0), // 20%概率+1
        type4: prev.type4 + Math.floor(Math.random() * 3 + 3), // 3-5辆
        type5: prev.type5 + (Math.random() < 0.4 ? 1 : 0), // 40%概率+1
        type6: prev.type6 + Math.floor(Math.random() * 3 + 3)  // 3-5辆
      }))
    }, 3000)

    const handleResize = () => {
      chart.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(timer)
      chart.dispose()
      window.removeEventListener('resize', handleResize)
    }
  }, [t])

  // 当数据更新时更新图表
  useEffect(() => {
    if (chartInstanceRef.current) {
      updateChartOption(chartInstanceRef.current)
    }
  }, [vehicleData, t])

  return <div ref={chartRef} className="w-full h-full" />
} 