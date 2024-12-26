'use client'

import { useEffect, useRef } from 'react'
import { useApp } from '@/context/AppContext'

declare global {
  interface Window {
    AMap: any
    _AMapSecurityConfig: {
      securityJsCode: string
    }
  }
}

export default function AMapComponent() {
  const mapRef = useRef<HTMLDivElement>(null)
  const { language } = useApp()

  useEffect(() => {
    // 加载高德地图脚本
    const loadAMap = () => {
      return new Promise<void>((resolve) => {
        if (window.AMap) {
          resolve()
          return
        }

        // 设置安全密钥
        window._AMapSecurityConfig = {
          securityJsCode: '2ef59afe0bd4fbf33ca615540768a7a5',
        }

        const script = document.createElement('script')
        script.src = `https://webapi.amap.com/maps?v=2.0&key=84d50b8d0e8cbaca8e8be1a750c1c7d9&language=${
          language === 'zh' ? 'zh_cn' : 'en'
        }&plugin=AMap.Scale,AMap.ToolBar,AMap.ControlBar,AMap.Traffic`
        script.async = true
        script.onload = () => resolve()
        document.head.appendChild(script)
      })
    }

    // 初始化地图
    const initMap = async () => {
      await loadAMap()

      if (!mapRef.current || !window.AMap) return

      const map = new window.AMap.Map(mapRef.current, {
        zoom: 5,
        center: [113.264385, 30.129112],
        viewMode: '3D',
        mapStyle: 'amap://styles/whitesmoke',
      })

      // 添加控件
      map.addControl(new window.AMap.Scale())
      map.addControl(new window.AMap.ToolBar({
        position: 'RB'
      }))
      map.addControl(new window.AMap.ControlBar({
        position: {
          right: '40px',
          top: '10px'
        }
      }))

      // 定义主要高速公路路线
      const highways = [
        {
          name: '京港澳高速',
          path: [
            [116.405285, 39.904989], // 北京
            [113.665412, 34.757975], // 郑州
            [112.982279, 28.19409],  // 长沙
            [113.280637, 23.125178], // 广州
            [114.085947, 22.547]     // 深圳
          ]
        },
        {
          name: '沈海高速',
          path: [
            [123.429096, 41.796767], // 沈阳
            [117.190182, 39.125596], // 天津
            [120.153576, 30.287459], // 杭州
            [119.306239, 26.075302], // 福州
            [114.085947, 22.547]     // 深圳
          ]
        },
        {
          name: '大广高速',
          path: [
            [112.549248, 37.857014], // 太原
            [113.665412, 34.757975], // 郑州
            [112.982279, 28.19409],  // 长沙
            [113.280637, 23.125178], // 广州
            [114.085947, 22.547]     // 深圳
          ]
        },
        {
          name: '渝深高速',
          path: [
            [104.065735, 30.659462], // 成都
            [110.299121, 25.274215], // 桂林
            [113.280637, 23.125178], // 广州
            [114.085947, 22.547]     // 深圳
          ]
        }
      ]

      // 添加高速公路路线
      highways.forEach(highway => {
        const polyline = new window.AMap.Polyline({
          path: highway.path,
          strokeColor: '#1890ff',
          strokeWeight: 8,
          strokeOpacity: 0.6,
          showDir: true,
          lineJoin: 'round',
          lineCap: 'round',
          strokeStyle: 'solid',
          zIndex: 1
        })

        // 添加高速公路名称标签
        const midPoint = Math.floor(highway.path.length / 2)
        const label = new window.AMap.Text({
          text: highway.name,
          position: highway.path[midPoint],
          offset: new window.AMap.Pixel(0, -20),
          style: {
            'background-color': '#1890ff',
            'border-width': 0,
            'text-align': 'center',
            'font-size': '12px',
            'color': '#fff',
            'padding': '3px 6px',
            'border-radius': '3px'
          }
        })

        map.add([polyline, label])
      })

      // 定义城市坐标
      const cities = [
        { name: '深圳', position: [114.085947, 22.547], isDestination: true },
        { name: '合肥', position: [117.227239, 31.820587] },
        { name: '郑州', position: [113.665412, 34.757975] },
        { name: '桂林', position: [110.299121, 25.274215] },
        { name: '长沙', position: [112.982279, 28.19409] },
        { name: '杭州', position: [120.153576, 30.287459] },
        { name: '兰州', position: [103.823557, 36.058039] },
        { name: '太原', position: [112.549248, 37.857014] },
        { name: '广州', position: [113.280637, 23.125178] },
        { name: '东莞', position: [113.751765, 23.020536] },
        { name: '惠州', position: [114.412599, 23.079404] },
        { name: '北京', position: [116.405285, 39.904989] },
        { name: '天津', position: [117.190182, 39.125596] },
        { name: '福州', position: [119.306239, 26.075302] },
        { name: '沈阳', position: [123.429096, 41.796767] },
        { name: '成都', position: [104.065735, 30.659462] }
      ]

      // 添加城市标记
      cities.forEach((city) => {
        const marker = new window.AMap.Marker({
          position: city.position,
          title: city.name,
          label: {
            content: city.name,
            direction: 'top',
          },
          icon: new window.AMap.Icon({
            size: new window.AMap.Size(40, 40),
            image: city.isDestination ? 
              'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png' : 
              'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            imageSize: new window.AMap.Size(40, 40)
          }),
          zIndex: 2
        })

        map.add(marker)
      })

      // 定义路线
      const routes = [
        { start: '合肥', end: '深圳', color: '#ff4d4f' },
        { start: '郑州', end: '深圳', color: '#ffa940' },
        { start: '桂林', end: '深圳', color: '#73d13d' },
        { start: '长沙', end: '深圳', color: '#40a9ff' },
        { start: '杭州', end: '深圳', color: '#9254de' },
        { start: '兰州', end: '深圳', color: '#f759ab' },
        { start: '太原', end: '深圳', color: '#36cfc9' },
        { start: '北京', end: '深圳', color: '#597ef7' },
        { start: '天津', end: '深圳', color: '#ffd666' },
        { start: '福州', end: '深圳', color: '#ff85c0' },
        { start: '沈阳', end: '深圳', color: '#bae637' },
        { start: '成都', end: '深圳', color: '#69c0ff' }
      ]

      // 添加路线
      routes.forEach((route) => {
        const startCity = cities.find(city => city.name === route.start)
        const endCity = cities.find(city => city.name === route.end)
        if (startCity && endCity) {
          const midCity = cities.find(city => 
            ['广州', '东莞', '惠州'][Math.floor(Math.random() * 3)] === city.name
          )
          
          const path = midCity ? 
            [startCity.position, midCity.position, endCity.position] :
            [startCity.position, endCity.position]

          const polyline = new window.AMap.Polyline({
            path,
            strokeColor: route.color,
            strokeWeight: 3,
            strokeOpacity: 0.6,
            showDir: true,
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 3
          })

          map.add(polyline)
        }
      })

      // 添加交通流量图层
      const trafficLayer = new window.AMap.Traffic({
        zIndex: 10
      })
      map.add(trafficLayer)
    }

    initMap()
  }, [language])

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
} 