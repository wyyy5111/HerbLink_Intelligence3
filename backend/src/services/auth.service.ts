import bcrypt from 'bcryptjs'
import { prisma } from '@/config/database.js'
import { jwtService } from '@/config/jwt.js'
import type { User, UserRole } from '@prisma/client'

export interface RegisterData {
  phone: string
  password: string
  nickname?: string
  role: UserRole
}

export interface LoginData {
  phone: string
  password: string
}

export class AuthService {
  // Register new user
  async register(data: RegisterData) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { phone: data.phone },
    })

    if (existingUser) {
      throw new Error('该手机号已注册')
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        phone: data.phone,
        passwordHash,
        nickname: data.nickname,
        role: data.role,
      },
      select: {
        id: true,
        phone: true,
        role: true,
        nickname: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Generate tokens
    const tokens = jwtService.generateTokens({
      userId: user.id,
      role: user.role,
    })

    return {
      user,
      ...tokens,
    }
  }

  // Login user
  async login(data: LoginData) {
    // Find user by phone
    const user = await prisma.user.findUnique({
      where: { phone: data.phone },
    })

    if (!user) {
      throw new Error('手机号或密码错误')
    }

    // Check user status
    if (user.status !== 'ACTIVE') {
      throw new Error('账户已被禁用')
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.passwordHash)

    if (!isValidPassword) {
      throw new Error('手机号或密码错误')
    }

    // Generate tokens
    const tokens = jwtService.generateTokens({
      userId: user.id,
      role: user.role,
    })

    // Return user without password
    const { passwordHash, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      ...tokens,
    }
  }

  // Get current user
  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        role: true,
        nickname: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new Error('用户不存在')
    }

    return user
  }

  // Refresh token
  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = jwtService.verifyToken(refreshToken)

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      })

      if (!user || user.status !== 'ACTIVE') {
        throw new Error('用户不存在或已被禁用')
      }

      // Generate new tokens
      const tokens = jwtService.generateTokens({
        userId: user.id,
        role: user.role,
      })

      const { passwordHash, ...userWithoutPassword } = user

      return {
        user: userWithoutPassword,
        ...tokens,
      }
    } catch (error) {
      throw new Error('刷新令牌无效')
    }
  }

  // Update user profile
  async updateProfile(userId: string, data: Partial<User>) {
    // Remove fields that shouldn't be updated directly
    const { id, phone, passwordHash, role, status, ...updateData } = data as any

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        phone: true,
        role: true,
        nickname: true,
        avatarUrl: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  }
}

export const authService = new AuthService()
