'use client'

import React, { useEffect, useRef, useState } from 'react'
import * as echarts from 'echarts'

// 1. 定义数据接口
interface VehicleRecord {
  SFZRKMC: string    // 入口收费站
  SFZCKMC: string    // 出口收费站
}

interface PathFrequency {
  path: string
  frequency: number
  source: string
  target: string
}

interface SankeyNode {
  name: string
  itemStyle: {
    color: string
  }
}

interface SankeyLink {
  source: number
  target: number
  value: number
}

interface SankeyData {
  nodes: SankeyNode[]
  links: SankeyLink[]
}

// 2. 这里简单模拟一个"语言上下文"，若你没有这样的 context，可自行删改
const language = 'zh' // 或 'en'

export default function SankeyChart() {
  const chartRef = useRef<HTMLDivElement>(null)
  const [sankeyData, setSankeyData] = useState<SankeyData | null>(null)

  // ================ CSV 解析部分 ================
  // 获取 CSV 并解析成 {SFZRKMC, SFZCKMC} 数组
  async function fetchAndParseCSV(): Promise<VehicleRecord[]> {
    const response = await fetch('/data.csv')
    const csvText = await response.text()

    // 按行拆分，并去掉可能的空白行
    const lines = csvText.trim().split('\n')
    if (lines.length <= 1) {
      return []
    }

    // 取出表头，分割出各列名称
    const header = lines[0].split(',')
    const SFZRKMCIndex = header.indexOf('SFZRKMC')
    const SFZCKMCIndex = header.indexOf('SFZCKMC')

    // 如果表头没有找到这两个字段，请检查 CSV 文件列名
    if (SFZRKMCIndex === -1 || SFZCKMCIndex === -1) {
      console.error('CSV 表头中未找到 SFZRKMC 或 SFZCKMC，请检查 CSV 文件的列名！')
      return []
    }

    // 取出实际数据行
    const dataLines = lines.slice(1)

    const records: VehicleRecord[] = dataLines
      .filter(row => row.trim()) // 去除空行
      .map(row => {
        const columns = row.split(',')
        return {
          SFZRKMC: columns[SFZRKMCIndex]?.trim() || '',
          SFZCKMC: columns[SFZCKMCIndex]?.trim() || '',
        }
      })
      .filter(r => r.SFZRKMC && r.SFZCKMC && r.SFZRKMC !== '\\N' && r.SFZCKMC !== '\\N')

    return records
  }

  // ================ 生成桑基图数据 ================
  const processData = async (): Promise<SankeyData | null> => {
    try {
      const records = await fetchAndParseCSV()

      // 1. 统计路径频率
      const pathFrequencyMap = new Map<string, number>()
      records.forEach(rec => {
        const path = `${rec.SFZRKMC} -> ${rec.SFZCKMC}`
        pathFrequencyMap.set(path, (pathFrequencyMap.get(path) || 0) + 1)
      })

      // 2. 排序取前10
      const topPaths: PathFrequency[] = Array.from(pathFrequencyMap.entries())
        .map(([path, frequency]) => {
          const [source, target] = path.split(' -> ')
          return { path, frequency, source, target }
        })
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 10)

      // 3. 节点
      const uniqueNodes = Array.from(
        new Set(topPaths.flatMap(p => [p.source, p.target]))
      )

      // 4. 创建节点映射：节点名 -> 索引
      const nodeMap = new Map(uniqueNodes.map((name, idx) => [name, idx]))

      // 5. 生成 nodes & links
      const nodes: SankeyNode[] = uniqueNodes.map(name => ({
        name,
        itemStyle: {
          // 简单根据名字包含"深圳"来区别颜色
          color: name.includes('深圳') ? '#95de64' : '#69c0ff',
        }
      }))
      const rawLinks: SankeyLink[] = topPaths.map(({ source, target, frequency }) => ({
        source: nodeMap.get(source)!,
        target: nodeMap.get(target)!,
        value: frequency,
      }))

      // 6. 去除可能会形成环的边（Sankey 不允许有环）
      const links = removeCycles(rawLinks, nodes.length)

      // 7. 返回最终的桑基图数据
      return { nodes, links }
    } catch (error) {
      console.error('Error in processData:', error)
      return null
    }
  }

  // ================ 去除环的辅助函数 ================
  /**
   * 判断在已有图中，从 start 是否能到达 end
   */
  function canReach(adjList: Record<number, number[]>, start: number, end: number): boolean {
    const stack = [start]
    const visited = new Set<number>()
    while (stack.length) {
      const cur = stack.pop()!
      if (cur === end) return true
      visited.add(cur)
      for (const neighbor of adjList[cur] || []) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor)
        }
      }
    }
    return false
  }

  /**
   * 依次添加边，若添加会导致环，就跳过
   */
  function removeCycles(rawLinks: SankeyLink[], nodeCount: number): SankeyLink[] {
    const result: SankeyLink[] = []
    const adjList: Record<number, number[]> = {}
    for (let i = 0; i < nodeCount; i++) {
      adjList[i] = []
    }

    for (const link of rawLinks) {
      const { source, target } = link
      // 如果 target 已能到达 source，代表加上这条边就会形成环
      if (canReach(adjList, target, source)) {
        console.warn(`Skip edge: ${source} -> ${target} (it forms a cycle)`)
        continue
      }
      // 否则加入邻接表
      adjList[source].push(target)
      result.push(link)
    }
    return result
  }

  // ================ 计算节点层级的函数 ================
  /**
   * 基于最终的无环 links 计算每个节点的层级
   * 返回一个对象：{ [nodeName]: level }
   */
  function computeNodeLevels(nodes: SankeyNode[], links: SankeyLink[]): Record<string, number> {
    const n = nodes.length
    // 1. 统计入度
    const inDegree = new Array(n).fill(0)
    links.forEach(link => {
      inDegree[link.target]++
    })

    // 2. 初始化队列，所有入度为0的节点层级=0
    const queue: number[] = []
    const level = new Array(n).fill(0)
    for (let i = 0; i < n; i++) {
      if (inDegree[i] === 0) {
        queue.push(i)
      }
    }

    // 3. BFS 拓扑排序，每当访问一个节点时，更新相邻节点的层级
    //    并在其入度减为0时把它加入队列
    while (queue.length > 0) {
      const cur = queue.shift()!
      // 找出所有以cur为source的link
      const outEdges = links.filter(link => link.source === cur)
      outEdges.forEach(link => {
        // 以 BFS 的思路：neighbor 的 level = max(现有level, cur的level+1)
        const neighbor = link.target
        level[neighbor] = Math.max(level[neighbor], level[cur] + 1)

        // 减少neighbor的入度
        inDegree[neighbor]--
        if (inDegree[neighbor] === 0) {
          queue.push(neighbor)
        }
      })
    }

    // 4. 把 level[i] 映射回节点名称
    const nodeLevels: Record<string, number> = {}
    nodes.forEach((node, index) => {
      nodeLevels[node.name] = level[index]
    })

    return nodeLevels
  }

  // ================ 初始化 ECharts + 计算节点层级 ================
  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current)

    processData().then(data => {
      if (!data) return

      // 计算节点层级
      const nodeLevelMap = computeNodeLevels(data.nodes, data.links)
      console.log('节点层级映射 = ', nodeLevelMap)
      // 你可以把 nodeLevelMap 再写入本地 JSON 文件或存到后端
      // 这里仅在控制台打印示例

      // 准备 ECharts option
      const option = {
        title: {
          text: language === 'zh' ? '收费站流量路径分布' : 'Toll Station Flow Distribution',
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
          formatter: (params: any) => {
            if (params.dataType === 'node') {
              return `收费站: ${params.name}<br/>层级: ${nodeLevelMap[params.name]}`
            } else {
              const { source, target, value } = params.data
              const sourceName = data.nodes[source].name
              const targetName = data.nodes[target].name
              return `${sourceName} → ${targetName}<br/>流量: ${value}次`
            }
          }
        },
        series: [
          {
            type: 'sankey',
            left: '5%',
            right: '5%',
            top: '8%',
            bottom: '12%',
            nodeWidth: 11,
            nodeGap: 5,
            layoutIterations: 64,
            emphasis: { focus: 'adjacency' },
            data: data.nodes,
            links: data.links,
            orient: 'horizontal',
            label: {
              position: 'right',
              fontSize: 8,
              color: '#666',
              formatter: '{b}'
            },
            lineStyle: {
              color: 'source',
              opacity: 0.4,
              curveness: 0.5
            }
          }
        ]
      }

      chart.setOption(option)
    })

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      chart.dispose()
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // ================ 渲染 ==================
  return (
    <div 
      ref={chartRef} 
      style={{ 
        width: '100%', 
        height: '450px',
        padding: '9px 0 18px 0',
        boxSizing: 'border-box',
        marginBottom: '20px',
      }} 
    />
  )
}