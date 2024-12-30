# ETC 大数据可视化监控平台

## 项目简介

ETC 大数据可视化监控平台是一个现代化的交通数据监控系统，致力于为交通管理部门提供实时、直观、高效的数据可视化解决方案。该平台采用最新的前端技术栈，提供了丰富的数据展示功能和良好的用户体验。

## 主要功能

### 1. 实时监控大厅 `/monitor`
- **高德地图集成**
  - 实时路况展示
  - 动态车流可视化（进出深圳）
  - 主要高速公路路线展示
  - 支持明暗主题切换

- **数据可视化**
  - 交通压力引擎
  - 车型分布统计
  - 省份分布分析
  - 实时车流量统计
  - 出口流量热力图
  - 车辆信息实时展示
  - 预警信息监控
  - 广东省车流路径流向图

### 2. 交互式查询 `/query`
- 多条件组合查询
- 车辆通行记录查询
- 数据表格展示
- 支持导出功能

### 3. 全局特性
- 中英文国际化支持
- 明暗主题切换
- 响应式设计
- 现代化 UI 界面

## 技术栈

- **前端框架**：Next.js 13 (App Router)
- **UI 框架**：TailwindCSS
- **地图服务**：高德地图 API
- **数据可视化**：ECharts
- **状态管理**：React Context
- **开发语言**：TypeScript
- **国际化**：自定义 i18n 解决方案
- **主题切换**：next-themes

## 项目特点

1. **现代化架构**
   - 采用 Next.js 13 App Router 架构
   - 基于 React 18 新特性
   - TypeScript 全面类型支持

2. **优秀的性能**
   - 组件动态导入
   - 路由级别代码分割
   - 图表按需加载

3. **用户体验**
   - 流畅的动画效果
   - 响应式设计
   - 直观的数据展示
   - 便捷的操作界面

4. **可维护性**
   - 模块化设计
   - 统一的代码风格
   - 清晰的项目结构
   - 完善的类型定义

## 开发环境

```bash
# Node.js 版本要求
Node.js >= 16.8.0

# 安装依赖
npm install

# 开发环境运行
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm start
```

## 项目结构

```
src/
├── app/                # 应用路由和页面组件
│   ├── monitor/       # 监控大厅
│   ├── query/         # 交互查询
│   └── about/         # 关于我们
├── components/        # 可复用组件
│   ├── monitor/      # 监控相关组件
│   └── query/        # 查询相关组件
├── config/           # 配置文件
├── context/         # React Context
└── styles/          # 全局样式

public/              # 静态资源
```

## 环境变量配置

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_AMAP_KEY=您的高德地图 Key
NEXT_PUBLIC_AMAP_SECURITY_CODE=您的安全密钥
```

## 浏览器支持

- Chrome >= 90
- Firefox >= 88
- Safari >= 14
- Edge >= 90

## 许可证

[MIT License](LICENSE)

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

同步差异