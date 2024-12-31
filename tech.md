# ETC 大数据可视化监控平台技术文档

## 项目概述

ETC 大数据可视化监控平台是一个基于 Next.js 13 构建的现代化交通数据监控系统。该平台采用了最新的前端技术栈，提供实时数据可视化、交互式查询和分析报告等功能。
##请务必注意一点，数据标签和数据集不一样！！！！（监视大厅）
仔细分析项目并在tech.md中添加数据库连接方案。我看了现有的代码和文档。
### 从项目结构和tech.md的内容来看：
项目已经实现了前端的交互查询页面(/query)
数据格式已在 QueryData 接口中定义，tech.md中已包含了API接口设计
需要添加Mycat数据库连接和数据交互方案
## 我将在tech.md中添加数据库连接方案，主要包括：
- Mycat配置
- 数据库表结构
- 数据访问层设计
- 查询优化策略

## 技术栈

### 核心框架
- **Next.js 13**: 采用 App Router 架构
- **React 18**: 使用最新的 React 特性
- **TypeScript**: 提供完整的类型支持
- **TailwindCSS**: 原子化 CSS 框架

### 数据可视化
- **ECharts**: 用于复杂图表展示
- **高德地图 API**: 提供地图服务和车流可视化

### 状态管理
- **React Context**: 全局状态管理
- **next-themes**: 主题切换管理

### 动画效果
- **Framer Motion**: 提供流畅的动画效果

## 项目结构

```
src/
├── app/                # 应用路由和页面组件
│   ├── monitor/       # 监控大厅
│   ├── query/         # 交互查询
│   ├── reports/       # 分析报告
│   └── about/         # 关于我们
├── components/        # 可复用组件
│   ├── monitor/      # 监控相关组件
│   ├── query/        # 查询相关组件
│   └── reports/      # 报告相关组件
├── config/           # 配置文件
├── context/          # React Context
└── styles/          # 全局样式
```

## 核心功能模块

### 1. 监控大厅 (/monitor)

#### 布局设计
- 采用 Grid 布局系统
- 响应式设计，适配不同屏幕尺寸
- 组件间保持独立性，避免样式污染

#### 核心组件
1. **AMapComponent**
   - 文件：`src/components/monitor/AMapComponent.tsx`
   - 功能：高德地图集成
   - 数据接口：
     ```typescript
     interface MapConfig {
       center: [number, number]
       zoom: number
       viewMode: '2D' | '3D'
     }
     ```

2. **TrafficPressure**
   - 文件：`src/components/monitor/TrafficPressure.tsx`
   - 功能：交通压力监测
   - 数据接口：
     ```typescript
     interface PressureData {
       value: number
       timestamp: string
       stationId: number
     }
     ```

3. **VehicleDistribution**
   - 文件：`src/components/monitor/VehicleDistribution.tsx`
   - 功能：车型分布统计
   - 数据格式：
     ```typescript
     interface VehicleType {
       type: string
       count: number
       percentage: number
     }
     ```

4. **ShenzhenFlow**
   - 文件：`src/components/monitor/ShenzhenFlow.tsx`
   - 功能：深圳入/出流量统计
   - 数据更新机制：
     - 通过 CustomEvent 触发更新
     - 限制增量不超过 150
     - 入城比例 65%，出城比例 35%

5. **ProvinceDistribution**
   - 文件：`src/components/monitor/ProvinceDistribution.tsx`
   - 功能：省份车辆分布统计
   - 数据更新：
     - 基础流量：1000
     - 经济发达地区系数：2.0-3.0
     - 沿海省份系数：1.5-2.5
     - 其他地区系数：0.5-1.5
   - 数据接口：
     ```typescript
     interface ProvinceData {
       province: string
       value: number
       percentage: number
       trend: 'up' | 'down' | 'stable'
     }
     ```

6. **HeatMap**
   - 文件：`src/components/monitor/HeatMap.tsx`
   - 功能：出口流量热力图
   - 更新频率：30秒
   - 数据格式：
     ```typescript
     interface HeatMapData {
       position: [number, number]
       value: number
       timestamp: string
     }
     ```

