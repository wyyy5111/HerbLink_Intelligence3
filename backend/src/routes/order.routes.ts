import { Router } from 'express'
import { orderController } from '@/controllers/order.controller.js'
import { authMiddleware, authorize } from '@/middleware/auth.middleware.js'

const router = Router()

// All routes require authentication
router.use(authMiddleware)

// Customer routes
router.get('/', orderController.getUserOrders.bind(orderController))
router.get('/recent', orderController.getRecentOrders.bind(orderController))
router.get('/stats', orderController.getOrderStats.bind(orderController))
router.get('/:id', orderController.getOrder.bind(orderController))
router.post('/', orderController.createOrder.bind(orderController))
router.post('/:id/cancel', orderController.cancelOrder.bind(orderController))

// Admin/Farmer routes
router.put('/:id/status', authorize('admin', 'farmer'), orderController.updateOrderStatus.bind(orderController))
router.put('/:id/tracking', authorize('admin', 'farmer'), orderController.updateTracking.bind(orderController))

// Payment callback (public, but secured by signature in production)
router.post('/payment/callback', orderController.paymentCallback.bind(orderController))

export default router
