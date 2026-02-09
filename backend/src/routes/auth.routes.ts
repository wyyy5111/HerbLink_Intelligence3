import { Router } from 'express'
import { authController } from '@/controllers/auth.controller.js'
import { authMiddleware } from '@/middleware/auth.middleware.js'
import { authRateLimit } from '@/middleware/rateLimit.middleware.js'

const router = Router()

// Public routes
router.post('/register', authRateLimit, authController.register.bind(authController))
router.post('/login', authRateLimit, authController.login.bind(authController))
router.post('/refresh', authController.refreshToken.bind(authController))

// Protected routes
router.post('/logout', authMiddleware, authController.logout.bind(authController))
router.get('/me', authMiddleware, authController.getCurrentUser.bind(authController))
router.put('/me', authMiddleware, authController.updateProfile.bind(authController))

export default router