7. **SankeyChart**
   - 文件：`src/components/monitor/SankeyChart.tsx`
   - 功能：车流路径流向图
   - 数据结构：
     ```typescript
     interface SankeyData {
       nodes: Array<{
         name: string
         value: number
       }>
       links: Array<{
         source: string
         target: string
         value: number
       }>
     }
     ```

8. **AlertPanel**
   - 文件：`src/components/monitor/AlertPanel.tsx`
   - 功能：预警信息展示
   - 预警级别：高、中、低
   - 数据接口：
     ```typescript
     interface Alert {
       id: string
       level: 'high' | 'medium' | 'low'
       message: string
       timestamp: string
       handled: boolean
     }
     ```

9. **VehicleTable**
   - 文件：`src/components/monitor/VehicleTable.tsx`
   - 功能：车辆信息实时展示
   - 数据脱敏：
     - 车牌号后三位用 *** 代替
     - 支持车牌号筛选和分页
   - 数据格式：
     ```typescript
     interface VehicleInfo {
       id: number
       plate: string // 脱敏后的车牌号
       type: string
       entryTime: string
       exitTime: string
       entryStation: string
       exitStation: string
       notes: string
     }
     ```

### 数据流更新机制

#### CustomEvent 实现
```typescript
// 事件定义
interface VehicleDataEvent extends CustomEvent {
  detail: {
    vehicleCount: number
    timestamp: string
    distribution: Record<string, number>
  }
}

// 事件触发
window.dispatchEvent(new CustomEvent('vehicleDataUpdate', {
  detail: {
    vehicleCount: 100,
    timestamp: new Date().toISOString(),
    distribution: {
      type1: 45,
      type2: 30,
      type3: 25
    }
  }
}))
```

#### 数据更新频率
- 交通压力引擎：3秒/次
- 车型分布：5秒/次
- 省份分布：10秒/次
- 车辆信息：10秒/次
- 预警信息：实时
- 流量统计：1分钟/次

#### 数据限流机制
```typescript
// 示例：流量增长限制
const MAX_FLOW_INCREMENT = 150
const ENTRY_RATIO = 0.65

function calculateFlow(increment: number) {
  const limitedIncrement = Math.min(increment, MAX_FLOW_INCREMENT)
  return {
    entry: Math.floor(limitedIncrement * ENTRY_RATIO),
    exit: Math.floor(limitedIncrement * (1 - ENTRY_RATIO))
  }
}
```

### 2. 分析报告 (/reports)

#### 布局设计
- 四大核心组件布局
- 响应式网格系统
- 独立的主题适配

#### 核心组件
1. **WeatherWidget**
   - 文件：`src/components/reports/WeatherWidget.tsx`
   - 功能：天气信息展示
   - 数据接口：
     ```typescript
     interface WeatherData {
       temperature: number
       humidity: number
       windSpeed: number
       condition: string
       aqi: number
     }
     ```

2. **StationFlowForecast**
   - 文件：`src/components/reports/StationFlowForecast.tsx`
   - 功能：站点流量预测
   - 数据格式：
     ```typescript
     interface StationFlow {
       stationId: number
       name: string
       forecast: number[]
       actual: number[]
     }
     ```

3. **TimeSeriesFlow**
   - 文件：`src/components/reports/TimeSeriesFlow.tsx`
   - 功能：时间序列预测
   - 数据接口：
     ```typescript
     interface TimeSeriesData {
       timestamp: string
       actual: number
       predicted: number
     }
     ```

### 3. 交互查询 (/query)

#### 布局设计
- 查询表单和结果展示分离
- 响应式表格设计
- 动态加载优化

#### 核心组件
1. **QueryForm**
   - 文件：`src/components/query/QueryForm.tsx`
   - 功能：查询条件表单
   - 数据接口：
     ```typescript
     interface QueryParams {
       plateNumber: string
       vehicleType: string
       timeRange: [string, string]
       station: string
     }
     ```

