import { PrismaClient, Product, Prisma } from '@prisma/client'
import { prisma } from '@/config/database.js'

export interface CreateProductData {
  farmId: string
  name: string
  category?: string
  description?: string
  price: number
  unit?: string
  stockQuantity?: number
  grade?: string
  isOrganic?: boolean
  imageUrls: string[]
  videoUrl?: string
  metadata?: Record<string, any>
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface ProductFilters {
  categoryId?: string
  grade?: string
  minPrice?: number
  maxPrice?: number
  isOrganic?: boolean
  search?: string
  farmId?: string
  page?: number
  pageSize?: number
}

export class ProductService {
  // Create product
  async create(data: CreateProductData) {
    // Generate trace code
    const traceCode = await this.generateTraceCode()

    const product = await prisma.product.create({
      data: {
        ...data,
        traceCode,
      },
      include: {
        farm: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    })

    return product
  }

  // Get products with filters and pagination
  async getProducts(filters: ProductFilters) {
    const {
      categoryId,
      grade,
      minPrice,
      maxPrice,
      isOrganic,
      search,
      farmId,
      page = 1,
      pageSize = 20,
    } = filters

    const where: Prisma.ProductWhereInput = {}

    if (categoryId) {
      where.category = categoryId
    }

    if (grade) {
      where.grade = grade
    }

    if (minPrice !== undefined) {
      where.price = { ...where.price, gte: minPrice }
    }

    if (maxPrice !== undefined) {
      where.price = { ...where.price, lte: maxPrice }
    }

    if (isOrganic !== undefined) {
      where.isOrganic = isOrganic
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (farmId) {
      where.farmId = farmId
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          farm: {
            select: {
              id: true,
              name: true,
              location: true,
              province: true,
              city: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ])

    return {
      items: products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  }

  // Get product by ID
  async getProductById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        farm: {
          select: {
            id: true,
            name: true,
            location: true,
            province: true,
            city: true,
            certifications: true,
          },
        },
        traceabilityRecords: {
          orderBy: { recordedAt: 'asc' },
        },
      },
    })

    if (!product) {
      throw new Error('产品不存在')
    }

    return product
  }

  // Update product
  async updateProduct(id: string, data: UpdateProductData) {
    const product = await prisma.product.update({
      where: { id },
      data,
      include: {
        farm: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    })

    return product
  }

  // Delete product
  async deleteProduct(id: string) {
    await prisma.product.delete({
      where: { id },
    })
  }

  // Search products
  async searchProducts(query: string, page = 1, pageSize = 20) {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        farm: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    })

    return products
  }

  // Get products by farm
  async getProductsByFarm(farmId: string, page = 1, pageSize = 20) {
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: { farmId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where: { farmId } }),
    ])

    return {
      items: products,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  }

  // Add traceability record
  async addTraceabilityRecord(
    productId: string,
    stage: string,
    data: {
      location?: string
      operator?: string
      stageData?: Record<string, any>
      images?: string[]
    }
  ) {
    const record = await prisma.traceabilityRecord.create({
      data: {
        productId,
        stage,
        location: data.location,
        operator: data.operator,
        data: data.stageData,
        images: data.images,
      },
    })

    return record
  }

  // Get product traceability
  async getProductTraceability(productId: string) {
    const records = await prisma.traceabilityRecord.findMany({
      where: { productId },
      orderBy: { recordedAt: 'asc' },
    })

    return records
  }

  // Update stock
  async updateStock(productId: string, quantity: number) {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: {
          increment: quantity,
        },
      },
    })

    return product
  }

  // Get featured products
  async getFeaturedProducts(limit = 10) {
    const products = await prisma.product.findMany({
      where: {
        isOrganic: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        farm: {
          select: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    })

    return products
  }

  // Get product statistics
  async getProductStats(productId: string) {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        _count: {
          select: {
            orderItems: true,
            traceabilityRecords: true,
          },
        },
      },
    })

    if (!product) {
      throw new Error('产品不存在')
    }

    return {
      totalOrders: product._count.orderItems,
      traceabilityRecords: product._count.traceabilityRecords,
    }
  }

  // Generate unique trace code
  private async generateTraceCode(): Promise<string> {
    const prefix = 'BC'
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    return `${prefix}${timestamp}${random}`.toUpperCase()
  }

  // Bulk update products
  async bulkUpdate(updates: Array<{ id: string; data: UpdateProductData }>) {
    const results = await Promise.allSettled(
      updates.map(({ id, data }) => this.updateProduct(id, data))
    )

    return results
  }
}

export const productService = new ProductService()
