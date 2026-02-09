import { Router } from 'express'
import authRoutes from './auth.routes.js'
import marketRoutes from './market.routes.js'
import productRoutes from './product.routes.js'
import orderRoutes from './order.routes.js'
import uploadRoutes from './upload.routes.js'

const router = Router()

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Mount routes
router.use('/auth', authRoutes)
router.use('/market', marketRoutes)
router.use('/products', productRoutes)
router.use('/orders', orderRoutes)
router.use('/upload', uploadRoutes)

// Additional route modules (to be implemented)
// router.use('/farms', farmRoutes)
// router.use('/livestreams', livestreamRoutes)
// router.use('/ai', aiRoutes)
// router.use('/courses', courseRoutes)

export default router
