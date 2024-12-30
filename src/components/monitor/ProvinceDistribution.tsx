'use client'

import { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'
import { useApp } from '@/context/AppContext'
import { translations } from '@/config/translations'

// 所有省份列表
const allProvinces = [
  '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江',
  '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南',
  '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州',
  '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'
]

// 省份配置及其权重
const weightedProvinces = [
  { name: '广东', weight: 0.85 },
  { name: '湖南', weight: 0.04 },
  { name: '浙江', weight: 0.035 },
  { name: '北京', weight: 0.03 },
  { name: '广西', weight: 0.025 },
  { name: '福建', weight: 0.02 }
]

// 创建权重映射
const weightMap = Object.fromEntries(weightedProvinces.map(p => [p.name, p.weight]))

interface VehicleData {
  [key: string]: number
}

export default function ProvinceDistribution() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)
  const { language } = useApp()
  const t = translations[language as keyof typeof translations].monitor
  
  // 初始数据
  const [provinceData, setProvinceData] = useState<{[key: string]: number}>(
    Object.fromEntries(allProvinces.map(p => [p, 0]))
  )

  // 计算当前最大值，并返回合适的Y轴最大值
  const calculateYAxisMax = (currentMax: number) => {
    const baseMax = 1000
    if (currentMax <= baseMax) return baseMax
    return Math.ceil(currentMax / 100) * 100
  }

  // 更新图表选项
  const updateChartOption = (chart: echarts.ECharts) => {
    // 对数据进行排序
    const sortedData = allProvinces.map(province => ({
      name: province,
      value: provinceData[province]
    })).sort((a, b) => b.value - a.value)

    const data = sortedData.map(item => item.value)
    const provinces = sortedData.map(item => item.name)
    const currentMax = Math.max(...data)
    const yAxisMax = calculateYAxisMax(currentMax)

    const option = {
      title: {
        text: language === 'zh' ? '省份车辆分布' : 'Province Distribution',
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
        formatter: function(params: any) {
          const dataIndex = params[0].dataIndex
          return `${provinces[dataIndex]}: ${params[0].value}`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true,
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          start: 0,
          end: 50,
          height: 20,
          bottom: 0,
        },
        {
          type: 'inside',
          start: 0,
          end: 50
        }
      ],
      xAxis: {
        type: 'category',
        data: provinces,
        axisLabel: {
          interval: 0,
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        max: yAxisMax
      },
      series: [
        {
          name: language === 'zh' ? '省份车辆分布' : 'Province Distribution',
          type: 'bar',
          data: data,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#91cc75' },
              { offset: 0.5, color: '#52c41a' },
              { offset: 1, color: '#52c41a' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#52c41a' },
                { offset: 0.7, color: '#52c41a' },
                { offset: 1, color: '#91cc75' },
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

    // 监听车辆数据更新事件
    const handleVehicleDataUpdate = (event: CustomEvent<VehicleData>) => {
      const vehicleData = event.detail
      // 首先计算总增长量，但限制在150以内
      let totalIncrease = Math.min(
        Object.values(vehicleData).reduce((a, b) => a + b, 0),
        150
      )

      // 如果按照权重分配后广东省的增长量会超过100，则调整总增长量
      const gdIncrease = totalIncrease * weightMap['广东']
      if (gdIncrease > 100) {
        totalIncrease = Math.floor(100 / weightMap['广东'])
      }

      setProvinceData(prev => {
        const newData = { ...prev }
        // 更新有权重的省份
        weightedProvinces.forEach(province => {
          newData[province.name] = Math.floor(
            prev[province.name] + totalIncrease * province.weight
          )
        })
        // 其他省份保持不变
        allProvinces.forEach(province => {
          if (!weightMap[province]) {
            newData[province] = prev[province]
          }
        })
        return newData
      })
    }

    window.addEventListener('vehicleDataUpdate' as any, handleVehicleDataUpdate)

    const handleResize = () => {
      chart.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      chart.dispose()
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('vehicleDataUpdate' as any, handleVehicleDataUpdate)
    }
  }, [language])

  // 当数据更新时更新图表
  useEffect(() => {
    if (chartInstanceRef.current) {
      updateChartOption(chartInstanceRef.current)
    }
  }, [provinceData, language])

  return <div ref={chartRef} className="w-full h-full" />
} 