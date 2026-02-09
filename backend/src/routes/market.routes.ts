import { Router } from 'express'
import { MarketController } from '@/controllers/market.controller.js'
import { optionalAuth } from '@/middleware/auth.middleware.js'
import { apiRateLimit } from '@/middleware/rateLimit.middleware.js'

const router = Router()
const marketController = new MarketController()

// All routes are public (with optional auth)
router.use(optionalAuth)

// Get market prices
router.get('/prices', apiRateLimit, marketController.getMarketPrices.bind(marketController))

// Get product price history
router.get('/prices/:productId', marketController.getProductPrice.bind(marketController))

// Get regional prices
router.get('/regions', marketController.getRegionPrices.bind(marketController))

// Get AI market analysis
router.post('/analysis', marketController.getMarketAnalysis.bind(marketController))

export default router
