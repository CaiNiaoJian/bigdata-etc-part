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
  const { language, theme } = useApp()
  const isDark = theme === 'dark'

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
        }&plugin=AMap.Scale,AMap.ToolBar,AMap.ControlBar,AMap.TileLayer.Traffic,AMap.MoveAnimation`
        script.async = true
        script.onload = () => resolve()
        document.head.appendChild(script)
      })
    }

    // 创建动态标记
    const createMovingMarker = (map: any, path: number[][], isToShenzhen: boolean) => {
      const marker = new window.AMap.Marker({
        map: map,
        position: path[0],
        icon: new window.AMap.Icon({
          size: new window.AMap.Size(12, 12),
          image: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12">
              <circle cx="6" cy="6" r="6" fill="${isToShenzhen ? '#52c41a' : '#faad14'}" />
            </svg>
          `)}`,
          imageSize: new window.AMap.Size(12, 12)
        }),
        offset: new window.AMap.Pixel(-6, -6),
        zIndex: 100,
        angle: 0
      })

      // 计算路径角度
      const lineAngle = Math.atan2(
        path[1][1] - path[0][1],
        path[1][0] - path[0][0]
      ) * 180 / Math.PI

      marker.setAngle(lineAngle)

      const passedPath: number[][] = []
      let currentIndex = 0
      let isMoving = true

      const moveMarker = () => {
        if (!isMoving) return

        const start = path[currentIndex]
        const end = path[currentIndex + 1]
        
        if (!start || !end) {
          marker.setMap(null)
          return
        }

        const duration = 5000 // 5秒通过一段路径
        const startTime = Date.now()
        
        const animate = () => {
          if (!isMoving) return

          const currentTime = Date.now()
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)

          const currentPosition = [
            start[0] + (end[0] - start[0]) * progress,
            start[1] + (end[1] - start[1]) * progress
          ]

          marker.setPosition(currentPosition)
          passedPath.push(currentPosition)

          if (progress < 1) {
            requestAnimationFrame(animate)
          } else {
            currentIndex++
            if (currentIndex < path.length - 1) {
              // 计算下一段路径的角度
              const nextAngle = Math.atan2(
                path[currentIndex + 1][1] - path[currentIndex][1],
                path[currentIndex + 1][0] - path[currentIndex][0]
              ) * 180 / Math.PI
              marker.setAngle(nextAngle)
              moveMarker()
            } else {
              marker.setMap(null)
            }
          }
        }

        animate()
      }

      moveMarker()

      return () => {
        isMoving = false
        marker.setMap(null)
      }
    }

    // 初始化地图
    const initMap = async () => {
      await loadAMap()

      if (!mapRef.current || !window.AMap) return

      const map = new window.AMap.Map(mapRef.current, {
        zoom: 5,
        center: [113.264385, 30.129112],
        viewMode: '3D',
        mapStyle: isDark ? 'amap://styles/dark' : 'amap://styles/normal',
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
          strokeColor: isDark ? '#177ddc' : '#1890ff',
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
            'background-color': isDark ? '#177ddc' : '#1890ff',
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

      // 自定义标记样式
      const createMarkerIcon = (isDestination: boolean) => {
        const color = isDestination ? 
          (isDark ? '#177ddc' : '#1890ff') : 
          (isDark ? '#177ddc80' : '#1890ff80')
        
        const svg = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}">
            <path d="M12 0C7.589 0 4 3.589 4 8c0 5.5 8 16 8 16s8-10.5 8-16c0-4.411-3.589-8-8-8zm0 12c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z"/>
          </svg>
        `
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
      }

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
            size: new window.AMap.Size(24, 24),
            image: createMarkerIcon(!!city.isDestination),
            imageSize: new window.AMap.Size(24, 24)
          }),
          offset: new window.AMap.Pixel(-12, -24),
          zIndex: 2
        })

        map.add(marker)
      })

      // 定义路线并添加动态效果
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

      // 添加路线和动态效果
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

          // 添加静态路线
          const polyline = new window.AMap.Polyline({
            path,
            strokeColor: isDark ? 
              route.color.replace(/ff/g, 'cc') : 
              route.color,
            strokeWeight: 3,
            strokeOpacity: 0.6,
            showDir: true,
            lineJoin: 'round',
            lineCap: 'round',
            zIndex: 3
          })

          map.add(polyline)

          // 添加动态车流效果
          const addMovingMarker = () => {
            const isToShenzhen = Math.random() > 0.3 // 70%概率前往深圳
            const actualPath = isToShenzhen ? path : [...path].reverse()
            createMovingMarker(map, actualPath, isToShenzhen)
          }

          // 每隔随机时间（3-8秒）添加一个新的动态标记
          setInterval(addMovingMarker, Math.random() * 5000 + 3000)
        }
      })

      // 添加交通流量图层
      const trafficLayer = new window.AMap.TileLayer.Traffic({
        zIndex: 10,
        zooms: [3, 20]
      })
      
      map.add(trafficLayer)
    }

    initMap()
  }, [language, theme])

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
} 