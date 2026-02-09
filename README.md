# 本草智链 - 中药材全产业链互联网平台

国家一等奖级别的现代化全栈中药材产业互联网平台，连接农户、企业与消费者。

## 项目概述

本草智链是一个完整的中药材产业互联网解决方案，涵盖：
- **客户端**: AI鉴真伪、市场行情、商城购物、农场认领、直播购等功能
- **农户端**: 农场管理、智能监控、专家指导、订单预售、直播带货等功能
- **平台端**: 完整的运营管理和数据分析系统
- **移动端APP**: 🆕 全新的移动端体验，具有顶级科技感和完美交互

## 📱 移动端APP（推荐演示）

我们为您创建了两个精美的移动端应用界面，具有以下特点：

### ✨ 设计亮点
- 🎨 **双主题设计** - 农户端（自然绿）与客户端（科技青）
- 🌟 **高级动画** - 流畅的页面转场、粒子效果、脉冲动画
- 📊 **数据可视化** - 实时监控数据、价格趋势图表
- 🤖 **AI功能** - 智能助手、鉴真伪识别
- 🎯 **完美交互** - 触摸反馈、滑动优化、弹性滚动

### 🚀 快速体验

直接在浏览器中打开（推荐）：

```bash
# 农户端
open mobile-farmer.html

# 客户端
open mobile-client.html
```

或通过本地服务器：

```bash
# 启动服务器
python -m http.server 8000

# 访问
# http://localhost:8000/mobile-farmer.html
# http://localhost:8000/mobile-client.html
```

详细使用指南请查看：[移动端APP完整指南](./MOBILE_APP_GUIDE.md)

## 技术栈

### 前端
- Vue 3 + TypeScript + Vite
- Element Plus (桌面端) + Vant (移动端)
- Pinia (状态管理)
- ECharts (数据可视化)
- GSAP (动画效果)
- Tailwind CSS

### 后端
- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL (主数据库)
- Redis (缓存/会话)
- Socket.io (实时通信)
- JWT (认证)
- Multer (文件上传)

## 项目结构

```
三创赛_本草智链/
├── mobile-farmer.html      # 📱 农户端移动端APP
├── mobile-client.html      # 📱 客户端移动端APP
├── mobile-app.css          # 移动端样式（2480行，包含所有动画）
├── mobile-app.js           # 移动端交互逻辑
├── MOBILE_APP_GUIDE.md     # 移动端使用指南
│
├── frontend/              # Vue 3 前端项目
│   ├── src/
│   │   ├── assets/       # 静态资源
│   │   ├── components/   # 组件
│   │   ├── views/        # 页面视图
│   │   ├── store/        # Pinia 状态管理
│   │   ├── api/          # API 请求
│   │   ├── router/       # 路由配置
│   │   └── utils/        # 工具函数
│   ├── package.json
│   └── vite.config.ts
│
├── backend/              # Node.js 后端项目
│   ├── src/
│   │   ├── config/       # 配置文件
│   │   ├── controllers/  # 控制器
│   │   ├── services/     # 业务逻辑
│   │   ├── routes/       # 路由
│   │   ├── middleware/   # 中间件
│   │   ├── utils/        # 工具函数
│   │   └── types/        # 类型定义
│   ├── prisma/           # Prisma ORM
│   ├── package.json
│   └── tsconfig.json
│
├── shared/               # 共享代码
│   ├── types/           # 共享类型定义
│   └── constants/       # 共享常量
│
└── README.md
```

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- PostgreSQL >= 14
- Redis >= 6

### 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 配置环境变量

1. 复制环境变量模板:
```bash
cd backend
cp .env.example .env
```

2. 编辑 `.env` 文件，配置数据库等信息:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/bencao_zhilian"
JWT_SECRET=your-super-secret-jwt-key
# ... 其他配置
```

### 数据库设置

```bash
# 生成 Prisma Client
npm run prisma:generate

# 运行数据库迁移
npm run prisma:migrate

# (可选) 打开 Prisma Studio 查看数据
npm run prisma:studio
```

### 启动项目

```bash
# 启动后端 (端口 3000)
cd backend
npm run dev

# 启动前端 (端口 5173)
cd frontend
npm run dev
```

访问:
- 前端: http://localhost:5173
- 后端 API: http://localhost:3000/api
- API 文档: http://localhost:3000/api/docs

## 主要功能

### 客户端
- 🏠 首页 - AI助手入口、快捷功能、市场行情概览
- 📸 拍照鉴真伪 - AI识别中药材真伪
- 📈 市场行情 - 实时价格、趋势分析、AI预测
- 🛒 商城 - 产品浏览、购物车、订单管理
- 🌾 认领农场 - 在线认领、实时监控、收获追踪
- 📺 直播购 - 直播观看、互动下单
- 🎁 福利中心 - 秒杀、拼团、优惠券

### 农户端
- 🏠 首页 - AI助手、农场状态、快捷功能
- 🌾 农场管理 - 地图可视化、监控数据、预警系统
- 📈 市场行情 - 价格分析、销售建议
- 📚 在线课程 - 视频学习、直播教学
- 📺 直播/作品 - 开播、发布、数据统计
- 👥 社区 - 农户交流、专家答疑

## API 文档

启动后端服务后，访问 http://localhost:3000/api/docs 查看完整的 API 文档。

## 数据库设计

主要数据表:
- users - 用户表
- farms - 农场表
- products - 产品表
- orders - 订单表
- order_items - 订单详情表
- market_prices - 市场行情表
- traceability_records - 溯源记录表
- farm_monitoring - 农场监控数据表
- courses - 课程表
- livestreams - 直播表
- farm_adoptions - 农场认领表

详细的数据库设计请参考 `backend/prisma/schema.prisma`

## 开发指南

### 添加新的 API 端点

1. 在 `backend/src/services/` 创建服务
2. 在 `backend/src/controllers/` 创建控制器
3. 在 `backend/src/routes/` 添加路由
4. 在 `frontend/src/api/` 添加前端 API 调用

### 添加新的页面

1. 在 `frontend/src/views/` 创建 Vue 组件
2. 在 `frontend/src/router/index.ts` 添加路由
3. 在导航组件中添加链接

### 使用 Socket.io

后端已集成 Socket.io，可以使用以下方式推送实时数据:

```typescript
// 后端 - 推送市场行情更新
io.to(`market:${productId}`).emit('price:update', priceData)

// 前端 - 订阅市场行情
socket.emit('subscribe:market', productId)
socket.on('price:update', (data) => {
  // 处理价格更新
})
```

## 部署

### 生产构建

```bash
# 前端
cd frontend
npm run build

# 后端
cd backend
npm run build
```

### Docker 部署 (TODO)

待补充 Docker 部署配置

## 许可证

本项目为三创赛参赛作品，仅供学习交流使用。

## 联系方式

如有问题，请联系项目团队。

---

**本草智链** - 连接传统与现代，让中药材产业更智慧