2. **QueryTable**
   - 文件：`src/components/query/QueryTable.tsx`
   - 功能：查询结果展示
   - 数据格式：
     ```typescript
     interface QueryResult {
       id: string
       plateNumber: string
       type: string
       entryTime: string
       exitTime: string
       station: string
     }
     ```

## 状态管理

### AppContext
- 文件：`src/context/AppContext.tsx`
- 功能：
  - 语言切换管理
  - 主题切换管理
  - 全局状态共享

```typescript
interface AppContextType {
  language: 'zh' | 'en'
  theme: 'light' | 'dark'
  setLanguage: (lang: string) => void
  setTheme: (theme: string) => void
}
```

## 样式系统

### 全局样式
- 文件：`src/app/globals.css`
- 特点：
  - CSS 变量系统
  - 深色模式支持
  - 响应式设计
  - 动画效果

### 主题切换
- 实现方式：CSS 变量 + TailwindCSS
- 支持：
  - 明暗主题
  - 动态颜色系统
  - 平滑过渡效果

### 样式系统详解

#### CSS 变量系统
```css
:root {
  /* 基础颜色 */
  --primary-color: 99, 102, 241;
  --secondary-color: 139, 92, 246;
  --accent-color: 236, 72, 153;
  
  /* 主题色 */
  --color-primary: #3b82f6;
  --color-primary-light: #60a5fa;
  --color-primary-dark: #2563eb;
  
  /* 文本颜色 */
  --color-text: #1f2937;
  
  /* 背景色 */
  --background-start-rgb: 255, 255, 255;
  --background-end-rgb: 255, 255, 255;
}

/* 暗色主题变量 */
[data-theme='dark'] {
  --primary-color: 129, 140, 248;
  --secondary-color: 167, 139, 250;
  --accent-color: 244, 114, 182;
  --color-primary: #60a5fa;
  --color-primary-light: #93c5fd;
  --color-primary-dark: #3b82f6;
  --color-text: #f3f4f6;
  --background-start-rgb: 15, 23, 42;
  --background-end-rgb: 23, 31, 50;
}
```

#### 监控面板动态边框效果
```css
.monitor-panel {
  position: relative;
  border: 2px solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(
    45deg,
    rgb(236, 72, 153) 0%,
    rgb(139, 92, 246) 50%,
    rgb(236, 72, 153) 100%
  );
  background-origin: border-box;
  background-clip: padding-box, border-box;
  animation: borderRotate 3s ease infinite;
}

@keyframes borderRotate {
  0% {
    border-image-source: linear-gradient(
      0deg,
      rgb(236, 72, 153) 0%,
      rgb(139, 92, 246) 50%,
      rgb(236, 72, 153) 100%
    );
  }
  50% {
    border-image-source: linear-gradient(
      180deg,
      rgb(236, 72, 153) 0%,
      rgb(139, 92, 246) 50%,
      rgb(236, 72, 153) 100%
    );
  }
  100% {
    border-image-source: linear-gradient(
      360deg,
      rgb(236, 72, 153) 0%,
      rgb(139, 92, 246) 50%,
      rgb(236, 72, 153) 100%
    );
  }
}
```

## 国际化

### 翻译系统
- 文件：`src/config/translations.ts`
- 支持语言：
  - 中文 (zh)
  - 英文 (en)
- 实现方式：
  - 对象映射
  - 动态切换
  - 组件级别翻译

## 数据流

### 实时数据更新
- 使用 CustomEvent 机制
- 定时器模拟数据更新
- 数据限流和验证

### 数据格式规范
- 统一的数据接口定义
- TypeScript 类型检查
- 数据验证和转换

## 性能优化

### 代码分割
- 动态导入组件
- 路由级别代码分割
- 按需加载资源

### 渲染优化
- 使用 React.memo
- 避免不必要的重渲染
- 合理的依赖管理

## 安全性

### 数据安全
- 车牌号码脱敏
- 敏感信息过滤
- API 密钥保护

### 错误处理
- 全局错误边界
- 优雅的降级处理
- 用户友好的错误提示

## 部署说明

