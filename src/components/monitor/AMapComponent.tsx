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
        zoom: 6,
        center: [116.397428, 39.90923],
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

      // 模拟车辆位置数据
      const vehicles = [
        { position: [116.397428, 39.90923], plate: '京A12345' },
        { position: [121.473701, 31.230416], plate: '沪B67890' },
        { position: [113.264385, 23.129112], plate: '粤C13579' },
        { position: [117.190182, 39.125596], plate: '津D24680' },
      ]

      // 添加车辆标记
      vehicles.forEach((vehicle) => {
        const marker = new window.AMap.Marker({
          position: vehicle.position,
          title: vehicle.plate,
          label: {
            content: vehicle.plate,
            direction: 'top',
          },
          icon: new window.AMap.Icon({
            size: new window.AMap.Size(40, 40),
            image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            imageSize: new window.AMap.Size(40, 40)
          })
        })

        map.add(marker)
      })

      // 模拟路线
      const path = [
        [116.397428, 39.90923],
        [121.473701, 31.230416],
        [113.264385, 23.129112],
        [117.190182, 39.125596],
      ]

      const polyline = new window.AMap.Polyline({
        path,
        strokeColor: '#3366FF',
        strokeWeight: 6,
        strokeOpacity: 0.8,
        showDir: true,
        lineJoin: 'round'
      })

      map.add(polyline)

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