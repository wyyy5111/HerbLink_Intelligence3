import { createClient } from 'redis'

const redisUrl = `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`

export const redis = createClient({
  url: redisUrl,
  password: process.env.REDIS_PASSWORD || undefined,
  database: parseInt(process.env.REDIS_DB || '0'),
})

redis.on('error', (err) => {
  // Only log in development
  if (process.env.NODE_ENV !== 'production') {
    console.warn('Redis Client Error (continuing without Redis):', err.message)
  }
})
redis.on('connect', () => console.log('Redis Client Connected'))

// Connect to Redis
export const connectRedis = async () => {
  if (!redis.isOpen) {
    await redis.connect()
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  if (redis.isOpen) {
    await redis.quit().catch(() => {})
  }
})