### 环境要求
- Node.js >= 16.8.0
- 支持的浏览器：
  - Chrome >= 90
  - Firefox >= 88
  - Safari >= 14
  - Edge >= 90

### 环境变量
```env
NEXT_PUBLIC_AMAP_KEY=您的高德地图 Key
NEXT_PUBLIC_AMAP_SECURITY_CODE=您的安全密钥
```

## 开发规范

### 代码风格
- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 格式化

### 组件开发规范
- 功能单一原则
- 保持组件独立性
- 避免样式污染
- 统一的错误处理
- 完整的类型定义

### Git 工作流
- 功能分支开发
- 提交信息规范
- 代码审查流程
- 版本管理规范 

## 前后端接口设计

### API 基础配置

#### 基础URL
```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'
```

#### 请求配置
```typescript
interface RequestConfig {
  headers: {
    'Content-Type': 'application/json'
    Authorization?: string
    'X-API-Key'?: string
  }
  timeout: number
  withCredentials: boolean
}
```

#### 响应格式
```typescript
interface ApiResponse<T> {
  code: number        // 状态码
  message: string     // 响应消息
  data: T            // 响应数据
  timestamp: string   // 时间戳
}
```

### 监控大厅接口 (/monitor)

#### 1. 交通压力监测接口
```typescript
// GET /api/monitor/traffic-pressure
interface TrafficPressureRequest {
  stationId?: number    // 可选，特定站点ID
  timeRange: number     // 时间范围（分钟）
}

interface TrafficPressureResponse {
  pressureLevel: number           // 压力等级 0-100
  stationPressures: {
    stationId: number
    name: string
    pressure: number
    timestamp: string
    trend: 'up' | 'down' | 'stable'
  }[]
  updateInterval: number          // 更新间隔（秒）
}
```

#### 2. 车型分布统计接口
```typescript
// GET /api/monitor/vehicle-distribution
interface VehicleDistributionRequest {
  timeRange: [string, string]    // 时间范围
  groupBy?: 'hour' | 'day'       // 分组方式
}

interface VehicleDistributionResponse {
  total: number
  distribution: {
    type: string
    count: number
    percentage: number
  }[]
  trends: {
    timestamp: string
    distributions: Record<string, number>
  }[]
}
```

#### 3. 深圳入/出流量统计接口
```typescript
// GET /api/monitor/shenzhen-flow
interface ShenzhenFlowRequest {
  interval: number               // 统计间隔（分钟）
  limit?: number                // 返回记录限制
}

interface ShenzhenFlowResponse {
  currentFlow: {
    inbound: number
    outbound: number
    timestamp: string
  }
  historicalData: {
    timestamp: string
    inbound: number
    outbound: number
  }[]
  peakHours: {
    inbound: string[]
    outbound: string[]
  }
}
```

#### 4. 省份车辆分布接口
```typescript
// GET /api/monitor/province-distribution
interface ProvinceDistributionRequest {
  timeRange: [string, string]
  includeHistory?: boolean
}

interface ProvinceDistributionResponse {
  current: {
    province: string
    count: number
    percentage: number
    trend: 'up' | 'down' | 'stable'
  }[]
  historical?: {
    timestamp: string
    distributions: Record<string, number>
  }[]
}
```

#### 5. 热力图数据接口
```typescript
// GET /api/monitor/heatmap
interface HeatMapRequest {
  timeRange: [string, string]
  resolution?: 'high' | 'medium' | 'low'
}

interface HeatMapResponse {
  points: {
    position: [number, number]
    weight: number
    stationId?: number
  }[]
  bounds: {
    northeast: [number, number]
    southwest: [number, number]
  }
  timestamp: string
}
```

#### 6. 车流路径接口
```typescript
// GET /api/monitor/flow-path
interface FlowPathRequest {
  startTime: string
  endTime: string
  minFlow?: number              // 最小流量阈值
}

interface FlowPathResponse {
  nodes: {
    id: string
    name: string
    type: 'station' | 'city' | 'province'
    value: number
    coordinates: [number, number]
  }[]
  links: {
    source: string
    target: string
    value: number
    path?: [number, number][]
  }[]
}
```

