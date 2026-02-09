// User types
export type UserRole = 'customer' | 'farmer' | 'admin'
export type UserStatus = 'active' | 'inactive' | 'banned'

export interface User {
  id: string
  phone: string
  role: UserRole
  nickname?: string
  avatarUrl?: string
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

// Farm types
export type FarmStatus = 'active' | 'inactive'

export interface Farm {
  id: string
  userId: string
  name: string
  location: string
  province?: string
  city?: string
  latitude?: number
  longitude?: number
  areaSize?: number // in 亩 (mu)
  certifications?: Record<string, any>
  status: FarmStatus
  createdAt: Date
}

export interface FarmMonitoring {
  id: string
  farmId: string
  soilHumidity?: number
  soilTemperature?: number
  airTemperature?: number
  airHumidity?: number
  pestRisk: 'low' | 'medium' | 'high'
  alertLevel: 'normal' | 'warning' | 'critical'
  recordedAt: Date
}

// Product types
export interface Product {
  id: string
  farmId: string
  name: string
  category?: string
  description?: string
  price: number // per kg
  unit: string
  stockQuantity?: number
  grade?: string
  isOrganic?: boolean
  traceCode?: string
  imageUrls: string[]
  videoUrl?: string
  metadata?: Record<string, any>
  createdAt: Date
}

export interface TraceabilityRecord {
  id: string
  productId: string
  stage: string // 种植/施肥/收获/加工/运输
  location?: string
  operator?: string
  data?: Record<string, any>
  images?: string[]
  recordedAt: Date
}

// Order types
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface Order {
  id: string
  userId: string
  orderNo: string
  status: OrderStatus
  totalAmount: number
  paymentMethod?: string
  paymentTime?: Date
  shippingAddress?: Record<string, any>
  trackingNumber?: string
  createdAt: Date
  updatedAt: Date
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  subtotal: number
}

// Market types
export interface MarketPrice {
  id: string
  productName: string
  region: string
  price: number
  volume?: number // in tons
  changePercent?: number
  recordedAt: Date
}

export interface MarketData {
  range: number
  price: number[]
  volume: number[]
  summary: {
    avg: number
    max: number
    min: number
    volumePeak: number
  }
}

export interface RegionPrice {
  region: string
  herb: string
  price: number
  change: number
}

// Course types
export interface Course {
  id: string
  title: string
  description?: string
  category?: string
  instructorId: string
  thumbnailUrl?: string
  videoUrl?: string
  duration?: number // in minutes
  isLive: boolean
  liveStartTime?: Date
  price: number
  viewCount: number
  createdAt: Date
}

// Livestream types
export type LivestreamStatus = 'scheduled' | 'live' | 'ended' | 'cancelled'

export interface Livestream {
  id: string
  userId: string
  title: string
  description?: string
  thumbnailUrl?: string
  streamUrl?: string
  status: LivestreamStatus
  startTime?: Date
  endTime?: Date
  viewerCount: number
  salesAmount: number
  createdAt: Date
}

// Farm Adoption types
export type AdoptionStatus = 'active' | 'completed' | 'cancelled'

export interface FarmAdoption {
  id: string
  farmId: string
  userId: string
  adoptionType: string
  areaSize?: number
  startDate: Date
  endDate: Date
  totalAmount: number
  status: AdoptionStatus
  createdAt: Date
}

// Cart types
export interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  imageUrl?: string
}

// Wallet types
export interface Wallet {
  balance: number
  points: number
  coupons: Coupon[]
}

export interface Coupon {
  id: string
  title: string
  amount: number
  minAmount: number
  expireAt: Date
  used: boolean
}

// AI types
export interface AIChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface AIIdentificationResult {
  name: string
  confidence: number
  origin: string
  quality: string
  suggestions?: string[]
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Auth types
export interface LoginRequest {
  phone: string
  password: string
  role?: UserRole
}

export interface RegisterRequest {
  phone: string
  password: string
  nickname?: string
  role: UserRole
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}
