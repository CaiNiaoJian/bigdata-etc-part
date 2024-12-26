'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { useApp } from '@/context/AppContext'

export default function SankeyChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { language } = useApp()

  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current)

    // 定义数据
    const data = {
      nodes: [
        // 起始高速路段
        { name: language === 'zh' ? '京港澳高速' : 'Beijing-HK-Macau', itemStyle: { color: '#ff7875' } },
        { name: language === 'zh' ? '沈海高速' : 'Shenyang-Haikou', itemStyle: { color: '#ff7875' } },
        { name: language === 'zh' ? '大广高速' : 'Daqing-Guangzhou', itemStyle: { color: '#ff7875' } },
        { name: language === 'zh' ? '长深高速' : 'Changchun-Shenzhen', itemStyle: { color: '#ff7875' } },
        // 中转节点
        { name: language === 'zh' ? '广州北站' : 'Guangzhou North', itemStyle: { color: '#69c0ff' } },
        { name: language === 'zh' ? '东莞站' : 'Dongguan', itemStyle: { color: '#69c0ff' } },
        { name: language === 'zh' ? '惠州站' : 'Huizhou', itemStyle: { color: '#69c0ff' } },
        // 深圳关口
        { name: language === 'zh' ? '深圳湾口岸' : 'Shenzhen Bay Port', itemStyle: { color: '#95de64' } },
        { name: language === 'zh' ? '皇岗口岸' : 'Huanggang Port', itemStyle: { color: '#95de64' } },
        { name: language === 'zh' ? '福田口岸' : 'Futian Port', itemStyle: { color: '#95de64' } },
        { name: language === 'zh' ? '莲塘口岸' : 'Liantang Port', itemStyle: { color: '#95de64' } }
      ],
      links: [
        // 从高速到中转站
        { source: 0, target: 4, value: 3000 },
        { source: 0, target: 5, value: 2500 },
        { source: 1, target: 5, value: 2800 },
        { source: 1, target: 6, value: 2200 },
        { source: 2, target: 4, value: 2600 },
        { source: 2, target: 6, value: 2400 },
        { source: 3, target: 5, value: 2700 },
        { source: 3, target: 6, value: 2300 },
        // 从中转站到口岸
        { source: 4, target: 7, value: 2000 },
        { source: 4, target: 8, value: 1800 },
        { source: 5, target: 8, value: 2200 },
        { source: 5, target: 9, value: 1900 },
        { source: 6, target: 9, value: 1700 },
        { source: 6, target: 10, value: 1500 }
      ]
    }

    const option = {
      title: {
        text: language === 'zh' ? '广东流路径流向图' : 'Guangdong Traffic Flow Path',
        left: 'center',
        top: 10,
        textStyle: {
          color: '#666',
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove',
        formatter: function(params: any) {
          if (params.dataType === 'node') {
            return params.name
          }
          return `${params.data.source} → ${params.data.target}<br/>流量: ${params.data.value}`
        }
      },
      series: [{
        type: 'sankey',
        left: '10%',
        right: '10%',
        top: '12%',
        bottom: '12%',
        nodeWidth: 20,
        nodeGap: 12,
        layoutIterations: 64,
        emphasis: {
          focus: 'adjacency'
        },
        data: data.nodes,
        links: data.links,
        orient: 'horizontal',
        label: {
          position: 'right',
          fontSize: 10,
          color: '#666',
          formatter: function(params: any) {
            return params.name.length > 4 ? params.name.substring(0, 4) + '..' : params.name
          }
        },
        lineStyle: {
          color: 'source',
          opacity: 0.4,
          curveness: 0.5
        }
      }]
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