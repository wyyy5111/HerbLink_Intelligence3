# 本草智链部署文档

## 生产环境部署

### 环境要求

- Node.js >= 18.x
- PostgreSQL >= 14
- Redis >= 6
- Nginx (可选)

### 后端部署

1. **安装依赖**
```bash
cd backend
npm install --production
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，配置生产环境变量
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/database
REDIS_HOST=your-redis-host
JWT_SECRET=your-production-secret
```

3. **数据库迁移**
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. **构建并启动**
```bash
npm run build
npm start
# 或使用 PM2
pm2 start dist/server.js --name bencao-backend
```

### 前端部署

1. **安装依赖**
```bash
cd frontend
npm install
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件
VITE_API_BASE_URL=https://your-api-domain.com/api
```

3. **构建生产版本**
```bash
npm run build
```

4. **部署到静态服务器**
```bash
# 构建产物在 dist 目录
# 可以部署到 Nginx、CDN 等
```

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

### Docker 部署（可选）

**后端 Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "start"]
```

**前端 Dockerfile**
```dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    environment:
      POSTGRES_DB: bencao_zhilian
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/bencao_zhilian
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

## 监控和日志

- **应用日志**: 存储在 `logs/` 目录
- **错误追踪**: 配置 Sentry 或类似服务
- **性能监控**: 配置 PM2 监控

## 备份策略

- **数据库备份**: 每日自动备份
- **文件备份**: 定期备份上传的文件

## 更新部署

1. 拉取最新代码
2. 运行数据库迁移
3. 重启服务
4. 清理缓存

## 安全检查清单

- [ ] 更新所有依赖包
- [ ] 配置防火墙规则
- [ ] 启用 HTTPS
- [ ] 配置 API 限流
- [ ] 启用 CORS 白名单
- [ ] 定期安全审计
