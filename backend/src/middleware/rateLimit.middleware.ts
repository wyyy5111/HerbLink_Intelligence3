import rateLimit from 'express-rate-limit'

// General rate limit
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: '请求过于频繁，请稍后再试',
  standardHeaders: true,
  legacyHeaders: false,
})

// Strict rate limit for auth endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: '登录尝试过多，请稍后再试',
  skipSuccessfulRequests: true,
})

// API rate limit
export const apiRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  message: 'API请求过于频繁，请稍后再试',
})
