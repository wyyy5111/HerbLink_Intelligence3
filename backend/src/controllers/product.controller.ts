import { Request, Response } from 'express'
import { productService } from '@/services/product.service.js'
import { apiResponse } from '@/utils/apiResponse.js'

export class ProductController {
  // Create product
  async createProduct(req: Request, res: Response) {
    try {
      const userId = req.user!.userId
      const data = req.body

      // Verify user owns the farm
      // In production, check if user has a farm with farmId

      const product = await productService.create(data)

      return apiResponse.success(res, product, '产品创建成功', 201)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 400)
    }
  }

  // Get products list
  async getProducts(req: Request, res: Response) {
    try {
      const filters = {
        categoryId: req.query.categoryId as string,
        grade: req.query.grade as string,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        isOrganic: req.query.isOrganic === 'true',
        search: req.query.search as string,
        farmId: req.query.farmId as string,
        page: req.query.page ? Number(req.query.page) : 1,
        pageSize: req.query.pageSize ? Number(req.query.pageSize) : 20,
      }

      const result = await productService.getProducts(filters)

      return apiResponse.success(res, result)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 500)
    }
  }

  // Get product by ID
  async getProduct(req: Request, res: Response) {
    try {
      const { id } = req.params
      const product = await productService.getProductById(id)

      return apiResponse.success(res, product)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 404)
    }
  }

  // Update product
  async updateProduct(req: Request, res: Response) {
    try {
      const { id } = req.params
      const data = req.body
      const userId = req.user!.userId

      // Verify ownership
      // In production, check if product belongs to user's farm

      const product = await productService.updateProduct(id, data)

      return apiResponse.success(res, product, '产品更新成功')
    } catch (error: any) {
      return apiResponse.error(res, error.message, 400)
    }
  }

  // Delete product
  async deleteProduct(req: Request, res: Response) {
    try {
      const { id } = req.params
      const userId = req.user!.userId

      // Verify ownership
      // In production, check if product belongs to user's farm

      await productService.deleteProduct(id)

      return apiResponse.success(res, null, '产品删除成功')
    } catch (error: any) {
      return apiResponse.error(res, error.message, 400)
    }
  }

  // Search products
  async searchProducts(req: Request, res: Response) {
    try {
      const { q } = req.query
      const page = req.query.page ? Number(req.query.page) : 1
      const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 20

      if (!q || typeof q !== 'string') {
        return apiResponse.error(res, '搜索关键词不能为空', 400)
      }

      const products = await productService.searchProducts(q, page, pageSize)

      return apiResponse.success(res, products)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 500)
    }
  }

  // Get product traceability
  async getProductTraceability(req: Request, res: Response) {
    try {
      const { id } = req.params
      const records = await productService.getProductTraceability(id)

      return apiResponse.success(res, records)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 500)
    }
  }

  // Get featured products
  async getFeaturedProducts(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10
      const products = await productService.getFeaturedProducts(limit)

      return apiResponse.success(res, products)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 500)
    }
  }

  // Add traceability record
  async addTraceabilityRecord(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { stage, location, operator, data, images } = req.body

      const record = await productService.addTraceabilityRecord(id, {
        stage,
        location,
        operator,
        stageData: data,
        images,
      })

      return apiResponse.success(res, record, '溯源记录添加成功', 201)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 400)
    }
  }

  // Update stock
  async updateStock(req: Request, res: Response) {
    try {
      const { id } = req.params
      const { quantity } = req.body

      const product = await productService.updateStock(id, quantity)

      return apiResponse.success(res, product, '库存更新成功')
    } catch (error: any) {
      return apiResponse.error(res, error.message, 400)
    }
  }
}

export const productController = new ProductController()