#### 7. 预警信息接口
```typescript
// GET /api/monitor/alerts
interface AlertRequest {
  level?: 'high' | 'medium' | 'low'
  status?: 'active' | 'resolved'
  limit?: number
}

interface AlertResponse {
  alerts: {
    id: string
    level: 'high' | 'medium' | 'low'
    title: string
    message: string
    timestamp: string
    location?: {
      stationId: number
      coordinates: [number, number]
    }
    status: 'active' | 'resolved'
    resolvedAt?: string
  }[]
  statistics: {
    total: number
    byLevel: Record<string, number>
    byStatus: Record<string, number>
  }
}

// POST /api/monitor/alerts/{id}/resolve
interface AlertResolveRequest {
  resolution: string
  notes?: string
}
```

#### 8. 车辆信息接口
```typescript
// GET /api/monitor/vehicles
interface VehicleRequest {
  page: number
  pageSize: number
  filters?: {
    plateNumber?: string
    type?: string
    entryStation?: string
    exitStation?: string
    timeRange?: [string, string]
  }
  sort?: {
    field: string
    order: 'asc' | 'desc'
  }
}

interface VehicleResponse {
  total: number
  vehicles: {
    id: number
    plateNumber: string      // 已脱敏
    type: string
    entryTime: string
    exitTime: string
    entryStation: string
    exitStation: string
    fee: number
    status: 'in' | 'out' | 'abnormal'
  }[]
  summary: {
    totalVehicles: number
    currentInStation: number
    averageStayTime: number
  }
}
```

### 分析报告接口 (/reports)

#### 1. 天气信息接口
```typescript
// GET /api/reports/weather
interface WeatherRequest {
  stationId: number
  includeForecasts?: boolean
}

interface WeatherResponse {
  current: {
    temperature: number
    humidity: number
    windSpeed: number
    windDirection: number
    condition: string
    aqi: number
    visibility: number
    pressure: number
    updateTime: string
  }
  forecasts?: {
    timestamp: string
    temperature: number
    condition: string
    probability: number
  }[]
  alerts: {
    type: string
    level: string
    content: string
    startTime: string
    endTime: string
  }[]
}
```

#### 2. 站点流量预测接口
```typescript
// GET /api/reports/station-flow-forecast
interface StationFlowForecastRequest {
  stationId: number
  forecastHours: number
  interval: number           // 间隔分钟数
}

interface StationFlowForecastResponse {
  stationInfo: {
    id: number
    name: string
    location: [number, number]
    capacity: number
  }
  forecasts: {
    timestamp: string
    predicted: number
    confidence: {
      upper: number
      lower: number
    }
    factors: {
      weather: number
      historical: number
      events: number
    }
  }[]
  historical: {
    timestamp: string
    actual: number
  }[]
  anomalies: {
    timestamp: string
    expected: number
    actual: number
    deviation: number
  }[]
}
```

#### 3. 时间序列预测接口
```typescript
// GET /api/reports/time-series
interface TimeSeriesRequest {
  metric: 'flow' | 'occupancy' | 'speed'
  stationIds: number[]
  startTime: string
  endTime: string
  interval: number          // 间隔分钟数
}

interface TimeSeriesResponse {
  series: {
    stationId: number
    name: string
    data: {
      timestamp: string
      actual: number
      predicted: number
      bounds: {
        upper: number
        lower: number
      }
    }[]
  }[]
  analysis: {
    trend: 'increasing' | 'decreasing' | 'stable'
    seasonality: {
      daily: number[]      // 24小时模式
      weekly: number[]     // 7天模式
    }
    anomalies: {
      timestamp: string
      value: number
      expected: number
      severity: number
    }[]
  }
}
```

### 交互查询接口 (/query)

