import { PrismaClient, Order, OrderStatus } from '@prisma/client'
import { prisma } from '@/config/database.js'

export interface CreateOrderData {
  userId: string
  items: Array<{
    productId: string
    quantity: number
  }>
  shippingAddress: {
    name: string
    phone: string
    province: string
    city: string
    district: string
    address: string
  }
  paymentMethod: string
  couponId?: string
}

export class OrderService {
  // Create order
  async createOrder(data: CreateOrderData) {
    const { userId, items, shippingAddress, paymentMethod, couponId } = data

    // Get product details and calculate total
    const productIds = items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { farm: true },
    })

    if (products.length !== items.length) {
      throw new Error('部分产品不存在')
    }

    // Calculate total amount
    let totalAmount = 0
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!
      const subtotal = product.price * item.quantity
      totalAmount += subtotal

      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
      }
    })

    // Apply coupon if provided
    let discount = 0
    if (couponId) {
      // Calculate discount
      // For now, just a simple implementation
      discount = 0
    }

    totalAmount -= discount

    // Generate order number
    const orderNo = await this.generateOrderNo()

    // Create order
    const order = await prisma.order.create({
      data: {
        userId,
        orderNo,
        status: 'PENDING',
        totalAmount,
        paymentMethod,
        shippingAddress,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    })

    // Update stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            decrement: item.quantity,
          },
        },
      })
    }

    return order
  }

  // Get user orders
  async getUserOrders(userId: string, filters: {
    status?: OrderStatus
    page?: number
    pageSize?: number
  }) {
    const { status, page = 1, pageSize = 20 } = filters

    const where: any = { userId }
    if (status) {
      where.status = status
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrls: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ])

    return {
      items: orders,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  }

  // Get order by ID
  async getOrderById(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                farm: {
                  select: {
                    name: true,
                    location: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    if (!order) {
      throw new Error('订单不存在')
    }

    return order
  }

  // Update order status
  async updateOrderStatus(orderId: string, status: OrderStatus) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })

    return order
  }

  // Payment callback
  async handlePaymentCallback(orderNo: string, paymentData: any) {
    const order = await prisma.order.findUnique({
      where: { orderNo },
    })

    if (!order) {
      throw new Error('订单不存在')
    }

    if (order.status !== 'PENDING') {
      throw new Error('订单状态异常')
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'PAID',
        paymentTime: new Date(),
      },
    })

    return updatedOrder
  }

  // Cancel order
  async cancelOrder(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: true,
      },
    })

    if (!order) {
      throw new Error('订单不存在')
    }

    if (order.status !== 'PENDING') {
      throw new Error('订单状态不允许取消')
    }

    // Restore stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stockQuantity: {
            increment: item.quantity,
          },
        },
      })
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    })

    return updatedOrder
  }

  // Update tracking number
  async updateTrackingNumber(orderId: string, trackingNumber: string) {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingNumber,
        status: 'SHIPPED',
      },
    })

    return order
  }

  // Get order statistics
  async getOrderStats(userId: string) {
    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSpent,
    ] = await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.count({ where: { userId, status: 'PENDING' } }),
      prisma.order.count({ where: { userId, status: 'DELIVERED' } }),
      prisma.order.aggregate({
        where: { userId, status: 'DELIVERED' },
        _sum: { totalAmount: true },
      }),
    ])

    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalSpent: totalSpent._sum.totalAmount || 0,
    }
  }

  // Generate unique order number
  private async generateOrderNo(): Promise<string> {
    const prefix = 'BC'
    const date = new Date()
    const dateStr = date.getFullYear().toString() +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      date.getDate().toString().padStart(2, '0')
    const timestamp = date.getTime().toString().slice(-6)
    const random = Math.random().toString().slice(2, 6)

    return `${prefix}${dateStr}${timestamp}${random}`
  }

  // Get recent orders
  async getRecentOrders(userId: string, limit = 5) {
    const orders = await prisma.order.findMany({
      where: { userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                imageUrls: true,
              },
            },
          },
        },
      },
    })

    return orders
  }
}

export const orderService = new OrderService()
