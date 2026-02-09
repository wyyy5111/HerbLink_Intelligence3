import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { apiResponse } from '@/utils/apiResponse.js'
import { logger } from '@/config/logger.js'

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  })

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any
    return apiResponse.error(
      res,
      '数据库操作失败',
      500,
      process.env.NODE_ENV === 'development' ? prismaError : undefined
    )
  }

  // Validation errors
  if (err instanceof ZodError) {
    return apiResponse.error(res, '数据验证失败', 400, err.errors)
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return apiResponse.error(res, '令牌无效', 401)
  }

  if (err.name === 'TokenExpiredError') {
    return apiResponse.error(res, '令牌已过期', 401)
  }

  // Default error
  return apiResponse.error(
    res,
    err.message || '服务器内部错误',
    500,
    process.env.NODE_ENV === 'development' ? err : undefined
  )
}

export const notFoundHandler = (req: Request, res: Response) => {
  apiResponse.error(res, `路径 ${req.path} 不存在`, 404)
}
