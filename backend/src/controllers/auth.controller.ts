import { Request, Response } from 'express'
import { authService } from '@/services/auth.service.js'
import { apiResponse } from '@/utils/apiResponse.js'

export class AuthController {
  // Register
  async register(req: Request, res: Response) {
    try {
      const { phone, password, nickname, role } = req.body

      const result = await authService.register({
        phone,
        password,
        nickname,
        role,
      })

      return apiResponse.success(res, result, '注册成功', 201)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 400)
    }
  }

  // Login
  async login(req: Request, res: Response) {
    try {
      const { phone, password } = req.body

      const result = await authService.login({
        phone,
        password,
      })

      return apiResponse.success(res, result, '登录成功')
    } catch (error: any) {
      return apiResponse.error(res, error.message, 401)
    }
  }

  // Get current user
  async getCurrentUser(req: Request, res: Response) {
    try {
      const userId = req.user!.userId
      const user = await authService.getCurrentUser(userId)

      return apiResponse.success(res, user)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 404)
    }
  }

  // Refresh token
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body

      const result = await authService.refreshToken(refreshToken)

      return apiResponse.success(res, result)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 401)
    }
  }

  // Logout (client-side only, just return success)
  async logout(req: Request, res: Response) {
    return apiResponse.success(res, null, '退出成功')
  }

  // Update profile
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user!.userId
      const data = req.body

      const user = await authService.updateProfile(userId, data)

      return apiResponse.success(res, user, '更新成功')
    } catch (error: any) {
      return apiResponse.error(res, error.message, 400)
    }
  }
}

export const authController = new AuthController()
