import { Request, Response, NextFunction } from 'express'
import { jwtService } from '@/config/jwt.js'
import { apiResponse } from '@/utils/apiResponse.js'

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string
        role: string
      }
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return apiResponse.error(res, '未提供认证令牌', 401)
    }

    const token = authHeader.substring(7)

    try {
      const payload = jwtService.verifyToken(token)
      req.user = {
        userId: payload.userId,
        role: payload.role,
      }
      next()
    } catch (error) {
      return apiResponse.error(res, '令牌无效或已过期', 401, error)
    }
  } catch (error) {
    return apiResponse.error(res, '认证失败', 500, error)
  }
}

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)

      try {
        const payload = jwtService.verifyToken(token)
        req.user = {
          userId: payload.userId,
          role: payload.role,
        }
      } catch (error) {
        // Token invalid, but we continue anyway
      }
    }

    next()
  } catch (error) {
    next()
  }
}

// Role-based authorization
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return apiResponse.error(res, '未认证', 401)
    }

    if (!roles.includes(req.user.role)) {
      return apiResponse.error(res, '权限不足', 403)
    }

    next()
  }
}
