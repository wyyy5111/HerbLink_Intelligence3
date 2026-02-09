import { Router } from 'express'
import { productController } from '@/controllers/product.controller.js'
import { authMiddleware, authorize } from '@/middleware/auth.middleware.js'
import { apiRateLimit } from '@/middleware/rateLimit.middleware.js'

const router = Router()

// Public routes - read only
router.get('/', apiRateLimit, productController.getProducts.bind(productController))
router.get('/search', apiRateLimit, productController.searchProducts.bind(productController))
router.get('/featured', apiRateLimit, productController.getFeaturedProducts.bind(productController))
router.get('/:id', apiRateLimit, productController.getProduct.bind(productController))
router.get('/:id/traceability', apiRateLimit, productController.getProductTraceability.bind(productController))

// Protected routes - require authentication
router.use(authMiddleware)

// Farmer/Admin only routes
router.post('/', authorize('farmer', 'admin'), productController.createProduct.bind(productController))
router.put('/:id', authorize('farmer', 'admin'), productController.updateProduct.bind(productController))
router.delete('/:id', authorize('farmer', 'admin'), productController.deleteProduct.bind(productController))
router.post('/:id/traceability', authorize('farmer', 'admin'), productController.addTraceabilityRecord.bind(productController))
router.patch('/:id/stock', authorize('farmer', 'admin'), productController.updateStock.bind(productController))

export default router