#### 1. 车辆查询接口
```typescript
// GET /api/query/vehicles
interface VehicleQueryRequest {
  CP?: string              // 车牌号
  CX?: string              // 车型
  timeRange?: {            // 时间范围
    start: Date
    end: Date
  }
  SFZRKMC?: string        // 入口收费站
  SFZCKMC?: string        // 出口收费站
  page: number
  pageSize: number
  sort?: {
    field: keyof VehicleRecord
    order: 'asc' | 'desc'
  }
}

interface VehicleQueryResponse {
  total: number
  records: VehicleRecord[]
  summary: {
    totalVehicles: number
    currentInStation: number
    averageStayTime: number
  }
}

// GET /api/query/vehicles/{XH}
interface VehicleDetailResponse extends VehicleRecord {
  transactions: {
    id: string
    timestamp: string
    station: string
    type: string
    amount: number
    status: string
  }[]
}
```

#### 2. 站点查询接口
```typescript
// GET /api/query/stations
interface StationQueryRequest {
  keyword?: string
  region?: string
  type?: string[]
  status?: string[]
}

interface StationQueryResponse {
  stations: {
    id: number
    name: string
    code: string
    type: string
    status: string
    location: {
      coordinates: [number, number]
      address: string
      region: string
    }
    capabilities: string[]
    statistics: {
      dailyFlow: number
      occupancy: number
      operationalHours: number
    }
  }[]
}
```

### WebSocket 接口

#### 1. 实时数据订阅
```typescript
// WS /ws/monitor/realtime
interface WSSubscribeMessage {
  type: 'subscribe' | 'unsubscribe'
  channels: string[]        // 订阅的数据通道
  filters?: {              // 可选的过滤条件
    stationIds?: number[]
    metrics?: string[]
    minValue?: number
  }
}

interface WSDataMessage {
  channel: string
  timestamp: string
  data: any
  sequence: number        // 消息序列号
}
```

#### 2. 实时告警推送
```typescript
// WS /ws/monitor/alerts
interface WSAlertMessage {
  type: 'alert'
  level: 'high' | 'medium' | 'low'
  title: string
  message: string
  timestamp: string
  location?: {
    stationId: number
    coordinates: [number, number]
  }
  metadata?: Record<string, any>
}
```

### 错误码定义

```typescript
enum ApiErrorCode {
  SUCCESS = 0,
  INVALID_PARAMS = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_ERROR = 500,
  
  // 业务错误码
  STATION_OFFLINE = 1001,
  VEHICLE_NOT_FOUND = 1002,
  DATA_NOT_READY = 1003,
  RATE_LIMITED = 1004,
  INVALID_TIME_RANGE = 1005,
  FORECAST_UNAVAILABLE = 1006,
}
```

### 安全认证

#### 1. 认证接口
```typescript
// POST /api/auth/login
interface LoginRequest {
  username: string
  password: string
  captcha?: string
}

interface LoginResponse {
  token: string
  expires: number
  user: {
    id: number
    username: string
    role: string
    permissions: string[]
  }
}

// POST /api/auth/refresh
interface RefreshTokenResponse {
  token: string
  expires: number
}
```

#### 2. 权限控制
```typescript
interface Permission {
  resource: string
  action: 'read' | 'write' | 'delete' | 'admin'
}

interface Role {
  name: string
  permissions: Permission[]
  level: number
}
```

### 数据推送机制

#### Server-Sent Events (SSE)
```typescript
// GET /api/sse/monitor
interface SSEConfig {
  channels: string[]
  bufferSize?: number
  reconnectTime?: number
}

interface SSEMessage {
  type: string
  data: any
  id: string
  retry?: number
}
```

### 缓存策略

```typescript
interface CacheConfig {
  type: 'memory' | 'redis'
  ttl: number              // 缓存时间（秒）
  maxSize?: number         // 最大缓存条目数
  updateInterval?: number  // 后台更新间隔
}

interface CacheKey {
  prefix: string
  params: Record<string, any>
  version?: string
}
```

### 数据聚合与统计

```typescript
interface AggregationConfig {
  metrics: string[]
  interval: number
  functions: ('avg' | 'sum' | 'min' | 'max' | 'count')[]
  groupBy?: string[]
}

interface StatisticsResult {
  period: {
    start: string
    end: string
  }
  groups: {
    key: string
    metrics: Record<string, number>
  }[]
}
```

