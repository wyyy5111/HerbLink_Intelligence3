import { Request, Response } from 'express'
import { orderService } from '@/services/order.service.js'
import { apiResponse } from '@/utils/apiResponse.js'

export class OrderController {
  // Create order
  async createOrder(req: Request, res: Response) {
    try {
      const userId = req.user!.userId
      const data = req.body

      const order = await orderService.createOrder({
        ...data,
        userId,
      })

      return apiResponse.success(res, order, '订单创建成功', 201)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 400)
    }
  }

  // Get user orders
  async getUserOrders(req: Request, res: Response) {
    try {
      const userId = req.user!.userId
      const filters = {
        status: req.query.status as any,
        page: req.query.page ? Number(req.query.page) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 20,
      }

      const result = await orderService.getUserOrders(userId, filters)

      return apiResponse.success(res, result)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 500)
    }
  }

  // Get order by ID
  async getOrder(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user!.userId

      const order = await orderService.getOrderById(id, userId)

      return apiResponse.success(res, order)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 404)
    }
  }

  // Update order status
  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { status } = req.body

      const order = await orderService.updateOrderStatus(id, status)

      return apiResponse.success(res, order, '订单状态更新成功')
    } catch (error: any) {
      return apiResponse.error(res, error.message, 400)
    }
  }

  // Cancel order
  async cancelOrder(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user!.userId

      const order = await orderService.cancelOrder(id, userId)

      return apiResponse.success(res, order, '订单已取消')
    } catch (error: any) {
      return apiResponse.error(res, error.message, 400)
    }
  }

  // Payment callback
  async paymentCallback(req: Request, res: Response) {
    try {
      const { orderNo, ...paymentData } = req.body

      const order = await orderService.handlePaymentCallback(orderNo, paymentData)

      return apiResponse.success(res, order, '支付成功')
    } catch (error: any) {
      return apiResponse.error(res, error.message, 400)
    }
  }

  // Update tracking number
  async updateTracking(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { trackingNumber } = req.body

      const order = await orderService.updateTrackingNumber(id, trackingNumber)

      return apiResponse.success(res, order, '物流信息更新成功')
    } catch (error: any) {
      return apiResponse.error(res, error.message, 400)
    }
  }

  // Get order statistics
  async getOrderStats(req: Request, res: Response) {
    try {
      const userId = req.user!.userId

      const stats = await orderService.getOrderStats(userId)

      return apiResponse.success(res, stats)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 500)
    }
  }

  // Get recent orders
  async getRecentOrders(req: Request, res: Response) {
    try {
      const userId = req.user!.userId
      const limit = req.query.limit ? Number(req.query.limit) : 5

      const orders = await orderService.getRecentOrders(userId, limit)

      return apiResponse.success(res, orders)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 500)
    }
  }
}

export const orderController = new OrderController()
