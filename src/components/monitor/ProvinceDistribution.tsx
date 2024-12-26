'use client'

import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import { useApp } from '@/context/AppContext'

export default function ProvinceDistribution() {
  const chartRef = useRef<HTMLDivElement>(null)
  const { language } = useApp()

  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current)

    // 省份数据
    const provinces = [
      '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江',
      '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南',
      '湖北', '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州',
      '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'
    ]

    const provincesEn = [
      'Beijing', 'Tianjin', 'Hebei', 'Shanxi', 'Inner Mongolia', 'Liaoning',
      'Jilin', 'Heilongjiang', 'Shanghai', 'Jiangsu', 'Zhejiang', 'Anhui',
      'Fujian', 'Jiangxi', 'Shandong', 'Henan', 'Hubei', 'Hunan', 'Guangdong',
      'Guangxi', 'Hainan', 'Chongqing', 'Sichuan', 'Guizhou', 'Yunnan',
      'Tibet', 'Shaanxi', 'Gansu', 'Qinghai', 'Ningxia', 'Xinjiang'
    ]

    // 生成模拟数据
    const generateData = () => {
      return provinces.map((_, index) => {
        // 模拟数据：沿海省份和经济发达地区车流量较大
        const baseValue = 1000
        let multiplier = 1
        if (['北京', '上海', '广东', '江苏', '浙江'].includes(provinces[index])) {
          multiplier = 2 + Math.random()
        } else if (['天津', '山东', '福建', '辽宁'].includes(provinces[index])) {
          multiplier = 1.5 + Math.random()
        } else {
          multiplier = 0.5 + Math.random()
        }
        return {
          value: Math.round(baseValue * multiplier),
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' }
            ])
          }
        }
      })
    }

    const option = {
      title: {
        text: language === 'zh' ? '省份车辆分布' : 'Vehicle Distribution by Province',
        textStyle: {
          color: '#666',
          fontSize: 16,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          const index = params[0].dataIndex
          const name = language === 'zh' ? provinces[index] : provincesEn[index]
          return `${name}: ${params[0].value}`
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
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
        data: language === 'zh' ? provinces : provincesEn,
        axisLabel: {
          interval: 0,
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: language === 'zh' ? '车辆数量' : 'Vehicle Count'
      },
      series: [
        {
          name: language === 'zh' ? '车辆数量' : 'Vehicle Count',
          type: 'bar',
          data: generateData(),
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' }
              ])
            }
          }
        }
      ]
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