### 部署配置

```typescript
interface DeploymentConfig {
  api: {
    port: number
    cors: {
      origin: string[]
      methods: string[]
    }
    rateLimits: {
      window: number
      max: number
    }
  }
  database: {
    type: 'mysql' | 'postgresql'
    host: string
    port: number
    database: string
    username: string
    password: string
    pool: {
      min: number
      max: number
    }
  }
  cache: {
    type: 'redis' | 'memory'
    host?: string
    port?: number
    password?: string
  }
  queue: {
    type: 'redis' | 'rabbitmq'
    connection: {
      host: string
      port: number
    }
    options: {
      prefix: string
      defaultJobOptions: {
        attempts: number
        backoff: {
          type: string
          delay: number
        }
      }
    }
  }
}
``` 

## 数据库设计与连接方案

### 数据库表结构

```sql
CREATE TABLE vehicle_records (
    XH BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '序号',
    CP VARCHAR(10) NOT NULL COMMENT '车牌号',
    CX VARCHAR(20) NOT NULL COMMENT '车型',
    RKSJ DATETIME NOT NULL COMMENT '入站时间',
    CKSJ DATETIME COMMENT '出站时间',
    SFZRKMC VARCHAR(50) NOT NULL COMMENT '入口收费站',
    SFZCKMC VARCHAR(50) COMMENT '出口收费站',
    BZ VARCHAR(200) COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cp (CP),
    INDEX idx_rksj (RKSJ),
    INDEX idx_cksj (CKSJ),
    INDEX idx_stations (SFZRKMC, SFZCKMC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='车辆通行记录表';
```

### Mycat 配置方案

#### 1. 分片策略
```json
{
  "tableRule": {
    "vehicle_records_rule": {
      "rule": "mod",
      "defaultNode": "0",
      "ruleAlgorithm": {
        "type": "mod",
        "count": "4",
        "column": "XH"
      }
    }
  },
  "dataNode": {
    "dn1": {
      "database": "etc_db_1",
      "dataHost": "host1"
    },
    "dn2": {
      "database": "etc_db_2",
      "dataHost": "host2"
    },
    "dn3": {
      "database": "etc_db_3",
      "dataHost": "host3"
    },
    "dn4": {
      "database": "etc_db_4",
      "dataHost": "host4"
    }
  },
  "schema": {
    "etc_schema": {
      "table": {
        "vehicle_records": {
          "primaryKey": "XH",
          "dataNode": "dn1,dn2,dn3,dn4",
          "rule": "vehicle_records_rule"
        }
      }
    }
  }
}
```

#### 2. 读写分离配置
```json
{
  "dataHost": {
    "host1": {
      "url": "jdbc:mysql://master1:3306",
      "user": "root",
      "password": "******",
      "readHosts": [
        {"url": "jdbc:mysql://slave1:3306"},
        {"url": "jdbc:mysql://slave2:3306"}
      ]
    }
  }
}
```

### 数据访问层设计

#### 1. 数据模型
```typescript
interface VehicleRecord {
  XH: number
  CP: string
  CX: string
  RKSJ: Date
  CKSJ: Date | null
  SFZRKMC: string
  SFZCKMC: string | null
  BZ: string | null
}

interface QueryFilters {
  CP?: string
  CX?: string
  timeRange?: {
    start: Date
    end: Date
  }
  SFZRKMC?: string
  SFZCKMC?: string
  page: number
  pageSize: number
}
```

#### 2. 数据访问接口
```typescript
interface VehicleRecordRepository {
  findById(id: number): Promise<VehicleRecord | null>
  findByPlate(plate: string): Promise<VehicleRecord[]>
  search(filters: QueryFilters): Promise<{
    total: number
    records: VehicleRecord[]
  }>
  create(record: Omit<VehicleRecord, 'XH'>): Promise<VehicleRecord>
  update(id: number, record: Partial<VehicleRecord>): Promise<boolean>
  delete(id: number): Promise<boolean>
}
```

### 查询优化策略

