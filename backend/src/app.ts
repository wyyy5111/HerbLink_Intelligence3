import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { createServer } from 'http'
import { Server as SocketServer } from 'socket.io'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { logger } from './config/logger.js'
import { connectRedis } from './config/redis.js'
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js'
import { generalRateLimit } from './middleware/rateLimit.middleware.js'
import apiRoutes from './routes/index.js'

const app = express()
const httpServer = createServer(app)

// Socket.io setup
export const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
})

// Try to connect to Redis (optional for development)
connectRedis().catch((error) => {
  logger.warn('Redis connection failed, continuing without Redis:', error.message)
})

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`)

  // Subscribe to market updates
  socket.on('subscribe:market', (productId: string) => {
    socket.join(`market:${productId}`)
    logger.info(`Socket ${socket.id} subscribed to market:${productId}`)
  })

  // Unsubscribe from market updates
  socket.on('unsubscribe:market', (productId: string) => {
    socket.leave(`market:${productId}`)
    logger.info(`Socket ${socket.id} unsubscribed from market:${productId}`)
  })

  // Subscribe to farm monitoring
  socket.on('subscribe:farm', (farmId: string) => {
    socket.join(`farm:${farmId}`)
    logger.info(`Socket ${socket.id} subscribed to farm:${farmId}`)
  })

  // Join livestream room
  socket.on('join:livestream', (livestreamId: string) => {
    socket.join(`livestream:${livestreamId}`)
    logger.info(`Socket ${socket.id} joined livestream:${livestreamId}`)
  })

  // Leave livestream room
  socket.on('leave:livestream', (livestreamId: string) => {
    socket.leave(`livestream:${livestreamId}`)
    logger.info(`Socket ${socket.id} left livestream:${livestreamId}`)
  })

  // Livestream chat message
  socket.on('livestream:message', (data: { livestreamId: string; message: string; userId: string }) => {
    socket.to(`livestream:${data.livestreamId}`).emit('livestream:message', {
      userId: data.userId,
      message: data.message,
      timestamp: new Date(),
    })
  })

  // Disconnect
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`)
  })
})

// Security middleware
app.use(helmet())

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression middleware
app.use(compression())

// Rate limiting (applied to all routes)
app.use(generalRateLimit)

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  })
  next()
})

// API Routes
const apiPrefix = process.env.API_PREFIX || '/api'
app.use(apiPrefix, apiRoutes)

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '本草智链 API',
      version: '1.0.0',
      description: '中药材全产业链互联网平台 API 文档',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}${apiPrefix}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use(`${apiPrefix}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Static files (for uploads)
app.use('/uploads', express.static('uploads'))

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use(notFoundHandler)

// Error handler (must be last)
app.use(errorHandler)

export default app
