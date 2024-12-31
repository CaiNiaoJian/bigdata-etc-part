# ETC 大数据可视化监控平台前后端连接技术文档

## 目录
1. [整体架构](#整体架构)
2. [数据流设计](#数据流设计)
3. [监控大厅模块](#监控大厅模块)
4. [分析报告模块](#分析报告模块)
5. [交互查询模块](#交互查询模块)
6. [状态管理](#状态管理)
7. [性能优化](#性能优化)
8. [安全性考虑](#安全性考虑)
9. [JSON数据交互设计](#JSON数据交互设计)

## 整体架构

### 技术栈对接
```typescript
// 前端技术栈
interface FrontendStack {
  framework: 'Next.js 13'
  stateManagement: 'React Context'
  dataVisualization: 'ECharts'
  mapService: 'AMap'
  styling: 'TailwindCSS'
  animation: 'Framer Motion'
}

// 后端技术栈
interface BackendStack {
  database: 'MySQL + Mycat'
  cache: 'Redis'
  messageQueue: 'Kafka'
  realtime: 'WebSocket + SSE'
  orm: 'TypeORM'
}
```

### 数据通信方式
1. **HTTP/REST**: 常规数据请求
2. **WebSocket**: 实时数据更新
3. **SSE**: 服务器推送事件
4. **消息队列**: 异步数据处理

## 数据流设计

### 1. 实时数据流
```typescript
interface RealTimeDataFlow {
  // WebSocket连接管理
  websocket: {
    url: string
    reconnectAttempts: number
    reconnectInterval: number
    heartbeatInterval: number
  }
  
  // SSE配置
  sse: {
    endpoint: string
    eventTypes: string[]
    reconnectTime: number
  }
  
  // 数据更新策略
  updateStrategy: {
    throttleTime: number
    batchSize: number
    priority: 'realtime' | 'batch'
  }
}
```

### 2. 状态同步机制
```typescript
interface StateSyncStrategy {
  // 乐观更新配置
  optimisticUpdate: {
    enabled: boolean
    rollbackStrategy: 'immediate' | 'queue'
  }
  
  // 状态一致性策略
  consistency: {
    type: 'eventual' | 'strong'
    syncInterval: number
    conflictResolution: 'server' | 'client' | 'merge'
  }
}
```

## 监控大厅模块

### 1. 地图组件数据流
```typescript
interface MapDataFlow {
  // 初始化数据
  initialization: {
    mapConfig: MapConfig
    initialViewport: Viewport
    layerConfigs: LayerConfig[]
  }
  
  // 实时数据更新
  realtime: {
    vehiclePositions: {
      updateInterval: number
      batchSize: number
      dataFormat: VehiclePosition[]
    }
    trafficFlow: {
      updateInterval: number
      aggregationLevel: 'road' | 'area' | 'city'
    }
  }
}

// 车辆位置更新
interface VehiclePosition {
  XH: number
  CP: string
  coordinates: [number, number]
  speed: number
  direction: number
  timestamp: string
}
```

### 2. 统计图表数据流
```typescript
interface ChartDataFlow {
  // 交通压力数据
  trafficPressure: {
    endpoint: '/api/monitor/traffic-pressure'
    updateInterval: 3000
    aggregation: {
      method: 'average'
      timeWindow: 300 // 5分钟
    }
  }
  
  // 车型分布数据
  vehicleDistribution: {
    endpoint: '/api/monitor/vehicle-distribution'
    updateInterval: 5000
    cacheStrategy: {
      enabled: true
      duration: 60000
    }
  }
  
  // 省份分布数据
  provinceDistribution: {
    endpoint: '/api/monitor/province-distribution'
    updateInterval: 10000
    dataTransform: (data: ProvinceData[]) => TransformedData
  }
}
```

### 3. 实时告警系统
```typescript
interface AlertSystem {
  // WebSocket订阅配置
  subscription: {
    channel: 'monitor.alerts'
    filters: {
      minLevel: 'medium'
      categories: string[]
    }
  }
  
  // 告警处理
  handling: {
    autoAcknowledge: boolean
    displayDuration: number
    maxDisplayCount: number
    soundEnabled: boolean
  }
}
```

## 分析报告模块

### 1. 天气组件集成
```typescript
interface WeatherIntegration {
  // 数据获取配置
  dataFetch: {
    endpoint: '/api/reports/weather'
    updateInterval: 300000 // 5分钟
    retryStrategy: {
      attempts: 3
      backoff: 'exponential'
    }
  }
  
  // 数据处理
  processing: {
    temperatureUnit: 'celsius'
    windSpeedUnit: 'm/s'
    forecast: {
      hours: 24
      interval: 3600
    }
  }
}
```

### 2. 预测模型数据流
```typescript
interface PredictionDataFlow {
  // 站点流量预测
  stationFlow: {
    endpoint: '/api/reports/station-flow-forecast'
    updateInterval: 900000 // 15分钟
    predictionWindow: {
      hours: 24
      resolution: 'hourly'
    }
  }
  
  // 时间序列预测
  timeSeries: {
    endpoint: '/api/reports/time-series'
    updateInterval: 3600000 // 1小时
    aggregation: {
      method: 'average'
      window: '1h'
    }
  }
}
```

## 交互查询模块

### 1. 查询接口集成
```typescript
interface QueryIntegration {
  // 数据查询配置
  query: {
    endpoint: '/api/query/vehicles'
    timeout: 30000
    maxResults: 1000
    defaultPageSize: 15
  }
  
  // 查询缓存策略
  caching: {
    enabled: true
    duration: 300000 // 5分钟
    keyGenerator: (params: QueryParams) => string
  }
  
  // 数据验证
  validation: {
    CP: /^[\u4e00-\u9fa5][A-Z0-9]{6}$/
    CX: string[]
    timeRange: {
      maxDays: 31
      minDate: '2020-01-01'
    }
  }
}
```

### 2. 数据展示组件
```typescript
interface DataDisplay {
  // 表格配置
  table: {
    columns: TableColumn[]
    sorting: {
      enabled: true
      defaultField: 'RKSJ'
      defaultOrder: 'desc'
    }
    pagination: {
      position: 'bottom'
      showSizeChanger: true
      showQuickJumper: true
    }
  }
  
  // 导出功能
  export: {
    formats: ['xlsx', 'csv']
    maxExportSize: 10000
    rateLimiting: {
      maxRequests: 5
      timeWindow: 3600000
    }
  }
}
```

## 状态管理

### 1. 全局状态设计
```typescript
interface GlobalState {
  // 用户状态
  user: {
    token: string
    permissions: string[]
    preferences: UserPreferences
  }
  
  // 应用状态
  app: {
    language: 'zh' | 'en'
    theme: 'light' | 'dark'
    notifications: Notification[]
  }
  
  // 系统状态
  system: {
    connectionStatus: ConnectionStatus
    lastSync: string
    errors: SystemError[]
  }
}
```

### 2. 状态更新机制
```typescript
interface StateUpdateMechanism {
  // 状态变更追踪
  tracking: {
    enabled: boolean
    history: {
      maxSize: number
      persistent: boolean
    }
  }
  
  // 状态同步
  sync: {
    strategy: 'immediate' | 'debounced' | 'periodic'
    debounceTime?: number
    syncInterval?: number
  }
}
```

## 性能优化

### 1. 数据加载优化
```typescript
interface DataLoadOptimization {
  // 预加载策略
  preload: {
    enabled: boolean
    routes: string[]
    components: string[]
  }
  
  // 懒加载配置
  lazyLoad: {
    threshold: number
    placeholder: ComponentType
    errorBoundary: ComponentType
  }
  
  // 数据缓存
  caching: {
    storage: 'memory' | 'localStorage' | 'sessionStorage'
    maxAge: number
    maxSize: number
  }
}
```

### 2. 渲染优化
```typescript
interface RenderOptimization {
  // 虚拟滚动
  virtualScroll: {
    enabled: boolean
    itemHeight: number
    overscan: number
  }
  
  // 防抖节流
  throttling: {
    scroll: number
    resize: number
    search: number
  }
}
```

## 安全性考虑

### 1. 数据安全
```typescript
interface DataSecurity {
  // 数据脱敏
  masking: {
    CP: (value: string) => string
    sensitiveFields: string[]
  }
  
  // 传输加密
  encryption: {
    algorithm: 'AES-256-GCM'
    keyRotation: number
  }
}
```

### 2. 访问控制
```typescript
interface AccessControl {
  // 权限检查
  authorization: {
    type: 'RBAC'
    checkLevel: 'route' | 'component' | 'action'
  }
  
  // 操作审计
  audit: {
    enabled: boolean
    logLevel: 'info' | 'warning' | 'error'
    retention: number
  }
}
```

## JSON数据交互设计

### 1. 数据模型定义
```typescript
// 基础数据模型
interface VehicleRecord {
  XH: number          // 序号
  CP: string          // 车牌号
  CX: string          // 车型
  RKSJ: string        // 入站时间
  CKSJ: string        // 出站时间
  SFZRKMC: string     // 入口收费站
  SFZCKMC: string     // 出口收费站
  BZ: string          // 备注
}

// 数据传输对象
interface VehicleDTO {
  records: VehicleRecord[]
  total: number
  timestamp: string
}
```

### 2. API接口JSON规范
```typescript
// 查询请求格式
interface VehicleQueryRequest {
  filters: {
    CP?: string              // 车牌号模糊匹配
    CX?: string[]           // 车型列表
    timeRange?: {
      start: string         // 入站时间范围开始
      end: string          // 入站时间范围结束
    }
    SFZRKMC?: string[]     // 入口收费站列表
    SFZCKMC?: string[]     // 出口收费站列表
  }
  pagination: {
    page: number
    pageSize: number
  }
  sort: {
    field: keyof VehicleRecord
    order: 'asc' | 'desc'
  }
}

// 查询响应格式
interface VehicleQueryResponse {
  code: number               // 状态码
  message: string           // 状态信息
  data: {
    records: VehicleRecord[]
    total: number
    summary: {
      totalVehicles: number
      avgStayTime: number
      stationStats: {
        [stationName: string]: {
          inFlow: number
          outFlow: number
        }
      }
    }
  }
  timestamp: string
}
```

### 3. WebSocket实时数据格式
```typescript
// 实时数据推送
interface WSVehicleUpdate {
  type: 'VEHICLE_UPDATE'
  data: {
    newRecords: VehicleRecord[]
    deletedIds: number[]
    updatedRecords: Partial<VehicleRecord>[]
  }
  timestamp: string
}

// 统计数据推送
interface WSStatisticsUpdate {
  type: 'STATISTICS_UPDATE'
  data: {
    totalVehicles: number
    activeVehicles: number
    stationStatus: {
      [stationName: string]: {
        currentLoad: number
        trend: 'up' | 'down' | 'stable'
      }
    }
  }
  timestamp: string
}
```

### 4. 数据转换与验证
```typescript
// 数据验证规则
interface ValidationRules {
  CP: {
    pattern: /^[\u4e00-\u9fa5][A-Z0-9]{6}$/
    message: '车牌号格式不正确'
  }
  CX: {
    enum: ['小型车', '中型车', '大型车', '特大型车']
    message: '无效的车型'
  }
  RKSJ: {
    type: 'datetime'
    format: 'YYYY-MM-DD HH:mm:ss'
    message: '入站时间格式不正确'
  }
  CKSJ: {
    type: 'datetime'
    format: 'YYYY-MM-DD HH:mm:ss'
    nullable: true
    message: '出站时间格式不正确'
  }
}

// 数据转换工具
interface DataTransformUtils {
  toJSON: (record: VehicleRecord) => string
  fromJSON: (json: string) => VehicleRecord
  validate: (record: Partial<VehicleRecord>) => ValidationError[]
  format: {
    datetime: (value: string, format?: string) => string
    plateNumber: (value: string) => string
    stationName: (value: string) => string
  }
}
```

### 5. 缓存策略
```typescript
interface CacheStrategy {
  // 本地缓存配置
  localStorage: {
    key: string
    maxAge: number
    maxItems: number
    serializer: {
      serialize: (data: VehicleRecord[]) => string
      deserialize: (data: string) => VehicleRecord[]
    }
  }
  
  // API响应缓存
  apiCache: {
    enabled: boolean
    duration: number
    keyGenerator: (request: VehicleQueryRequest) => string
    storage: 'memory' | 'localStorage'
  }
}
```

### 6. 数据聚合与统计
```typescript
interface DataAggregation {
  // 实时统计
  realtime: {
    interval: number
    metrics: {
      totalFlow: number
      stationFlow: Record<string, number>
      vehicleTypes: Record<string, number>
    }
  }
  
  // 历史统计
  historical: {
    aggregationLevels: ('hour' | 'day' | 'week' | 'month')[]
    metrics: {
      flowTrend: Array<{
        timestamp: string
        value: number
      }>
      stationLoad: Record<string, number>
      peakHours: Array<{
        hour: number
        count: number
      }>
    }
  }
}
```

### 7. 错误处理
```typescript
interface ErrorHandling {
  // 错误码定义
  errorCodes: {
    INVALID_DATA: 4001
    VALIDATION_ERROR: 4002
    DUPLICATE_ENTRY: 4003
    NOT_FOUND: 4004
    SERVER_ERROR: 5001
  }
  
  // 错误响应格式
  errorResponse: {
    code: number
    message: string
    details?: {
      field: string
      error: string
    }[]
    timestamp: string
  }
} 