#### 1. 缓存层配置
```typescript
interface CacheStrategy {
  // Redis缓存配置
  redis: {
    host: string
    port: number
    keyPrefix: string
    ttl: number  // 缓存时间（秒）
  }
  // 缓存键生成策略
  keyGenerators: {
    vehicleRecord: (id: number) => string
    queryResults: (filters: QueryFilters) => string
  }
  // 缓存清理策略
  invalidation: {
    patterns: string[]
    triggers: {
      onCreate: string[]
      onUpdate: string[]
      onDelete: string[]
    }
  }
}
```

#### 2. SQL优化配置
```typescript
interface SQLOptimization {
  // 查询优化器配置
  optimizer: {
    maxLimit: number        // 最大返回记录数
    defaultPageSize: number // 默认分页大小
    timeout: number        // 查询超时时间（秒）
  }
  // 索引使用策略
  indexStrategy: {
    forceIndex?: string[]  // 强制使用的索引
    ignoreIndex?: string[] // 忽略的索引
  }
  // 分页优化
  pagination: {
    type: 'offset' | 'cursor'
    cursorField: string
  }
}
```

### 数据同步机制

#### 1. 实时同步配置
```typescript
interface SyncConfig {
  // Canal配置
  canal: {
    host: string
    port: number
    destination: string
    username: string
    password: string
  }
  // 消息队列配置
  messageQueue: {
    type: 'kafka' | 'rabbitmq'
    brokers: string[]
    topic: string
    groupId: string
    options: {
      retries: number
      batchSize: number
      linger: number
    }
  }
}
```

#### 2. 数据转换规则
```typescript
interface DataTransform {
  // 字段映射规则
  fieldMapping: {
    [key: string]: {
      targetField: string
      transformer?: (value: any) => any
    }
  }
  // 数据验证规则
  validation: {
    [key: string]: {
      type: string
      required: boolean
      pattern?: RegExp
      min?: number
      max?: number
    }
  }
}
```

### 错误处理机制

#### 1. 数据库错误码映射
```typescript
interface DBErrorMapping {
  // MySQL错误码映射
  mysql: {
    1045: 'AUTH_FAILED'
    1049: 'DB_NOT_FOUND'
    1146: 'TABLE_NOT_FOUND'
    1062: 'DUPLICATE_ENTRY'
    1064: 'SYNTAX_ERROR'
  }
  // 自定义错误码
  custom: {
    QUERY_TIMEOUT: 'QUERY_TIMEOUT'
    INVALID_PARAMS: 'INVALID_PARAMS'
    RECORD_NOT_FOUND: 'RECORD_NOT_FOUND'
    CACHE_MISS: 'CACHE_MISS'
  }
}
```

#### 2. 错误处理策略
```typescript
interface ErrorHandlingStrategy {
  // 重试策略
  retry: {
    maxAttempts: number
    backoff: {
      type: 'fixed' | 'exponential'
      delay: number
    }
    retryableErrors: string[]
  }
  // 降级策略
  fallback: {
    enabled: boolean
    cacheTTL: number
    staleIfError: boolean
  }
  // 告警阈值
  alerts: {
    errorRate: number
    responseTime: number
    deadlockCount: number
  }
}
```

### 监控指标

#### 1. 性能指标
```typescript
interface PerformanceMetrics {
  // 查询性能指标
  query: {
    responseTime: {
      p50: number
      p90: number
      p99: number
    }
    throughput: number
    errorRate: number
    slowQueries: number
  }
  // 连接池指标
  connectionPool: {
    active: number
    idle: number
    waiting: number
    maxActive: number
  }
  // 缓存指标
  cache: {
    hitRate: number
    missRate: number
    evictionRate: number
    size: number
  }
}
```

#### 2. 健康检查配置
```typescript
interface HealthCheck {
  // 数据库健康检查
  database: {
    interval: number
    timeout: number
    query: string
  }
  // Mycat节点健康检查
  mycat: {
    nodes: {
      host: string
      port: number
      weight: number
    }[]
    checkInterval: number
    failureThreshold: number
  }
}
``` 