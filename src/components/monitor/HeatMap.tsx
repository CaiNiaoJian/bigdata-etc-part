'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { useApp } from '@/context/AppContext'

export default function HeatMap() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { language } = useApp()

  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current)

    // 生成模拟数据
    const hours = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11',
      '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
    const stations = ['广东1', '广东2', '深圳3', '深圳4', '松山5', '惠州6']
    const data: [number, number, number][] = []
    const baseValue = 100

    // 生成热力图数据
    for (let i = 0; i < stations.length; i++) {
      for (let j = 0; j < hours.length; j++) {
        // 模拟高峰期（早7-9点，晚5-7点）流量较大
        let value = baseValue
        if ((j >= 7 && j <= 9) || (j >= 17 && j <= 19)) {
          value = baseValue * (1.5 + Math.random())
        } else {
          value = baseValue * (0.5 + Math.random())
        }
        data.push([j, i, Math.round(value)])
      }
    }

    const option = {
      title: {
        text: language === 'zh' ? '出口流量热力图' : 'Exit Flow Heatmap',
        left: 'center',
        textStyle: {
          color: '#666',
        },
      },
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          return `${stations[params.data[1]]} ${hours[params.data[0]]}:00<br/>
                  ${language === 'zh' ? '流量：' : 'Flow: '}${params.data[2]}`
        },
      },
      grid: {
        top: '15%',
        left: '10%',
        right: '10%',
        bottom: '15%',
      },
      xAxis: {
        type: 'category',
        data: hours,
        splitArea: {
          show: true,
        },
        axisLabel: {
          formatter: (value: string) => `${value}:00`,
        },
      },
      yAxis: {
        type: 'category',
        data: stations,
        splitArea: {
          show: true,
        },
      },
      visualMap: {
        min: 0,
        max: 300,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        textStyle: {
          color: '#666',
        },
        inRange: {
          color: ['#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf',
            '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026'],
        },
      },
      series: [{
        name: language === 'zh' ? '流量' : 'Flow',
        type: 'heatmap',
        data: data,
        label: {
          show: false,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }],
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
  }, [language])

  return <div ref={chartRef} className="w-full h-full" />
} 