import dotenv from 'dotenv'
import app from './app.js'
import { logger } from './config/logger.js'

// Load environment variables
dotenv.config()

const PORT = process.env.PORT || 3000

// Start server
const startServer = async () => {
  try {
    // Start HTTP server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`)
      logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
      logger.info(`🌐 API: http://localhost:${PORT}${process.env.API_PREFIX || '/api'}`)
      logger.info(`📚 Docs: http://localhost:${PORT}${process.env.API_PREFIX || '/api'}/docs`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err)
  process.exit(1)
})

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err)
  process.exit(1)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server')
  process.exit(0)
})

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server')
  process.exit(0)
})

// Start the server
startServer()
