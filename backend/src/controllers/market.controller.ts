import { Request, Response } from 'express'
import { apiResponse } from '@/utils/apiResponse.js'

// Mock market data
const marketPriceData = [
  412, 428, 436, 452, 468, 460, 472, 488, 476, 492, 486, 498, 474, 468, 482
]

const volumeData = [
  12.1, 13.4, 14.2, 15.6, 18.4, 16.8, 19.2, 20.1, 18.9, 21.3, 20.6, 22.8, 19.7, 18.4, 19.9
]

const regionPrices = [
  { region: '甘肃·岷县', herb: '当归', price: 312, change: 2.1 },
  { region: '贵州·平坝', herb: '金银花', price: 188, change: 1.4 },
  { region: '四川·阿坝', herb: '川贝母', price: 468, change: 3.2 },
  { region: '云南·文山', herb: '三七', price: 356, change: -0.6 },
  { region: '河北·安国', herb: '黄芪', price: 224, change: 1.1 },
  { region: '浙江·磐安', herb: '浙贝母', price: 198, change: -1.2 },
  { region: '河南·焦作', herb: '怀山药', price: 86, change: 0.8 },
]

export class MarketController {
  // Get market prices
  async getMarketPrices(req: Request, res: Response) {
    try {
      const range = parseInt(req.query.range as string) || 15
      const productId = req.query.productId as string

      // In production, fetch from database based on productId
      const prices = marketPriceData.slice(0, Math.min(range, marketPriceData.length))
      const volumes = volumeData.slice(0, Math.min(range, volumeData.length))

      const avg = prices.reduce((a, b) => a + b, 0) / prices.length
      const max = Math.max(...prices)
      const min = Math.min(...prices)

      return apiResponse.success(res, {
        range,
        price: prices,
        volume: volumes,
        summary: {
          avg: Math.round(avg),
          max,
          min,
          volumePeak: Math.max(...volumes),
        },
      })
    } catch (error: any) {
      return apiResponse.error(res, error.message, 500)
    }
  }

  // Get product price history
  async getProductPrice(req: Request, res: Response) {
    try {
      const { productId } = req.params
      const range = parseInt(req.query.range as string) || 15

      // In production, fetch specific product data
      const prices = marketPriceData.slice(0, Math.min(range, marketPriceData.length))
      const volumes = volumeData.slice(0, Math.min(range, volumeData.length))

      const avg = prices.reduce((a, b) => a + b, 0) / prices.length

      return apiResponse.success(res, {
        productId,
        range,
        price: prices,
        volume: volumes,
        summary: {
          avg: Math.round(avg),
          max: Math.max(...prices),
          min: Math.min(...prices),
        },
      })
    } catch (error: any) {
      return apiResponse.error(res, error.message, 500)
    }
  }

  // Get regional prices
  async getRegionPrices(req: Request, res: Response) {
    try {
      return apiResponse.success(res, { regions: regionPrices })
    } catch (error: any) {
      return apiResponse.error(res, error.message, 500)
    }
  }

  // Get AI market analysis
  async getMarketAnalysis(req: Request, res: Response) {
    try {
      const { productId } = req.body

      // Mock AI analysis
      const analysis = {
        analysis: '根据近7日数据分析，当归价格呈现稳步上涨趋势，主要受市场需求增加和产量减少的双重影响。预计未来一周价格将继续保持上涨态势。',
        prediction: '预计未来7天当归价格将在315-325元/公斤区间波动，建议关注产区天气变化和市场动态。',
        trends: [
          '市场需求持续旺盛',
          '部分产区产量减少',
          '库存处于正常水平',
          '出口订单增加',
        ],
      }

      return apiResponse.success(res, analysis)
    } catch (error: any) {
      return apiResponse.error(res, error.message, 500)
    }
  }
}
